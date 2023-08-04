import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import {
  combineLatest, from, merge, Observable, Subscription,
} from 'rxjs';
import {
  filter, map, switchMap, tap, withLatestFrom,
} from 'rxjs/operators';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import { ExaminerRole, ExaminerRoleDescription } from '@providers/app-config/constants/examiner-role.constants';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { DeviceProvider } from '@providers/device/device';
import { StoreModel } from '@shared/models/store.model';
import { DateTime } from '@shared/helpers/date-time';
import { BasePageComponent } from '@shared/classes/base-page';
import {
  getUpdateAvailableCount$,
  selectLiveAppVersion,
  selectRole,
  showUpdateAvailable$,
} from '@store/app-config/app-config.selectors';
import {
  selectEmployeeId,
  selectEmployeeName,
  selectUpdateAvailablePresented,
  selectVersionNumber,
} from '@store/app-info/app-info.selectors';
import * as journalActions from '@store/journal/journal.actions';
import { ClearCandidateLicenceData } from '@pages/candidate-licence/candidate-licence.actions';
import { RekeySearchClearState } from '@pages/rekey-search/rekey-search.actions';
import { ClearVehicleData } from '@pages/back-to-office/back-to-office.actions';
import { SlotProvider } from '@providers/slot/slot';
import { unsubmittedTestSlotsCount$ } from '@pages/unuploaded-tests/unuploaded-tests.selector';
import { sumFlatArray } from '@shared/helpers/sum-number-array';
import { StoreUnuploadedSlotsInTests } from '@pages/unuploaded-tests/unuploaded-tests.actions';
import {
  UpdateAvailable,
  UpdateAvailableModal,
} from '@pages/dashboard/components/update-available-modal/update-available-modal';
import {
  HasSeenUpdateAvailablePopup,
  UpdateAvailableBadgeClicked,
  UpdateAvailableOptionClicked,
  UpdateAvailablePopup,
} from '@store/app-info/app-info.actions';
import { DashboardViewDidEnter, PracticeTestReportCard } from './dashboard.actions';

interface DashboardPageState {
  appVersion$: Observable<string>;
  employeeName$: Observable<string>;
  employeeId$: Observable<string>;
  role$: Observable<string>;
  liveAppVersion$: Observable<string>;
  showUpdatesAvailable$: Observable<boolean>;
  isOffline$: Observable<boolean>;
  notificationCount$: Observable<number>;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
})
export class DashboardPage extends BasePageComponent {

  pageState: DashboardPageState;
  todaysDateFormatted: string;
  todaysDate: DateTime;
  liveAppVersion: string;
  subscription: Subscription;
  private merged$: Observable<void | string>;

  isOffline: boolean = false;

  constructor(
    protected alertController: AlertController,
    private appConfigProvider: AppConfigProvider,
    private store$: Store<StoreModel>,
    private dateTimeProvider: DateTimeProvider,
    private networkStateProvider: NetworkStateProvider,
    private insomnia: Insomnia,
    public deviceProvider: DeviceProvider,
    private completedTestPersistenceProvider: CompletedTestPersistenceProvider,
    private slotProvider: SlotProvider,
    private modalController: ModalController,
    authenticationProvider: AuthenticationProvider,
    platform: Platform,
    router: Router,
  ) {
    super(platform, authenticationProvider, router);
    this.todaysDate = this.dateTimeProvider.now();
    this.todaysDateFormatted = this.dateTimeProvider.now()
      .format('dddd Do MMMM YYYY');
    this.store$.dispatch(journalActions.SetSelectedDate(this.dateTimeProvider.now()
      .format('YYYY-MM-DD')));
  }

