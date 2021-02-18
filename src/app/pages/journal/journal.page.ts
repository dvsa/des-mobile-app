/* eslint-disable no-restricted-syntax */
import {
  Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef,
} from '@angular/core';
import {
  LoadingController, IonRefresher,
  NavParams, Platform, ModalController,
} from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import {
  Observable, Subscription, merge, from,
} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

// import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Router } from '@angular/router';
import {
  ActivityCode,
  SearchResultTestSchema,
} from '@dvsa/mes-search-schema';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { ApplicationReference } from '@dvsa/mes-test-schema/categories/common';
import { isEmpty } from 'lodash';
import { BasePageComponent } from '../../shared/classes/base-page';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import * as journalActions from '../../../store/journal/journal.actions';
import { StoreModel } from '../../shared/models/store.model';
import {
  getError, getIsLoading, getSelectedDate, getLastRefreshed,
  getLastRefreshedTime, getSlotsOnSelectedDate, // getCompletedTests,
} from '../../../store/journal/journal.selector';
import { getJournalState } from '../../../store/journal/journal.reducer';
import { SlotSelectorProvider } from '../../providers/slot-selector/slot-selector';
import { SlotComponent } from '../../../components/test-slot/slot/slot';
import { SlotItem } from '../../providers/slot-selector/slot-item';
import { selectVersionNumber } from '../../../store/app-info/app-info.selectors';
import { DateTimeProvider } from '../../providers/date-time/date-time';
import { AppConfigProvider } from '../../providers/app-config/app-config';
import { ErrorTypes } from '../../shared/models/error-message';
// import { DeviceProvider } from '../../providers/device/device';
// import { Insomnia } from '@ionic-native/insomnia';
// import { PersonalCommitmentSlotComponent } from './personal-commitment/personal-commitment';
import { TestSlotComponent } from '../../../components/test-slot/test-slot/test-slot';
// import { IncompleteTestsBanner } from '../../components/common/incomplete-tests-banner/incomplete-tests-banner';
import { DateTime } from '../../shared/helpers/date-time';
import { MesError } from '../../shared/models/mes-error.model';
import { formatApplicationReference } from '../../shared/helpers/formatters';
import { AppComponent } from '../../app.component';
import { TestStatus } from '../../../store/tests/test-status/test-status.model';
import { ErrorPage } from '../error-page/error';
import { PersonalCommitmentSlotComponent } from './components/personal-commitment/personal-commitment';

interface JournalPageState {
  selectedDate$: Observable<string>;
  slots$: Observable<SlotItem[]>;
  error$: Observable<MesError>;
  isLoading$: Observable<boolean>;
  lastRefreshedTime$: Observable<string>;
  appVersion$: Observable<string>;
  loadingSpinner$: Observable<HTMLIonLoadingElement>;
  // completedTests$: Observable<SearchResultTestSchema[]>;
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

  constructor(
    public modalController: ModalController,
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    public navParams: NavParams,
    public loadingController: LoadingController,
    public router: Router,
    private store$: Store<StoreModel>,
    private slotSelector: SlotSelectorProvider,
    private resolver: ComponentFactoryResolver,
    public dateTimeProvider: DateTimeProvider,
    public appConfigProvider: AppConfigProvider,
    private app: AppComponent,
    // private deviceProvider: DeviceProvider,
    // public screenOrientation: ScreenOrientation,
    // public insomnia: Insomnia,
  ) {
    super(platform, authenticationProvider, router);
    this.employeeId = this.authenticationProvider.getEmployeeId();
    this.isUnauthenticated = this.authenticationProvider.isInUnAuthenticatedMode();
    this.store$.dispatch(journalActions.SetSelectedDate({ payload: this.dateTimeProvider.now().format('YYYY-MM-DD') }));
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
      // completedTests$: this.store$.pipe(
      //   select(getJournalState),
      //   select(getCompletedTests),
      // ),
    };

    const {
      selectedDate$,
      slots$,
      error$,
      isLoading$,
      loadingSpinner$,
      // completedTests$,
    } = this.pageState;

    this.merged$ = merge(
      selectedDate$.pipe(map(this.setSelectedDate)),
      // completedTests$.pipe(map(this.setCompletedTests)),
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
    this.loadJournalManually();
    this.setupPolling();

    // this.store$.dispatch(new journalActions.LoadCompletedTests());
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
      // this.screenOrientation.unlock();
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
      await this.pageRefresher.complete();
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

  /**
   * Returns the activity code if the test has been completed already
   * Returns null if test hasn't been completed yet
   */
  hasSlotBeenTested(slotData: TestSlot): ActivityCode | null {
    if (isEmpty(this.completedTests)) {
      return null;
    }

    const applicationReference: ApplicationReference = {
      applicationId: slotData.booking.application.applicationId,
      bookingSequence: slotData.booking.application.bookingSequence,
      checkDigit: slotData.booking.application.checkDigit,
    };

    const completedTest = this.completedTests.find((compTest) => {
      return compTest.applicationReference === parseInt(formatApplicationReference(applicationReference), 10);
    });

    return completedTest ? completedTest.activityCode : null;
  }

  private createSlots = (emission: SlotItem[]) => {
    // Clear any dynamically created slots before adding the latest
    this.slotContainer.clear();

    if (!Array.isArray(emission)) return;

    if (emission.length === 0) return;

    const slots = this.slotSelector.getSlotTypes(emission);

    let lastLocation;
    for (const slot of slots) {
      const factory = this.resolver.resolveComponentFactory(slot.component);
      const componentRef = this.slotContainer.createComponent(factory);

      (<SlotComponent>componentRef.instance).slot = slot.slotData;
      (<SlotComponent>componentRef.instance).hasSlotChanged = slot.hasSlotChanged;
      (<SlotComponent>componentRef.instance).showLocation = (slot.slotData.testCentre.centreName !== lastLocation);
      lastLocation = slot.slotData.testCentre.centreName;

      if (componentRef.instance instanceof PersonalCommitmentSlotComponent) {
        // if this is a personal commitment assign it to the component
        (<PersonalCommitmentSlotComponent>componentRef.instance).personalCommitments = slot.personalCommitment;
      }

      if (componentRef.instance instanceof TestSlotComponent) {
        const activityCode = this.hasSlotBeenTested(slot.slotData as TestSlot);

        if (activityCode) {
          (<TestSlotComponent>componentRef.instance).derivedActivityCode = activityCode;
          (<TestSlotComponent>componentRef.instance).derivedTestStatus = TestStatus.Submitted;
        }

        // if this is a test slot assign hasSeenCandidateDetails separately
        (<TestSlotComponent>componentRef.instance).hasSeenCandidateDetails = slot.hasSeenCandidateDetails;
      }
    }
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
}
