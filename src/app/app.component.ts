import { Component, Injector, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

import { StatusBar, Style } from '@capacitor/status-bar';
import { MenuController } from '@ionic/angular';
import { merge, Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import * as Sentry from '@sentry/capacitor';
import { BrowserTracing, init as sentryAngularInit } from '@sentry/angular-ivy';
import { Storage } from '@ionic/storage-angular';

import { DataStoreProvider } from '@providers/data-store/data-store';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { LogoutBasePageComponent } from '@shared/classes/logout-base-page';
import { AppResumed, AppSuspended, LoadAppVersion } from '@store/app-info/app-info.actions';
import { selectLogoutEnabled } from '@store/app-config/app-config.selectors';
import { Capacitor } from '@capacitor/core';
import { AppInfoProvider } from '@providers/app-info/app-info';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { SENTRY_ERRORS } from '@app/sentry-error-handler';
import { DASHBOARD_PAGE, LOGIN_PAGE, UNUPLOADED_TESTS_PAGE } from '@pages/page-names.constants';
import { SideMenuClosed, SideMenuItemSelected, SideMenuOpened } from '@pages/dashboard/dashboard.actions';
import { SlotProvider } from '@providers/slot/slot';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { unsubmittedTestSlotsCount$ } from '@pages/unuploaded-tests/unuploaded-tests.selector';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { StartSendingLogs, StopLogPolling } from '@store/logs/logs.actions';
import { StartSendingCompletedTests, StopSendingCompletedTests } from '@store/tests/tests.actions';
import { SetupPolling, StopPolling } from '@store/journal/journal.actions';
import { getJournalState } from '@store/journal/journal.reducer';
import { getTests } from '@store/tests/tests.reducer';

interface AppComponentPageState {
  logoutEnabled$: Observable<boolean>;
  unSubmittedTestSlotsCount$: Observable<number>;
}

export interface Page {
  title: string;
  descriptor: string;
  showUnSubmittedCount?: boolean;
  hideWhenRole?: ExaminerRole[];
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent extends LogoutBasePageComponent implements OnInit {
  pages: Page[] = [
    {
      title: DASHBOARD_PAGE,
      descriptor: 'Dashboard',
    },
    {
      title: UNUPLOADED_TESTS_PAGE,
      descriptor: 'Unsubmitted tests',
      showUnSubmittedCount: true,
      hideWhenRole: [ExaminerRole.DLG],
    },
    // {
    //   title: PASS_CERTIFICATES,
    //   descriptor: 'Missing / spoiled pass certificates',
    // },
  ];

  pageState: AppComponentPageState;

  private platformSubscription: Subscription;

  constructor(
    private slotProvider: SlotProvider,
    private dateTimeProvider: DateTimeProvider,
    protected accessibilityService: AccessibilityService,
    protected menuController: MenuController,
    protected dataStore: DataStoreProvider,
    protected networkStateProvider: NetworkStateProvider,
    protected translate: TranslateService,
    protected appInfo: AppInfoProvider,
    protected appConfigProvider: AppConfigProvider,
    private storage: Storage,
    injector: Injector,
  ) {
    super(injector);
  }

  async ngOnInit() {
    try {
      await this.platform.ready();
      alert('hello');
      await this.storage.create();
      if (this.platform.is('cordova')) {
        await this.deviceProvider.disableSingleAppMode();
      }
      await this.appConfigProvider.initialiseAppConfig();
      await this.initialiseSentry();
      this.initialiseNetworkState();
      this.initialiseAuthentication();

      await this.initialisePersistentStorage();
      this.store$.dispatch(LoadAppVersion());
      await this.configureStatusBar();
      this.configureLocale();
      if (this.platform.is('cordova')) {
        await this.accessibilityService.configureAccessibility();
        this.configurePlatformSubscriptions();
      }
      await this.disableMenuSwipe();

      this.pageState = {
        logoutEnabled$: this.store$.select(selectLogoutEnabled),
        unSubmittedTestSlotsCount$: unsubmittedTestSlotsCount$(
          this.store$.select(getJournalState),
          this.store$.select(getTests),
          this.dateTimeProvider,
          this.slotProvider,
          this.appConfigProvider.getAppConfig()?.journal?.numberOfDaysToView,
        ),
      };

    } catch {
      await this.router.navigate([LOGIN_PAGE], { replaceUrl: true });
    }
  }

  ionViewWillUnload() {
    if (this.platformSubscription) {
      this.platformSubscription.unsubscribe();
    }
  }

  public initialiseAuthentication = (): void => {
    this.authenticationProvider.initialiseAuthentication();
    this.authenticationProvider.determineAuthenticationMode();
  };

  public initialiseNetworkState = (): void => {
    this.networkStateProvider.initialiseNetworkState();
  };

  async initialisePersistentStorage(): Promise<void> {
    if (this.isIos()) {
      try {
        // if already been done, no need to create container again or run the migrate method
        if (await this.dataStore.hasStorageBeenMigrated()) return;
        // if not done, create as normal
        await this.dataStore.createContainer();
        // once the container exists, if there's any data in the old storage, migrate it to the new one
        await this.dataStore.migrateAllKeys();
        return await Promise.resolve();
      } catch (err) {
        return Promise.reject(err);
      }
    }
  }

  configurePlatformSubscriptions(): void {
    const merged$ = merge(
      this.platform.resume.pipe(
        map(this.onAppResumed),
      ),
      this.platform.pause.pipe(
        map(this.onAppSuspended),
      ),
    );
    this.platformSubscription = merged$.subscribe();
  }

  onAppResumed = async (): Promise<void> => {
    await this.accessibilityService.afterAppResume();
    this.store$.dispatch(AppResumed());
    this.store$.dispatch(SetupPolling());
    this.store$.dispatch(StartSendingLogs());
    this.store$.dispatch(StartSendingCompletedTests());
  };

  onAppSuspended = (): void => {
    this.store$.dispatch(AppSuspended());
    this.store$.dispatch(StopPolling());
    this.store$.dispatch(StopLogPolling());
    this.store$.dispatch(StopSendingCompletedTests());
  };

  configureStatusBar = async (): Promise<void> => {
    if (Capacitor.isPluginAvailable('StatusBar')) {
      await StatusBar.setStyle({ style: Style.Dark });
    }
  };

  disableMenuSwipe = async (): Promise<void> => {
    await this.menuController.swipeGesture(false);
  };

  onLogoutClick = async (): Promise<void> => {
    await this.openLogoutModal();
  };

  configureLocale(): void {
    this.translate.setDefaultLang('en');
  }

  initialiseSentry = async () => {
    // don't run sentry in browser;
    if (!this.platform.is('cordova')) return;

    const appVersion: string = await this.appInfo.getFullVersionNumber();

    const { sentry } = this.appConfigProvider.getAppConfig();

    Sentry.init({
      dsn: sentry?.dsn,
      enabled: !!sentry?.dsn,
      environment: sentry?.environment,
      release: `des@${appVersion}`,
      dist: appVersion,
      tracesSampleRate: 0.01, // 1% of transactions are captured;
      integrations: [new BrowserTracing()],
      ignoreErrors: SENTRY_ERRORS,
    }, sentryAngularInit);

    return Promise.resolve();
  };

  navPage = async (page: Page): Promise<void> => {
    await this.router.navigate([page.title]);
    await this.menuController.close();
    this.store$.dispatch(SideMenuItemSelected(page.descriptor));
  };

  closeSideMenu = (): void => {
    this.store$.dispatch(SideMenuClosed());
  };

  openSideMenu = (): void => {
    this.store$.dispatch(SideMenuOpened());
  };
}
