import { Component, Injector, OnInit } from '@angular/core';
import { ModalController, RefresherEventDetail } from '@ionic/angular';
import { select } from '@ngrx/store';
import { IonRefresherCustomEvent, LoadingOptions } from '@ionic/core';
import { merge, Observable, Subscription } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { ActivityCode, SearchResultTestSchema } from '@dvsa/mes-search-schema';
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
  getCompletedTests,
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
import { TestSlot } from '@dvsa/mes-journal-schema';
import { formatApplicationReference } from '@shared/helpers/formatters';
import { ApplicationReference } from '@dvsa/mes-test-schema/categories/common';
import { get } from 'lodash-es';

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

export interface CompletedJournalSlot {
  applicationReference: number,
  activityCode: ActivityCode,
  autosave: boolean,
  passCertificateNumber: string
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
    injector: Injector,
  ) {
    super(injector);

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
      completedTests$: this.store$.pipe(
        select(getJournalState),
        select(getCompletedTests),
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
  }

  ionViewDidLeave(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async ionViewWillEnter(): Promise<boolean> {
    super.ionViewWillEnter();
    await this.orientationMonitorProvider.monitorOrientation();
    await this.requestJournal();
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
  async requestJournal() {
    await this.loadingProvider.handleUILoading(true, JournalPage.loadingOpts);
    this.store$.dispatch(journalActions.LoadJournal());
    this.store$.dispatch(journalActions.JournalRehydration());
  }

  setupPolling() {
    this.store$.dispatch(journalActions.SetupPolling());
  }

  configurePlatformSubscriptions(): void {
    if (super.isIos()) {
      const merged$ = merge(
        this.platform.resume.pipe(switchMap(async () =>
          this.refreshJournal(),
        )),
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
    await this.requestJournal();
  };

  onPreviousDayClick(): void {
    this.store$.dispatch(journalActions.SelectPreviousDay());
  }

  onNextDayClick(): void {
    this.store$.dispatch(journalActions.SelectNextDay());
  }

  /**
   * Limit payload to only the required fields for test that match current journal slots
   * @param completedTests
   * @param testSlots
   */
  formatCompleteTests(completedTests: SearchResultTestSchema[], testSlots: SlotItem[]): CompletedJournalSlot[] {
    let arrayOfTests: number[] = testSlots.map((slot: SlotItem) => {
      if (get(slot, 'slotData.booking')) {
        return parseInt(formatApplicationReference({
          applicationId: (slot.slotData as TestSlot).booking.application.applicationId,
          bookingSequence: (slot.slotData as TestSlot).booking.application.bookingSequence,
          checkDigit: (slot.slotData as TestSlot).booking.application.checkDigit,
        } as ApplicationReference), 10);
      }
    });

    let matchingTests: number[] = arrayOfTests
      .filter(element => completedTests
        .map(value => value.applicationReference)
        .includes(element));

    return completedTests
      .filter((value: SearchResultTestSchema) => matchingTests.includes(value.applicationReference))
      .map((value: SearchResultTestSchema): CompletedJournalSlot => {
        return {
          applicationReference: value.applicationReference,
          activityCode: value.activityCode,
          autosave: !!(value.autosave),
          passCertificateNumber: value.passCertificateNumber,
        };
      });
  }
}