  ngOnInit() {
    this.pageState = {
      appVersion$: this.store$.select(selectVersionNumber),
      employeeName$: this.store$.select(selectEmployeeName),
      employeeId$: this.store$.select(selectEmployeeId)
        .pipe(
          map(this.getEmployeeNumberDisplayValue),
        ),
      role$: this.store$.select(selectRole)
        .pipe(
          map(this.getRoleDisplayValue),
        ),
      liveAppVersion$: this.store$.select(selectLiveAppVersion),
      showUpdatesAvailable$: showUpdateAvailable$(this.store$, this.platform),
      isOffline$: this.networkStateProvider.isOffline$,
      notificationCount$: combineLatest([
        unsubmittedTestSlotsCount$(this.store$, this.dateTimeProvider, this.slotProvider),
        getUpdateAvailableCount$(this.store$, this.platform),
      ])
        .pipe(
          map(sumFlatArray), /* Sum all individual counts to determine, overall count */
        ),
    };

    this.merged$ = merge(
      this.pageState.liveAppVersion$.pipe(
        tap((appVersion) => this.liveAppVersion = appVersion),
      ),
      this.pageState.showUpdatesAvailable$.pipe(
        withLatestFrom(this.store$.select(selectUpdateAvailablePresented)),
        filter((
          [showBasedOnAppVersion, hasUpdateAvailablePresented],
        ) => showBasedOnAppVersion && (hasUpdateAvailablePresented !== true)),
        switchMap(() => from(this.showUpdateAvailableModal())),
      ),
    );
  }

  async ionViewDidEnter(): Promise<void> {
    this.store$.dispatch(DashboardViewDidEnter());
    this.store$.dispatch(ClearCandidateLicenceData());
    this.store$.dispatch(ClearVehicleData());
    this.store$.dispatch(StoreUnuploadedSlotsInTests());
    this.store$.dispatch(journalActions.LoadJournalSilent());

    if (super.isIos()) {
      await ScreenOrientation.unlock();
      await this.insomnia.allowSleepAgain();
      await this.deviceProvider.disableSingleAppMode();
    }

    if (this.merged$) {
      this.subscription = this.merged$.subscribe();
    }
  }

  async ionViewWillEnter(): Promise<boolean> {
    super.ionViewWillEnter();
    this.todaysDate = this.dateTimeProvider.now();
    this.todaysDateFormatted = this.dateTimeProvider.now()
      .format('dddd Do MMMM YYYY');
    await this.completedTestPersistenceProvider.loadCompletedPersistedTests();
    return true;
  }

  ionViewDidLeave(): void {
    this.store$.dispatch(RekeySearchClearState());

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  showTestReportPracticeMode = (): boolean =>
    this.appConfigProvider.getAppConfig()?.journal.enableTestReportPracticeMode;

  showEndToEndPracticeMode = (): boolean =>
    this.appConfigProvider.getAppConfig()?.journal.enableEndToEndPracticeMode;

  showDelegatedExaminerRekey = (): boolean =>
    this.appConfigProvider.getAppConfig()?.role === ExaminerRole.DLG;

  getRoleDisplayValue = (role: string): string => ExaminerRoleDescription[role] || 'Unknown Role';

  getEmployeeNumberDisplayValue = (employeeNumber: string): string => employeeNumber || 'NOT_KNOWN';

  practiceTestReportCardClicked = (): void => {
    this.store$.dispatch(PracticeTestReportCard());
  };

  async showUpdateAvailableModal(manualClick: boolean = false): Promise<void> {
    if (manualClick) {
      this.store$.dispatch(UpdateAvailableBadgeClicked());
    }

    const modal = await this.modalController.create({
      component: UpdateAvailableModal,
      componentProps: { appVersion: this.liveAppVersion },
      cssClass: 'mes-modal-alert text-zoom-regular',
      backdropDismiss: false,
      showBackdrop: true,
    });

    this.store$.dispatch(UpdateAvailablePopup());

    await modal.present();
    const { data } = await modal.onDidDismiss<UpdateAvailable>();

    this.store$.dispatch(UpdateAvailableOptionClicked(data));
    this.store$.dispatch(HasSeenUpdateAvailablePopup(true));
  }
}
