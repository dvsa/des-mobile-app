import { Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { merge, Observable, of, Subject, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { catchError, finalize, map, takeUntil, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { TestCentreJournalProvider } from '@providers/test-centre-journal/test-centre-journal';
import { LogHelper } from '@providers/logs/logs-helper';
import { BasePageComponent } from '@shared/classes/base-page';
import { TestCentre, TestCentreDetailResponse } from '@shared/models/test-centre-journal.model';
import { StoreModel } from '@shared/models/store.model';
import { Log, LogType } from '@shared/models/log.model';
import { ErrorTypes } from '@shared/models/error-message';
import { SaveLog } from '@store/logs/logs.actions';
import { getLastRefreshed, getLastRefreshedTime } from '@store/test-centre-journal/test-centre-journal.selector';
import { getTestCentreJournalState } from '@store/test-centre-journal/test-centre-journal.reducer';
import { SetLastRefreshed } from '@store/test-centre-journal/test-centre-journal.actions';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import { TestCentre as JournalTestCentre } from '@dvsa/mes-journal-schema';
import {
  CandidateSearchCardComponent,
} from '@pages/test-centre-journal/components/candidate-search-card/candidate-search-card';
import { ViewJournalsCardComponent } from '@pages/test-centre-journal/components/view-journals-card/view-journals-card';
import { getRefDataState } from '@store/reference-data/reference-data.reducer';
import { getActiveTestCentres, getTestCentres } from '@store/reference-data/reference-data.selector';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import {
  TestCentreJournalGetData,
  TestCentreJournalSelectTestCentre,
  TestCentreJournalTabChanged,
  TestCentreJournalViewDidEnter,
} from './test-centre-journal.actions';

interface TestCentreJournalPageState {
  isOffline$: Observable<boolean>;
  lastRefreshedTime$: Observable<string>;
  activeTestCentres$: Observable<JournalTestCentre[]>;
}

@Component({
  selector: 'app-test-centre-journal',
  templateUrl: 'test-centre-journal.page.html',
  styleUrls: ['test-centre-journal.page.scss'],
})
export class TestCentreJournalPage extends BasePageComponent implements OnDestroy, OnInit {

  pageState: TestCentreJournalPageState;
  testCentreResults: TestCentreDetailResponse = null;
  merged$: Observable<boolean>;
  manuallyRefreshed: boolean = false;
  isOffline: boolean;
  hasSearched: boolean = false;
  showSearchSpinner: boolean = false;
  subscription: Subscription = Subscription.EMPTY;
  didError: boolean = false;
  errorMessage: string = null;
  isLDTM: boolean = false;
  testCentreSelected: JournalTestCentre = null;

  @ViewChild('candidateSearchCard')
  candidateSearchCard: CandidateSearchCardComponent;

  @ViewChild('viewJournalsCard')
  viewJournalsCard: ViewJournalsCardComponent;

  private destroy$ = new Subject<{}>();

  constructor(
    public orientationMonitorProvider: OrientationMonitorProvider,
    private networkStateProvider: NetworkStateProvider,
    private store$: Store<StoreModel>,
    private logHelper: LogHelper,
    private testCentreJournalProvider: TestCentreJournalProvider,
    private loadingCtrl: LoadingController,
    private appConfig: AppConfigProvider,
    injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.pageState = {
      isOffline$: this.networkStateProvider.isOffline$,
      lastRefreshedTime$: this.store$.pipe(
        select(getTestCentreJournalState),
        map(getLastRefreshed),
        map(getLastRefreshedTime),
      ),
      activeTestCentres$: this.store$.pipe(
        select(getRefDataState),
        map(getTestCentres),
        map(getActiveTestCentres),
      ),
    };

    this.isLDTM = this.appConfig.getAppConfig()?.role === ExaminerRole.LDTM;

    const {
      isOffline$,
    } = this.pageState;

    this.merged$ = merge(
      isOffline$.pipe(map((isOffline) => this.isOffline = isOffline)),
    );
    this.merged$.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  async ionViewWillEnter(): Promise<void> {
    super.ionViewWillEnter();

    if (!this.isLDTM) {
      await this.getTestCentreData();
    }
    await this.orientationMonitorProvider.monitorOrientation();
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(TestCentreJournalViewDidEnter());
  }

  async ionViewWillLeave() {
    await this.orientationMonitorProvider.tearDownListener();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getTestCentreData = async (manualRefresh: boolean = false, tcID: number = null): Promise<void> => {
    this.subscription.unsubscribe();
    this.manuallyRefreshed = manualRefresh;
    this.store$.dispatch(TestCentreJournalGetData(manualRefresh));

    if (this.isOffline) {
      this.setOfflineError();
      return;
    }

    const loading: HTMLIonLoadingElement = await this.loadingCtrl.create({ spinner: 'circles' });
    await loading.present();

    // Clause acts as a page reset for LDTM's
    if (this.isLDTM && manualRefresh) {
      this.testCentreSelected = null;
      await loading.dismiss();
      return;
    }

    this.store$.dispatch(SetLastRefreshed({ lastRefreshed: new Date() }));
    this.showSearchSpinner = true;

    this.subscription = this.testCentreJournalProvider.getTestCentreJournal(tcID)
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          this.hasSearched = true;
        }),
        map((results: TestCentreDetailResponse) => {
          this.testCentreResults = results;
          this.showSearchSpinner = false;
          this.didError = false;
        }),
        catchError((err: HttpErrorResponse) => {
          const log: Log = this.logHelper.createLog(
            LogType.ERROR,
            'Getting test centre journal',
            err.message,
          );
          this.didError = true;
          this.store$.dispatch(SaveLog({ payload: log }));
          this.testCentreResults = null;
          this.showSearchSpinner = false;

          if (err && this.isRecognisedError(err.error)) {
            this.mapError(err.error);
            this.hasSearched = false;
            return of();
          }

          this.hasSearched = true;
          this.errorMessage = ErrorTypes.TEST_CENTRE_UNKNOWN_ERROR;
          return of(this.hasSearched);
        }),
        finalize(async () => loading.dismiss()),
      )
      .subscribe();
  };

  private isRecognisedError = (error: string) => {
    return error === ErrorTypes.TEST_CENTRE_OFFLINE
      || error === ErrorTypes.TEST_CENTRE_JOURNAL_NO_RESULT
      || error === ErrorTypes.TEST_CENTRE_JOURNAL_ERROR;
  };

  private mapError = (error: string): void => {
    if (error === undefined || error === '') return;
    this.errorMessage = error;
  };

  private setOfflineError = (): void => {
    this.didError = true;
    this.testCentreResults = null;
    this.showSearchSpinner = false;
    this.mapError(ErrorTypes.TEST_CENTRE_OFFLINE);
  };

  get testCentreNames(): string {
    return this.testCentreResults?.testCentres?.map((testCentre: TestCentre) => testCentre.name)
      .join(', ');
  }

  testCentreChange = async (testCentre: JournalTestCentre): Promise<void> => {
    this.testCentreSelected = testCentre;
    // mimic the same result as a refresh which clears down data inside component(s)
    this.candidateSearchCard.onManualRefresh();
    this.viewJournalsCard.onManualRefresh();

    if (this.isLDTM && testCentre) {
      this.store$.dispatch(TestCentreJournalSelectTestCentre());
      await this.getTestCentreData(false, testCentre.centreId);
    }
  };

  tabChanged = (tab: string): void => {
    this.store$.dispatch(TestCentreJournalTabChanged(tab));
  };

}
