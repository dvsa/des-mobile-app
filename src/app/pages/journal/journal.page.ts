import {
  Component, OnInit, ViewChild, ViewContainerRef,
} from '@angular/core';
import {
  LoadingController,
  NavParams, Platform, ModalController, IonRefresher,
} from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import {
  Observable, Subscription, merge,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import {
  SearchResultTestSchema,
} from '@dvsa/mes-search-schema';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { SlotSelectorProvider } from '@providers/slot-selector/slot-selector';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { BasePageComponent } from '@shared/classes/base-page';
import { StoreModel } from '@shared/models/store.model';
import { ErrorTypes } from '@shared/models/error-message';
import { DateTime } from '@shared/helpers/date-time';
import { MesError } from '@shared/models/mes-error.model';
import * as journalActions from '@store/journal/journal.actions';
import {
  getError, getIsLoading, getSelectedDate, getLastRefreshed,
  getLastRefreshedTime, getSlotsOnSelectedDate, canNavigateToPreviousDay, canNavigateToNextDay, getCompletedTests,
} from '@store/journal/journal.selector';
import { getJournalState } from '@store/journal/journal.reducer';
import { selectVersionNumber } from '@store/app-info/app-info.selectors';
import { DeviceProvider } from '@providers/device/device';
import { Insomnia } from '@ionic-native/insomnia/ngx';
// @TODO - Reintroduce with MES-6271
// import { IncompleteTestsBanner } from '@components/common/incomplete-tests-banner/incomplete-tests-banner';
import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import { AppComponent } from '@app/app.component';
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

  @ViewChild('slotContainer', { read: ViewContainerRef }) slotContainer;

  // @TODO - Reintroduce with MES-6271
  // @ViewChild(IncompleteTestsBanner)
  // incompleteTestsBanner: IncompleteTestsBanner;

  pageState: JournalPageState;
  selectedDate: string;
  loadingSpinner: HTMLIonLoadingElement;
  pageRefresher: IonRefresher;
  isUnauthenticated: boolean;
  subscription: Subscription;
  employeeId: string;
  start = '2018-12-10T08:10:00+00:00';
  merged$: Observable<void | number>;
  todaysDate: DateTime;
  completedTests: SearchResultTestSchema[];
  displayNoDataMessage: boolean = false;

  constructor(
    public modalController: ModalController,
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    public navParams: NavParams,
    public loadingController: LoadingController,
    public router: Router,
    private store$: Store<StoreModel>,
    private slotSelector: SlotSelectorProvider,
    public dateTimeProvider: DateTimeProvider,
    public appConfigProvider: AppConfigProvider,
    private app: AppComponent,
    private networkStateProvider: NetworkStateProvider,
    private completedTestPersistenceProvider: CompletedTestPersistenceProvider,
    private deviceProvider: DeviceProvider,
    public screenOrientation: ScreenOrientation,
    public insomnia: Insomnia,
  ) {
    super(platform, authenticationProvider, router);
    this.employeeId = this.authenticationProvider.getEmployeeId();
    this.isUnauthenticated = this.authenticationProvider.isInUnAuthenticatedMode();
    this.store$.dispatch(journalActions.SetSelectedDate(this.dateTimeProvider.now().format('YYYY-MM-DD')));
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
        map((selectedDate) => selectedDate === this.dateTimeProvider.now().format('YYYY-MM-DD')),
      ),
      completedTests$: this.store$.pipe(
        select(getJournalState),
        select(getCompletedTests),
      ),
    };

    const {
      selectedDate$,
      slots$,
      error$,
      isLoading$,
      completedTests$,
    } = this.pageState;

    this.merged$ = merge(
      selectedDate$.pipe(map(this.setSelectedDate)),
      completedTests$.pipe(map(this.setCompletedTests)),
      slots$.pipe(map(this.createSlots)),
      error$.pipe(map(this.showError)),
      isLoading$.pipe(map(this.handleLoadingUI)),
    );
  }

  ionViewDidLeave(): void {
    // Using .merge helps with unsubscribing
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async ionViewWillEnter(): Promise<boolean> {
    super.ionViewWillEnter();
    this.loadJournalManually();
    this.setupPolling();
    await this.completedTestPersistenceProvider.loadCompletedPersistedTests();
    // encapsulated in setTimeout to defer call due to race condition with LoadJournalSuccess
    setTimeout(() => this.store$.dispatch(journalActions.LoadCompletedTests()), 0);
    if (this.merged$) {
      this.subscription = this.merged$.subscribe();
    }
    this.todaysDate = this.dateTimeProvider.now();

    return true;
  }

  ionViewWillLeave() {
    this.store$.dispatch(journalActions.StopPolling());
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(journalActions.JournalViewDidEnter());

    if (super.isIos()) {
      this.screenOrientation.unlock();
      this.insomnia.allowSleepAgain();
      this.deviceProvider.disableSingleAppMode();
    }
  }

  loadJournalManually() {
    this.store$.dispatch(journalActions.LoadJournal());
  }

  setupPolling() {
    this.store$.dispatch(journalActions.SetupPolling());
  }

  setSelectedDate = (selectedDate: string): void => {
    this.selectedDate = selectedDate;
  };

  setCompletedTests = (completedTests: SearchResultTestSchema[]): void => {
    this.completedTests = completedTests;
  };

  handleLoadingUI = (isLoading: boolean): void => {
    if (isLoading) {
      this.loadingController.create({ spinner: 'circles' }).then(async (spinner) => {
        this.loadingSpinner = spinner;
        await this.loadingSpinner.present();
      });
      return;
    }
    if (this.pageRefresher) {
      this.pageRefresher['detail'].complete();
    }
    if (this.loadingSpinner) {
      this.loadingSpinner.dismiss();
      this.loadingSpinner = null;
    }
  };

  showError = (error: MesError): void => {
    if (error === undefined || error.message === '') return;
    // Modals are at the same level as the ion-nav so are not getting the zoom level class,
    // this needs to be passed in the create options.

    const zoomClass = `modal-fullscreen ${this.app.getTextZoomClass()}`;

    this.modalController.create({
      component: ErrorPage,
      componentProps: {
        errorType: ErrorTypes.JOURNAL_REFRESH,
      },
      cssClass: zoomClass,
    }).then((modal) => {
      modal.present();
    });
  };

  private createSlots = (emission: SlotItem[]) => {
    this.displayNoDataMessage = (!emission || (emission && emission.length === 0));
    this.slotSelector.createSlots(this.slotContainer, emission, this.completedTests);
  };

  public pullRefreshJournal = (refresher: IonRefresher) => {
    this.loadJournalManually();
    this.loadCompletedTestsWithCallThrough();
    this.pageRefresher = refresher;
  };

  public refreshJournal = () => {
    this.loadJournalManually();
    this.loadCompletedTestsWithCallThrough();
  };

  private loadCompletedTestsWithCallThrough = () => {
    // When manually refreshing the journal we want to check
    // if any of the tests have already been submitted by another device
    // So we must make the Load Completed Tests request
    // And that's why we set the callThrough property to true
    const callThrough = true;
    this.store$.dispatch(journalActions.LoadCompletedTests(callThrough));
  };

  async logout() {
    this.store$.dispatch(journalActions.UnloadJournal());
    await super.logout();
  }

  onPreviousDayClick(): void {
    this.store$.dispatch(journalActions.SelectPreviousDay());
  }

  onNextDayClick(): void {
    this.store$.dispatch(journalActions.SelectNextDay());
  }
}
