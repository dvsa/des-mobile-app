import { Component, Injector, OnInit } from '@angular/core';
import { ModalController, RefresherEventDetail } from '@ionic/angular';
import { select } from '@ngrx/store';
import { IonRefresherCustomEvent, LoadingOptions } from '@ionic/core';
import { forkJoin, merge, Observable, of, Subscription } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
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
import { LoadingProvider } from '@providers/loader/loader';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { ErrorPage } from '../error-page/error';
import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import { SlotDetail, TestSlot } from '@dvsa/mes-journal-schema';
import { formatApplicationReference } from '@shared/helpers/formatters';
import { get } from 'lodash-es';
import {
  getTests,
  TestResultSchemasUnionWithAutosaveAndSlotID,
} from '@store/tests/tests.reducer';
import { TestsModel } from '@store/tests/tests.model';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { HttpResponse } from '@angular/common/http';
import { SaveLog } from '@store/logs/logs.actions';
import { LogType } from '@shared/models/log.model';
import { SearchProvider } from '@providers/search/search';
import { CompressionProvider } from '@providers/compression/compression';
import { LoadRemoteTests } from '@store/tests/tests.actions';
import { isAnyOf } from '@shared/helpers/simplifiers';

interface JournalPageState {
  selectedDate$: Observable<string>;
  slots$: Observable<SlotItem[]>;
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

export interface CompletedJournalSlot {
  slotId: number,
  appRef: number,
  Status: TestStatus,
  slot: SlotDetail
  autosave: number
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
  merged$: Observable<any>;
  todaysDate: DateTime;
  platformSubscription: Subscription;

  constructor(
    public modalController: ModalController,
    public orientationMonitorProvider: OrientationMonitorProvider,
    public dateTimeProvider: DateTimeProvider,
    private accessibilityService: AccessibilityService,
    private networkStateProvider: NetworkStateProvider,
    public loadingProvider: LoadingProvider,
    private completedTestPersistenceProvider: CompletedTestPersistenceProvider,
    private searchProvider: SearchProvider,
    private compressionProvider: CompressionProvider,
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
    };

    const {
      error$,
      isLoading$,
    } = this.pageState;

    this.merged$ = merge(
      error$.pipe(switchMap(this.showError)),
      isLoading$.pipe(map(this.handleLoadingUI)),
    );

    forkJoin([
      this.pageState.testModel$.pipe(take(2)),
      this.pageState.slots$.pipe(take(2)),
    ]).subscribe(([tests, slots]) => {
      this.rehydrateTests(tests, slots);
    });
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

  hasRehydratableTestStatus(slotID: number, testsModel: TestsModel) {
    return !isAnyOf(testsModel.testStatus[slotID], [
      TestStatus.WriteUp,
      TestStatus.Autosaved,
      TestStatus.Completed,
      TestStatus.Submitted
    ])
  }

  isAutoSaved(slotID: number, testsModel: TestsModel) {
    return isAnyOf(testsModel.testStatus[slotID], [
      TestStatus.WriteUp,
      TestStatus.Autosaved,
    ])
  }

  /**
   * Limit payload to only the required fields for test that match current journal slots
   * @param testsModel
   * @param testSlots
   */
  async rehydrateTests(testsModel: TestsModel, testSlots: SlotItem[]) {

    //Get a list of every test slot that doesn't have a test status or has one that should be overwritten by rehydration
    let testsThatNeedRehydrated = (testSlots
      .filter(value => (get(value, 'slotData.booking'))
          && (!(testsModel.testStatus[value.slotData.slotDetail.slotId]) ||
            this.hasRehydratableTestStatus(value.slotData.slotDetail.slotId, testsModel)
          ))
      .map(value => {
        return({
          slotId: value.slotData.slotDetail.slotId,
          appRef: formatApplicationReference(
            {
              applicationId: (value.slotData as TestSlot).booking.application.applicationId,
              bookingSequence: (value.slotData as TestSlot).booking.application.bookingSequence,
              checkDigit: (value.slotData as TestSlot).booking.application.checkDigit
            }
          ),
        });
      })
    )
    //If testsThatNeedRehydrated has items in it, we need to get the test result from the backend
    if (testsThatNeedRehydrated.length > 0) {
      let completedTestsWithAutoSaveAndID: TestResultSchemasUnionWithAutosaveAndSlotID[] = [];
      //Get the app regs that need rehydrated from the backend
      this.searchProvider
        .getTestResults(testsThatNeedRehydrated.map(value =>
          value.appRef.toString()), this.authenticationProvider.getEmployeeId()
        )
        .pipe(
          map((response: HttpResponse<any>): string => response.body),
          //Decompress data
          map((data) => (this.compressionProvider.extract<any[]>(data))),
          map((tests: any[]) => {
            //Find which test this is referencing, so we can take its details
            tests.forEach((test) => {
              let currentTest = testsThatNeedRehydrated.find((value) => {
                return (value.appRef == formatApplicationReference(test.journalData.applicationReference));
              });
              //Push the test details to the array so it can be dispatched to the state
              completedTestsWithAutoSaveAndID.push({
                autosave: test.autosave,
                testData: test,
                slotId: currentTest.slotId.toString(),
              });
            });
            return of();
          }),
          catchError(async (err) => {
            //Error handling
            this.store$.dispatch(SaveLog({
              payload: this.logHelper.createLog(
                LogType.ERROR,
                `Getting test results (${testsThatNeedRehydrated.map(value => value.appRef.toString())})`,
                err,
              ),
            }));
            return of();
          }),
        ).subscribe(() => {
        //Dispatch tests so they can be loaded into the local storage
          this.store$.dispatch(LoadRemoteTests(completedTestsWithAutoSaveAndID));
        });
    }
  }
}
