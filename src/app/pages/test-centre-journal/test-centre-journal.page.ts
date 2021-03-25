import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import {
  merge,
  Observable,
  of,
  Subject,
  Subscription,
} from 'rxjs';
import { select, Store } from '@ngrx/store';
import {
  catchError, finalize,
  map,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { BasePageComponent } from '../../shared/classes/base-page';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { NetworkStateProvider } from '../../providers/network-state/network-state';
import { TestCentreJournalProvider } from '../../providers/test-centre-journal/test-centre-journal';
import { TestCentreDetailResponse, Examiner } from '../../shared/models/test-centre-journal.model';
import { StoreModel } from '../../shared/models/store.model';
import { TestCentreJournalGetData, TestCentreJournalViewDidEnter } from './test-centre-journal.actions';
import { Log, LogType } from '../../shared/models/log.model';
import { LogHelper } from '../../providers/logs/logs-helper';
import { SaveLog } from '../../../store/logs/logs.actions';
import {
  getLastRefreshed,
  getLastRefreshedTime,
} from '../../../store/test-centre-journal/test-centre-journal.selector';
import { getTestCentreJournalState } from '../../../store/test-centre-journal/test-centre-journal.reducer';
import { SetLastRefreshed } from '../../../store/test-centre-journal/test-centre-journal.actions';
import { ErrorTypes } from '../../shared/models/error-message';
// import { SlotItem } from '../../providers/slot-selector/slot-item';
// import { SlotComponent } from '../../../components/test-slot/slot/slot';
// import { PersonalCommitmentSlotComponent } from '../journal/components/personal-commitment/personal-commitment';
import { SlotSelectorProvider } from '../../providers/slot-selector/slot-selector';
import { CandidateTestSlot } from './models/candidate-test-slot';

interface TestCentreJournalPageState {
  isOffline$: Observable<boolean>;
  lastRefreshedTime$: Observable<string>;
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
  isOffline: boolean;
  hasSearched: boolean = false;
  showSearchSpinner: boolean = false;
  subscription: Subscription = Subscription.EMPTY;
  didError: boolean = false;
  errorMessage: string = null;
  private destroy$ = new Subject<{}>();
  candidateTestSlots: CandidateTestSlot[] = [];

  constructor(
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    public router: Router,
    private networkStateProvider: NetworkStateProvider,
    private store$: Store<StoreModel>,
    private logHelper: LogHelper,
    private testCentreJournalProvider: TestCentreJournalProvider,
    private loadingCtrl: LoadingController,
  ) {
    super(platform, authenticationProvider, router);
  }

  ngOnInit(): void {
    this.pageState = {
      isOffline$: this.networkStateProvider.isOffline$,
      lastRefreshedTime$: this.store$.pipe(
        select(getTestCentreJournalState),
        map(getLastRefreshed),
        map(getLastRefreshedTime),
      ),
    };

    const {
      isOffline$,
    } = this.pageState;

    this.merged$ = merge(
      isOffline$.pipe(map((isOffline) => this.isOffline = isOffline)),
    );
    this.merged$.pipe(takeUntil(this.destroy$)).subscribe();
  }

  ionViewWillEnter(): void {
    super.ionViewWillEnter();
    this.getTestCentreData();
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(TestCentreJournalViewDidEnter());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTestCentreData = async (): Promise<void> => {
    this.subscription.unsubscribe();
    this.store$.dispatch(TestCentreJournalGetData());
    if (this.isOffline) {
      this.setOfflineError();
      return;
    }
    const loading: HTMLIonLoadingElement = await this.loadingCtrl.create({ spinner: 'circles' });
    await loading.present();
    this.store$.dispatch(SetLastRefreshed({ lastRefreshed: new Date() }));
    this.showSearchSpinner = true;
    this.subscription = this.testCentreJournalProvider.getTestCentreJournal()
      .pipe(
        takeUntil(this.destroy$),
        tap(() => { this.hasSearched = true; }),
        map((results: TestCentreDetailResponse) => {
          this.testCentreResults = results;
          if (results && results.examiners) {
            this.getCandidateSLotsArray(results.examiners);
          }
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
      ).subscribe();
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

  private getCandidateSLotsArray(examinersData: Examiner[]): void {
    examinersData.forEach((examiner) => {
      if (examiner.journal && examiner.journal.testSlots && examiner.journal.testSlots.length > 0) {
        examiner.journal.testSlots.forEach((testSlot) => {
          this.candidateTestSlots.push({
            slot: testSlot,
            examinerName: examiner.name,
          });
        });
      }
    });
  }
}
