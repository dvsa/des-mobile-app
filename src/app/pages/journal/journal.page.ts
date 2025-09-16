import { Component, Injector, OnInit } from '@angular/core';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { ActivityCode, SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { ModalController, RefresherEventDetail } from '@ionic/angular';
import { IonRefresherCustomEvent, LoadingOptions } from '@ionic/core';
import { select } from '@ngrx/store';
import { Observable, Subscription, merge, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { environment } from '@environments/environment';
import { TestersEnvironmentFile } from '@environments/models/environment.model';
import { LearnMoreModal } from '@pages/journal/components/learn-more-modal/learn-more-modal';
import { LEARN_MORE_MODAL } from '@pages/page-names.constants';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { LoadingProvider } from '@providers/loader/loader';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { BasePageComponent } from '@shared/classes/base-page';
import { DateTime } from '@shared/helpers/date-time';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { ErrorTypes } from '@shared/models/error-message';
import { MesError } from '@shared/models/mes-error.model';
import { selectVersionNumber } from '@store/app-info/app-info.selectors';
import { RecallLearnMoreModalOpened } from '@store/general/safety-recall/safety-recall.actions';
import * as journalActions from '@store/journal/journal.actions';
import { JournalRehydrationPage, JournalRehydrationType } from '@store/journal/journal.effects';
import { getJournalState } from '@store/journal/journal.reducer';
import {
  canNavigateToNextDay,
  canNavigateToPreviousDay,
  getError,
  getIsLoading,
  getLastRefreshed,
  getLastRefreshedTime,
  getRecallAutoPopupLastDisplayedTime,
  getSelectedDate,
  getSlotsOnSelectedDate,
} from '@store/journal/journal.selector';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { getTests } from '@store/tests/tests.reducer';
import { isEndToEndPracticeTest } from '@store/tests/tests.selector';
import { ErrorPage } from '../error-page/error';

interface JournalPageState {
  selectedDate$: Observable<string>;
  slots$: Observable<SlotItem[]>;
  error$: Observable<MesError>;
  isLoading$: Observable<boolean>;
  lastRefreshedTime$: Observable<string>;
  recallAutoPopupLastDisplayedTime$: Observable<string>;
  appVersion$: Observable<string>;
  completedTests$: Observable<SearchResultTestSchema[]>;
  isOffline$: Observable<boolean>;
  canNavigateToPreviousDay$: Observable<boolean>;
  canNavigateToNextDay$: Observable<boolean>;
  isSelectedDateToday$: Observable<boolean>;
}

export interface CompletedJournalSlot {
  applicationReference: number;
  activityCode: ActivityCode;
  autosave: boolean;
  passCertificateNumber: string;
}

@Component({
  selector: 'app-journal',
  templateUrl: './journal.page.html',
  styleUrls: ['./journal.page.scss'],
  standalone: false,
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
  merged$: Observable<void | Promise<unknown>>;
  todaysDate: DateTime;
  platformSubscription: Subscription;
  isDisplayingLearnMoreModal = false;

  constructor(
    public modalController: ModalController,
    public orientationMonitorProvider: OrientationMonitorProvider,
    public dateTimeProvider: DateTimeProvider,
    public accessibilityService: AccessibilityService,
    private networkStateProvider: NetworkStateProvider,
    public loadingProvider: LoadingProvider,
    injector: Injector
  ) {
    super(injector);

    this.store$.dispatch(journalActions.SetSelectedDate(this.dateTimeProvider.now().format('YYYY-MM-DD')));
    this.todaysDate = this.dateTimeProvider.now();
  }

  ngOnInit(): void {
    this.pageState = {
      selectedDate$: this.store$.pipe(select(getJournalState), map(getSelectedDate)),
      recallAutoPopupLastDisplayedTime$: this.store$.pipe(
        select(getJournalState),
        map(getRecallAutoPopupLastDisplayedTime)
      ),
      slots$: this.store$.pipe(
        select(getJournalState),
        map(getSlotsOnSelectedDate),
        tap((slots) => this.displayAutoRecallPopup(slots))
      ),
      error$: this.store$.pipe(select(getJournalState), map(getError), take(1)),
      isLoading$: this.store$.pipe(select(getJournalState), map(getIsLoading)),
      lastRefreshedTime$: this.store$.pipe(select(getJournalState), map(getLastRefreshed), map(getLastRefreshedTime)),
      appVersion$: this.store$.select(selectVersionNumber),
      isOffline$: this.networkStateProvider.isOffline$,
      canNavigateToPreviousDay$: this.store$.pipe(
        select(getJournalState),
        map((journal) => canNavigateToPreviousDay(journal, this.dateTimeProvider.now()))
      ),
      canNavigateToNextDay$: this.store$.pipe(select(getJournalState), map(canNavigateToNextDay)),
      isSelectedDateToday$: this.store$.pipe(
        select(getJournalState),
        map(getSelectedDate),
        map((selectedDate) => selectedDate === this.dateTimeProvider.now().format('YYYY-MM-DD'))
      ),
      completedTests$: of([]),
    };

    const { error$, isLoading$ } = this.pageState;

    this.merged$ = merge(error$.pipe(switchMap(this.showError)), isLoading$.pipe(map(this.handleLoadingUI)));
  }

  ionViewDidLeave(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async displayAutoRecallPopup(slots: SlotItem[]) {
    this.pageState.isSelectedDateToday$
      .subscribe(async (isToday) => {
        // If the selected date is not today or there are no slots, do not display the popup
        if (!isToday || slots.length === 0) return;

        // Check if the popup has already been displayed today
        const formattedTodayDate = this.todaysDate.format('DD/MM/YYYY');
        console.log(
          'today date',
          formattedTodayDate,
          'last displayed time',
          this.store$.selectSignal(getRecallAutoPopupLastDisplayedTime)()
        );
        if (this.store$.selectSignal(getRecallAutoPopupLastDisplayedTime)() === formattedTodayDate) return;

        // Check if there are any affected slots that are not autosaved, completed, or submitted
        const testStatus = this.store$.selectSignal(getTests)().testStatus;

        // Define the categories that are affected by the auto-recall popup
        const affectedCategories = [TestCategory.ADI2, TestCategory.ADI3, TestCategory.SC, TestCategory.B];

        // Check if there are any slots with bookings in the affected categories that are not completed, autosaved, or submitted
        const hasIncompleteAffectedSlot = slots.some(
          (slot) =>
            'booking' in slot.slotData &&
            affectedCategories.includes(slot.slotData?.booking?.application?.testCategory as TestCategory) &&
            !isAnyOf(testStatus[slot.slotData.slotDetail.slotId], [
              TestStatus.Autosaved,
              TestStatus.Completed,
              TestStatus.Submitted,
              TestStatus.WriteUp,
            ])
        );

        // If there are incomplete affected slots, dispatch the action to display the popup
        if (hasIncompleteAffectedSlot) {
          this.store$.dispatch(journalActions.RecallAutoPopupDisplayedTimeChanged(formattedTodayDate));
          await this.openLearnMoreModal();
        }
      })
      .unsubscribe();
  }

  async openLearnMoreModal() {
    // If the modal is already open, we don't need to open it again
    if (!this.isDisplayingLearnMoreModal) {
      this.isDisplayingLearnMoreModal = true;
      // Dispatch an action to indicate that the learn more modal has been opened
      this.store$.dispatch(RecallLearnMoreModalOpened());
      // Create and present the learn more modal
      const zoomClass = `mes-modal-alert ${this.accessibilityService.getTextZoomClass()}`;
      const learnMoreModal = await this.modalController.create({
        component: LearnMoreModal,
        id: LEARN_MORE_MODAL,
        cssClass: zoomClass,
      });
      // Present the modal
      await learnMoreModal.present();
      this.setUpLearnMoreModalDismissed(learnMoreModal);
    }
  }

  setUpLearnMoreModalDismissed(learnMoreModal: HTMLIonModalElement) {
    // Set up a listener to clean up the modal reference when it is dismissed
    learnMoreModal
      .onDidDismiss()
      .then(() => {
        this.isDisplayingLearnMoreModal = false;
      })
      .catch(() => {
        this.isDisplayingLearnMoreModal = false;
      });
  }

  async ionViewWillEnter(): Promise<boolean> {
    super.ionViewWillEnter();
    await this.orientationMonitorProvider.monitorOrientation();
    await this.requestJournal(JournalRehydrationType.AUTO);
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
    await super.unlockDevice();
  }

  /**
   * Trigger a request for journal data and acquire tests needing rehydration
   */
  async requestJournal(rehydrationType: JournalRehydrationType) {
    await this.loadingProvider.handleUILoading(true, JournalPage.loadingOpts);
    this.store$.dispatch(journalActions.LoadJournal());
    if (!(environment as unknown as TestersEnvironmentFile)?.isTest) {
      this.store$.dispatch(journalActions.JournalRehydration(rehydrationType, JournalRehydrationPage.JOURNAL));
    }
  }

  setupPolling() {
    this.store$.dispatch(journalActions.SetupPolling());
  }

  configurePlatformSubscriptions(): void {
    if (super.isIos()) {
      const merged$ = merge(
        this.platform.resume.pipe(switchMap(async () => this.refreshJournal(JournalRehydrationType.AUTO)))
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
    await this.refreshJournal(JournalRehydrationType.MANUAL);
    this.pageRefresher = refresher;
  };

  async clickRefreshJournal() {
    await this.refreshJournal(JournalRehydrationType.MANUAL);
  }

  public refreshJournal = async (rehydrationType: JournalRehydrationType) => {
    await this.requestJournal(rehydrationType);
  };

  onPreviousDayClick(): void {
    this.store$.dispatch(journalActions.SelectPreviousDay());
  }

  onNextDayClick(): void {
    this.store$.dispatch(journalActions.SelectNextDay());
  }

  protected readonly isEndToEndPracticeTest = isEndToEndPracticeTest;
}
