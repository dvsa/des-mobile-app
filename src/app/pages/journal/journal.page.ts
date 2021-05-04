/* eslint-disable no-restricted-syntax */
import {
  Component, OnInit, ViewChild, ViewContainerRef,
} from '@angular/core';
import {
  LoadingController,
  NavParams, Platform, ModalController, IonRefresher,
} from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import {
  Observable, Subscription, merge, from,
} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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
  getLastRefreshedTime, getSlotsOnSelectedDate, canNavigateToPreviousDay, canNavigateToNextDay, getCompletedTests, // getCompletedTests,
} from '@store/journal/journal.selector';
import { getJournalState } from '@store/journal/journal.reducer';
import { selectVersionNumber } from '@store/app-info/app-info.selectors';
// import { DeviceProvider } from '@providers/device/device';
// import { Insomnia } from '@ionic-native/insomnia';
// import { IncompleteTestsBanner } from '@components/common/incomplete-tests-banner/incomplete-tests-banner';
import { AppComponent } from '../../app.component';
import { ErrorPage } from '../error-page/error';
import { LoadCompletedTests } from '@store/journal/journal.actions';

interface JournalPageState {
  selectedDate$: Observable<string>;
  slots$: Observable<SlotItem[]>;
  error$: Observable<MesError>;
  isLoading$: Observable<boolean>;
  lastRefreshedTime$: Observable<string>;
  appVersion$: Observable<string>;
  loadingSpinner$: Observable<HTMLIonLoadingElement>;
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

  // @ViewChild(IncompleteTestsBanner)
  // incompleteTestsBanner: IncompleteTestsBanner;

  pageState: JournalPageState;
  selectedDate: string;
  loadingSpinner$: Observable<HTMLIonLoadingElement>;
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
    // private deviceProvider: DeviceProvider,
    public screenOrientation: ScreenOrientation,
    // public insomnia: Insomnia,
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
      loadingSpinner$: from(this.loadingController.create({ spinner: 'circles' })),
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
      loadingSpinner$,
      completedTests$,
    } = this.pageState;

    this.merged$ = merge(
      selectedDate$.pipe(map(this.setSelectedDate)),
      completedTests$.pipe(map(this.setCompletedTests)),
      slots$.pipe(map(this.createSlots)),
      error$.pipe(map(this.showError)),
      isLoading$.pipe(switchMap((res) => {
        return this.handleLoadingUI(res, loadingSpinner$);
      })),
    );
  }

  ionViewDidLeave(): void {
    // Using .merge helps with unsubscribing
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
    super.ionViewWillEnter();
    this.loadJournalManually();
    this.setupPolling();

    this.store$.dispatch(LoadCompletedTests());
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
      // this.insomnia.allowSleepAgain();
      // this.deviceProvider.disableSingleAppMode();
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

  handleLoadingUI = async (isLoading: boolean, loadingSpinner$: Observable<HTMLIonLoadingElement>): Promise<void> => {
    const spinner = await loadingSpinner$.toPromise();
    if (isLoading) {
      await spinner.present();
      return;
    }
    if (this.pageRefresher) {
      await this.pageRefresher['detail'].complete();
    }
    if (spinner) {
      await spinner.dismiss();
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
    this.pageRefresher = refresher;
  };

  public refreshJournal = () => {
    this.loadJournalManually();
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
