import { Component, OnInit } from '@angular/core';
import { IonRefresher, ModalController, Platform } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { LoadingOptions } from '@ionic/core';
import { merge, Observable, of, Subscription } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { KeepAwake as Insomnia } from '@capacitor-community/keep-awake';

import { AuthenticationProvider } from '@providers/authentication/authentication';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { BasePageComponent } from '@shared/classes/base-page';
import { StoreModel } from '@shared/models/store.model';
import { ErrorTypes } from '@shared/models/error-message';
import { DateTime } from '@shared/helpers/date-time';
import { MesError } from '@shared/models/mes-error.model';
import * as journalActions from '@store/journal/journal.actions';
import {
  canNavigateToNextDay,
  canNavigateToPreviousDay,
  getError,
  getIsLoading,
  getLastRefreshed,
  getLastRefreshedTime,
  getSelectedDate,
  getSlotsOnSelectedDate,
} from '@store/journal/journal.selector';
import { getJournalState } from '@store/journal/journal.reducer';
import { selectVersionNumber } from '@store/app-info/app-info.selectors';
import { DeviceProvider } from '@providers/device/device';
import { LoadingProvider } from '@providers/loader/loader';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { ErrorPage } from '../error-page/error';

interface JournalPageState {
  selectedDate$: Observable<string>;
  slots$: Observable<SlotItem[]>;
  error$: Observable<MesError>;
  isLoading$: Observable<boolean>;
  lastRefreshedTime$: Observable<string>;
  appVersion$: Observable<string>;
  completedTests$: Observable<SearchResultTestSchema[]>;
  isOffline$: Observable<boolean>;
  canNavigateToPreviousDay$: Observable<boolean>;
  canNavigateToNextDay$: Observable<boolean>;
  isSelectedDateToday$: Observable<boolean>;
}

@Component({
  selector: 'app-journal',
  templateUrl: './journal.page.html',
  styleUrls: ['./journal.page.scss'],
})
export class JournalPage extends BasePageComponent implements OnInit {
  private static loadingOpts: LoadingOptions = {
    id: 'journal_loading_spinner',
    spinner: 'circles',
    backdropDismiss: true,
    translucent: false,
  };
  pageState: JournalPageState;
  pageRefresher: IonRefresher;
  subscription: Subscription;
  merged$: Observable<any>;
  todaysDate: DateTime;
  platformSubscription: Subscription;

  constructor(
    public modalController: ModalController,
    public orientationMonitorProvider: OrientationMonitorProvider,
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    private store$: Store<StoreModel>,
    public dateTimeProvider: DateTimeProvider,
    private accessibilityService: AccessibilityService,
    private networkStateProvider: NetworkStateProvider,
    private deviceProvider: DeviceProvider,
    public loadingProvider: LoadingProvider,
    public appConfigProvider: AppConfigProvider,
  ) {
    super(platform, authenticationProvider, router);
    this.store$.dispatch(journalActions.SetSelectedDate(this.dateTimeProvider.now()
      .format('YYYY-MM-DD')));
    this.todaysDate = this.dateTimeProvider.now();
  }

  ngOnInit(): void {
    this.pageState = {
      selectedDate$: this.store$.pipe(
        select(getJournalState),
        map(getSelectedDate),
      ),
      slots$: this.store$.pipe(
        select(getJournalState),
        map(getSlotsOnSelectedDate),
      ),
      error$: this.store$.pipe(
        select(getJournalState),
        map(getError),
        take(1),
      ),
      isLoading$: this.store$.pipe(
        select(getJournalState),
        map(getIsLoading),
      ),
      lastRefreshedTime$: this.store$.pipe(
        select(getJournalState),
        map(getLastRefreshed),
        map(getLastRefreshedTime),
      ),
      appVersion$: this.store$.select(selectVersionNumber),
      isOffline$: this.networkStateProvider.isOffline$,
      canNavigateToPreviousDay$: this.store$.pipe(
        select(getJournalState),
        map((journal) => canNavigateToPreviousDay(journal, this.dateTimeProvider.now())),
      ),
      canNavigateToNextDay$: this.store$.pipe(
        select(getJournalState),
        map(canNavigateToNextDay),
      ),
      isSelectedDateToday$: this.store$.pipe(
        select(getJournalState),
        map(getSelectedDate),
        map((selectedDate) => selectedDate === this.dateTimeProvider.now()
          .format('YYYY-MM-DD')),
      ),
      completedTests$: of([]),
    };

    const {
      error$,
      isLoading$,
    } = this.pageState;

    this.merged$ = merge(
      error$.pipe(switchMap(this.showError)),
      isLoading$.pipe(map(this.handleLoadingUI)),
    );
  }

  ionViewDidLeave(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async ionViewWillEnter(): Promise<boolean> {
    super.ionViewWillEnter();
    await this.orientationMonitorProvider.monitorOrientation();
    await this.loadJournalManually();
    this.setupPolling();
    this.configurePlatformSubscriptions();

    if (this.merged$) {
      this.subscription = this.merged$.subscribe();
    }
    this.todaysDate = this.dateTimeProvider.now();

    return true;
  }

  async ionViewWillLeave(): Promise<void> {
    this.store$.dispatch(journalActions.StopPolling());

    if (this.platformSubscription) {
      this.platformSubscription.unsubscribe();
    }
    await ScreenOrientation.removeAllListeners();
  }

  async ionViewDidEnter(): Promise<void> {
    this.store$.dispatch(journalActions.JournalViewDidEnter());

    if (super.isIos()) {
      await ScreenOrientation.unlock();
      await Insomnia.allowSleep();
      await this.deviceProvider.disableSingleAppMode();
    }
  }

  async loadJournalManually() {
    await this.loadingProvider.handleUILoading(true, JournalPage.loadingOpts);
    this.store$.dispatch(journalActions.LoadJournal());
  }

  setupPolling() {
    this.store$.dispatch(journalActions.SetupPolling());
  }

  configurePlatformSubscriptions(): void {
    if (super.isIos()) {
      const merged$ = merge(
        this.platform.resume.pipe(switchMap(async () => this.refreshJournal())),
      );
      this.platformSubscription = merged$.subscribe();
    }
  }

  handleLoadingUI = async (isLoading: boolean) => {
    if (!isLoading) {
      await this.loadingProvider.handleUILoading(isLoading, JournalPage.loadingOpts);
    }

    if (this.pageRefresher) {
      this.pageRefresher['detail'].complete();
      this.pageRefresher = null;
    }
    return null;
  };

  showError = async (error: MesError) => {
    if (error === undefined || error.message === '') return;
    // Modals are at the same level as the ion-nav so are not getting the zoom level class,
    // this needs to be passed in the create options.

    const zoomClass = `modal-fullscreen ${this.accessibilityService.getTextZoomClass()}`;

    const modal = await this.modalController.create({
      component: ErrorPage,
      componentProps: {
        errorType: ErrorTypes.JOURNAL_REFRESH,
        displayAsModal: true,
      },
      cssClass: zoomClass,
    });

    await modal.present();
  };

  public pullRefreshJournal = async (refresher: IonRefresher) => {
    await this.refreshJournal();
    this.pageRefresher = refresher;
  };

  public refreshJournal = async () => {
    await this.loadJournalManually();
  };

  onPreviousDayClick(): void {
    this.store$.dispatch(journalActions.SelectPreviousDay());
  }

  onNextDayClick(): void {
    this.store$.dispatch(journalActions.SelectNextDay());
  }
}
