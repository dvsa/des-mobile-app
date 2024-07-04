import { Component, Injector, OnInit } from '@angular/core';
import { ModalController, RefresherEventDetail } from '@ionic/angular';
import { select } from '@ngrx/store';
import { IonRefresherCustomEvent, LoadingOptions } from '@ionic/core';
import { combineLatest, merge, Observable, Subscription } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';

import { SlotItem } from '@providers/slot-selector/slot-item';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { BasePageComponent } from '@shared/classes/base-page';
import { ErrorTypes } from '@shared/models/error-message';
import { DateTime } from '@shared/helpers/date-time';
import { MesError } from '@shared/models/mes-error.model';
import * as journalActions from '@store/journal/journal.actions';
import {
  canNavigateToNextDay,
  canNavigateToPreviousDay, getAllSlots,
  getError,
  getIsLoading,
  getLastRefreshed,
  getLastRefreshedTime,
  getSelectedDate,
  getSlotsOnSelectedDate,
} from '@store/journal/journal.selector';
import { getJournalState } from '@store/journal/journal.reducer';
import { selectVersionNumber } from '@store/app-info/app-info.selectors';
import { LoadingProvider } from '@providers/loader/loader';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { ErrorPage } from '../error-page/error';
import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import {
  getTests,
} from '@store/tests/tests.reducer';
import { TestsModel } from '@store/tests/tests.model';
import { JournalRehydrationProvider } from '@providers/journal-rehydration/journal-rehydration';

interface JournalPageState {
  selectedDate$: Observable<string>;
  slotsOnSelectedDate$: Observable<SlotItem[]>;
  allSlots$: Observable<SlotItem[]>;
  error$: Observable<MesError>;
  isLoading$: Observable<boolean>;
  lastRefreshedTime$: Observable<string>;
  appVersion$: Observable<string>;
  isOffline$: Observable<boolean>;
  canNavigateToPreviousDay$: Observable<boolean>;
  canNavigateToNextDay$: Observable<boolean>;
  isSelectedDateToday$: Observable<boolean>;
  testModel$: Observable<TestsModel>;
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
  pageRefresher: IonRefresherCustomEvent<RefresherEventDetail>;
  subscription: Subscription;
  rehydrationSubscription: Subscription;
  merged$: Observable<any>;
  todaysDate: DateTime;
  platformSubscription: Subscription;
  isRehydrated: boolean = false;

  constructor(
    public modalController: ModalController,
    public orientationMonitorProvider: OrientationMonitorProvider,
    public dateTimeProvider: DateTimeProvider,
    private accessibilityService: AccessibilityService,
    private networkStateProvider: NetworkStateProvider,
    public loadingProvider: LoadingProvider,
    private completedTestPersistenceProvider: CompletedTestPersistenceProvider,
    private journalRehydrationService: JournalRehydrationProvider,
    injector: Injector,
  ) {
    super(injector);

    this.store$.dispatch(journalActions.SetSelectedDate(this.dateTimeProvider.now()
      .format('YYYY-MM-DD')));
    this.todaysDate = this.dateTimeProvider.now();
  }

  async ngOnInit(): Promise<void> {
    this.pageState = {
      testModel$: this.store$.pipe(
        select(getTests),
      ),
      selectedDate$: this.store$.pipe(
        select(getJournalState),
        map(getSelectedDate),
      ),
      slotsOnSelectedDate$: this.store$.pipe(
        select(getJournalState),
        map(getSlotsOnSelectedDate),
      ),
      allSlots$: this.store$.pipe(
        select(getJournalState),
        map(getAllSlots),
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
    };

    const {
      error$,
      isLoading$,
    } = this.pageState;

    this.merged$ = merge(
      error$.pipe(switchMap(this.showError)),
      isLoading$.pipe(map(this.handleLoadingUI)),
    );

    //Subscribe to the test model and slots to rehydrate tests
    this.rehydrationSubscription = combineLatest({
      test$: this.pageState.testModel$,
      slot$: this.pageState.allSlots$,
    }).subscribe(({ test$, slot$ }) => {
      if (!!test$ && slot$.length > 0 && !this.isRehydrated) {
        this.isRehydrated = true
        this.journalRehydrationService.rehydrateTests(test$, slot$, this.authenticationProvider.getEmployeeId());
      }
    });
  }

  ionViewDidLeave(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.rehydrationSubscription) {
      this.rehydrationSubscription.unsubscribe();
    }
  }

  async ionViewWillEnter(): Promise<boolean> {
    super.ionViewWillEnter();
    await this.orientationMonitorProvider.monitorOrientation();
    await this.loadJournalManually();
    this.setupPolling();
    this.configurePlatformSubscriptions();

    await this.completedTestPersistenceProvider.loadCompletedPersistedTests();
    this.store$.dispatch(journalActions.LoadCompletedTests(true));

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
    await super.unlockDevice();
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
      this.pageRefresher.detail.complete();
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

  public pullRefreshJournal = async (refresher: IonRefresherCustomEvent<RefresherEventDetail>) => {
    await this.refreshJournal();
    this.pageRefresher = refresher;
  };

  public refreshJournal = async () => {
    combineLatest({
      test$: this.pageState.testModel$,
      slot$: this.pageState.allSlots$,
    }).subscribe(({ test$, slot$ }) => {
      this.journalRehydrationService.rehydrateTests(test$, slot$, this.authenticationProvider.getEmployeeId());
    }).unsubscribe();
    await this.loadJournalManually();
    this.loadCompletedTestsWithCallThrough();
  };

  onPreviousDayClick(): void {
    this.store$.dispatch(journalActions.SelectPreviousDay());
  }

  onNextDayClick(): void {
    this.store$.dispatch(journalActions.SelectNextDay());
  }

  /**
   * Load the completed tests with the callThrough property set to true (default false)
   * This will make the request to the backend to check if any of the tests have already been submitted
   * by another device
   * *
   */
  loadCompletedTestsWithCallThrough = (): void => {
    this.store$.dispatch(journalActions.LoadCompletedTests(true));
  };
}
