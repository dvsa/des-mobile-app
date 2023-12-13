import { ModalController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { Component, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { merge, Observable, of, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { ErrorTypes } from '@shared/models/error-message';
import { BasePageComponent } from '@shared/classes/base-page';
import { StoreModel } from '@shared/models/store.model';
import { LogType } from '@shared/models/log.model';
import { MesError } from '@shared/models/mes-error.model';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { SearchProvider } from '@providers/search/search';
import { AdvancedSearchParams } from '@providers/search/search.models';
import { LogHelper } from '@providers/logs/logs-helper';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import { SaveLog } from '@store/logs/logs.actions';
import { ErrorPage } from '@pages/error-page/error';
import { orderBy } from 'lodash';
import { getRefDataState } from '@store/reference-data/reference-data.reducer';
import { getActiveTestCentres, getTestCentres } from '@store/reference-data/reference-data.selector';
import { TestCentre as JournalTestCentre } from '@dvsa/mes-journal-schema';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import {
  PerformApplicationReferenceSearch,
  PerformDriverNumberSearch,
  PerformLDTMSearch,
  TestResultSearchViewDidEnter,
} from './test-results-search.actions';
import emojiRegex from 'emoji-regex';

enum SearchBy {
  DriverNumber = 'driverNumber',
  ApplicationReference = 'appReference',
}

interface TestResultPageState {
  activeTestCentres$: Observable<JournalTestCentre[]>;
}

@Component({
  selector: 'app-test-results-search',
  templateUrl: 'test-results-search.html',
  styleUrls: ['test-results-search.scss'],
})
export class TestResultsSearchPage extends BasePageComponent {

  emojiPattern = emojiRegex();
  searchBy: SearchBy = SearchBy.ApplicationReference;
  candidateInfoDriverNumber: string = '';
  candidateInfoAppReference: string = '';
  focusedElement: string = null;
  searchResults: SearchResultTestSchema[] = [];
  hasSearched: boolean = false;
  showSearchSpinner: boolean = false;
  showAdvancedSearchSpinner: boolean = false;
  subscription: Subscription = Subscription.EMPTY;
  rekeySearch: boolean = false;
  pageState: TestResultPageState;
  merged$: Observable<JournalTestCentre[]>;

  constructor(
    public modalController: ModalController,
    public searchProvider: SearchProvider,
    private appConfig: AppConfigProvider,
    private store$: Store<StoreModel>,
    private logHelper: LogHelper,
    private accessibilityService: AccessibilityService,
    injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.pageState = {
      activeTestCentres$: this.store$.pipe(
        select(getRefDataState),
        map(getTestCentres),
        map(getActiveTestCentres),
      ),
    };
    this.merged$ = merge(
      this.pageState.activeTestCentres$,
    );
  }

  ionViewWillEnter(): boolean {
    if (this.merged$) {
      this.subscription = this.merged$.subscribe();
    }
    return true;
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(TestResultSearchViewDidEnter());
  }

  ionViewDidLeave(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  searchByChanged(val: string): void {
    this.searchBy = val as SearchBy;
  }

  verifyAdvancedSearch(): string {
    const role: ExaminerRole = this.appConfig.getAppConfig()?.role as ExaminerRole;
    if ([ExaminerRole.DLG, ExaminerRole.LDTM].includes(role)) {
      return null;
    }
    return this.authenticationProvider.getEmployeeId();
  }

  driverNumberChanged(val: string): void {
    this.candidateInfoDriverNumber = val.replace(this.emojiPattern, '');
  }

  appRefChanged(val: string): void {
    this.candidateInfoAppReference = val.replace(this.emojiPattern, '');
  }

  searchTests(): void {
    if (this.searchBy === SearchBy.DriverNumber) {
      this.subscription.unsubscribe();
      this.store$.dispatch(PerformDriverNumberSearch());
      this.showSearchSpinner = true;
      this.subscription = this.searchProvider.driverNumberSearch(this.candidateInfoDriverNumber)
        .pipe(
          tap(() => this.hasSearched = true),
          map((results) => {
            this.searchResults = results;
            this.showSearchSpinner = false;
          }),
          catchError(async (err: HttpErrorResponse) => {
            this.store$.dispatch(SaveLog({
              payload: this.logHelper.createLog(
                LogType.ERROR, 'Searching tests by driver number', err.message,
              ),
            }));
            this.searchResults = [];
            this.showSearchSpinner = false;

            if (err) {
              await this.showError(err);
              this.hasSearched = false;
              return of();
            }

            return of(this.hasSearched = true);
          }),
        )
        .subscribe();
    }

    if (this.searchBy === SearchBy.ApplicationReference) {
      this.subscription.unsubscribe();
      this.store$.dispatch(PerformApplicationReferenceSearch());
      this.showSearchSpinner = true;
      this.subscription = this.searchProvider.applicationReferenceSearch(this.candidateInfoAppReference)
        .pipe(
          tap(() => this.hasSearched = true),
          map((results) => {
            this.searchResults = results;
            this.showSearchSpinner = false;
          }),
          catchError(async (err: HttpErrorResponse) => {
            this.store$.dispatch(SaveLog({
              payload: this.logHelper.createLog(
                LogType.ERROR, `Searching tests by app ref (${this.candidateInfoAppReference})`, err.message,
              ),
            }));
            this.searchResults = [];
            this.showSearchSpinner = false;

            if (err) {
              await this.showError(err);
              this.hasSearched = false;
              return of();
            }

            return of(this.hasSearched = true);
          }),
        )
        .subscribe();
    }
  }

  advancedSearch(advancedSearchParams: AdvancedSearchParams): void {
    this.subscription.unsubscribe();
    this.store$.dispatch(PerformLDTMSearch(advancedSearchParams));
    this.showAdvancedSearchSpinner = true;
    this.subscription = this.searchProvider.advancedSearch(advancedSearchParams)
      .pipe(
        tap(() => this.hasSearched = true),
        map((results) => {
          this.searchResults = orderBy(results, ['testDate', 'category'], ['desc', 'asc']);
          this.showAdvancedSearchSpinner = false;
        }),
        catchError(async (err: HttpErrorResponse) => {
          this.store$.dispatch(SaveLog({
            payload: this.logHelper.createLog(
              LogType.ERROR, `Advanced search with params (${advancedSearchParams})`, err.message,
            ),
          }));
          this.searchResults = [];
          this.showAdvancedSearchSpinner = false;
          if (err) {
            await this.showError(err);
            this.hasSearched = false;
          }
          console.log('ERROR', JSON.stringify(err));
          return of();
        }),
      )
      .subscribe();
  }

  showError = async (error: MesError): Promise<void> => {
    if (error === undefined || error.message === '') return;

    const modal = await this.modalController.create({
      component: ErrorPage,
      componentProps: {
        errorType: ErrorTypes.SEARCH,
        displayAsModal: true,
      },
      cssClass: `modal-fullscreen ${this.accessibilityService.getTextZoomClass()}`,
    });
    await modal.present();
  };

  setFocus(focus: string): void {
    this.focusedElement = focus;
  }

  isEmpty(input: string) {
    return input === null || input.match(/^ *$/) !== null || input.trim() === '';
  }
}
