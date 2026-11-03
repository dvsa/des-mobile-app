import { Component, Injector, signal } from '@angular/core';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonRow,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular';
import { select } from '@ngrx/store';
import { Observable, Subscription, merge, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AsyncPipe, NgClass } from '@angular/common';
import { OfflineBannerComponent } from '@components/common/offline-banner/offline-banner';
import { TabComponent } from '@components/common/tab/tab';
import { TabsComponent } from '@components/common/tabs/tabs';
import { InputRestrictionUppercaseAlphanumDirective } from '@directives/input-restriction-uppercasealphanum.directive';
import { TestCentre as JournalTestCentre } from '@dvsa/mes-journal-schema';
import { MaskitoDirective } from '@maskito/angular';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { ErrorPage } from '@pages/error-page/error';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { SearchProvider } from '@providers/search/search';
import { AdvancedSearchParams } from '@providers/search/search.models';
import { BasePageComponent } from '@shared/classes/base-page';
import { bookingReferenceMask, formatBookingReferenceForBackend, maskPredicate } from '@shared/helpers/formatters';
import { ErrorTypes } from '@shared/models/error-message';
import { LogType } from '@shared/models/log.model';
import { SaveLog } from '@store/logs/logs.actions';
import { getRefDataState } from '@store/reference-data/reference-data.reducer';
import { getActiveTestCentres, getTestCentres } from '@store/reference-data/reference-data.selector';
import { orderBy } from 'lodash-es';
import { AdvancedSearchComponent } from './components/advanced-search/advanced-search';
import { SearchResultComponent } from './components/search-result/search-result';
import {
  PerformApplicationReferenceSearch,
  PerformDriverNumberSearch,
  PerformLDTMSearch,
  TestResultSearchViewDidEnter,
} from './test-results-search.actions';

enum SearchBy {
  DriverNumber = 'driverNumber',
  ApplicationReference = 'appReference',
}

interface TestResultPageState {
  activeTestCentres$: Observable<JournalTestCentre[]>;
  isOffline$: Observable<boolean>;
}

@Component({
  selector: 'app-test-results-search',
  templateUrl: 'test-results-search.html',
  styleUrls: ['test-results-search.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    OfflineBannerComponent,
    TabsComponent,
    TabComponent,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    NgClass,
    MaskitoDirective,
    InputRestrictionUppercaseAlphanumDirective,
    IonText,
    IonButton,
    IonIcon,
    IonSpinner,
    AdvancedSearchComponent,
    SearchResultComponent,
    AsyncPipe,
  ],
})
export class TestResultsSearchPage extends BasePageComponent {
  searchBy: SearchBy = SearchBy.ApplicationReference;
  candidateInfo = '';
  focusedElement: string = null;
  readonly searchResults = signal<SearchResultTestSchema[]>([]);
  readonly hasSearched = signal(false);
  readonly showSearchSpinner = signal(false);
  readonly showAdvancedSearchSpinner = signal(false);
  subscription: Subscription = Subscription.EMPTY;
  rekeySearch = false;
  pageState: TestResultPageState;
  merged$: Observable<JournalTestCentre[]>;
  activeTab = 'Candidate details';

  isUserEnteringApplicationReference = false;

  constructor(
    public modalController: ModalController,
    public searchProvider: SearchProvider,
    private appConfig: AppConfigProvider,
    private accessibilityService: AccessibilityService,
    private networkStateProvider: NetworkStateProvider,
    injector: Injector
  ) {
    super(injector);
  }

  getBookingReferenceMask = (): MaskitoOptions => bookingReferenceMask;
  getMaskPredicate = (): MaskitoElementPredicate => maskPredicate;

  ngOnInit(): void {
    this.pageState = {
      activeTestCentres$: this.store$.pipe(select(getRefDataState), map(getTestCentres), map(getActiveTestCentres)),
      isOffline$: this.networkStateProvider.isOffline$,
    };
    this.merged$ = merge(this.pageState.activeTestCentres$);
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
    this.candidateInfoChanged('');
  }

  verifyAdvancedSearch(): string {
    const role: ExaminerRole = this.appConfig.getAppConfig()?.role as ExaminerRole;
    if ([ExaminerRole.DLG, ExaminerRole.LDTM].includes(role)) {
      return null;
    }
    return this.authenticationProvider.getEmployeeId();
  }

  candidateInfoChanged(val: string) {
    if (val.length > 0) {
      this.isUserEnteringApplicationReference = !Number.isNaN(Number(val[0]));
      this.candidateInfo = val?.toUpperCase();
    } else {
      this.isUserEnteringApplicationReference = false;
      this.candidateInfo = '';
    }
  }

  searchTests(): void {
    if (this.searchBy === SearchBy.DriverNumber) {
      this.subscription.unsubscribe();
      this.store$.dispatch(PerformDriverNumberSearch());
      this.showSearchSpinner.set(true);
      this.subscription = this.searchProvider
        .driverNumberSearch(this.candidateInfo)
        .pipe(
          tap(() => this.hasSearched.set(true)),
          map((results) => {
            this.searchResults.set(results);
            this.showSearchSpinner.set(false);
          }),
          catchError(async (err: Error) => {
            this.store$.dispatch(
              SaveLog({
                payload: this.logHelper.createLog(LogType.ERROR, 'Searching tests by driver number', err.message),
              })
            );
            this.searchResults.set([]);
            this.showSearchSpinner.set(false);

            if (err) {
              await this.showError(err);
              this.hasSearched.set(false);
              return of();
            }

            this.hasSearched.set(true);
            return of(true);
          })
        )
        .subscribe();
    }

    if (this.searchBy === SearchBy.ApplicationReference) {
      this.subscription.unsubscribe();
      this.store$.dispatch(PerformApplicationReferenceSearch());
      this.showSearchSpinner.set(true);
      this.subscription = this.searchProvider
        .applicationReferenceSearch(formatBookingReferenceForBackend(this.candidateInfo))
        .pipe(
          tap(() => this.hasSearched.set(true)),
          tap((results) => {
            this.searchResults.set(results);
            this.showSearchSpinner.set(false);
          }),
          catchError(async (err: Error) => {
            this.store$.dispatch(
              SaveLog({
                payload: this.logHelper.createLog(
                  LogType.ERROR,
                  `Searching tests by app ref (${this.candidateInfo})`,
                  err.message
                ),
              })
            );
            this.searchResults.set([]);
            this.showSearchSpinner.set(false);

            if (err) {
              await this.showError(err);
              this.hasSearched.set(false);
              return of();
            }

            this.hasSearched.set(true);
            return of(true);
          })
        )
        .subscribe();
    }
  }

  advancedSearch(advancedSearchParams: AdvancedSearchParams): void {
    this.subscription.unsubscribe();
    this.store$.dispatch(PerformLDTMSearch(advancedSearchParams));
    this.showAdvancedSearchSpinner.set(true);
    this.subscription = this.searchProvider
      .advancedSearch(advancedSearchParams)
      .pipe(
        tap(() => this.hasSearched.set(true)),
        tap((results) => {
          this.searchResults.set(orderBy(results, ['testDate', 'category'], ['desc', 'asc']));
          this.showAdvancedSearchSpinner.set(false);
        }),
        catchError(async (err: Error) => {
          this.store$.dispatch(
            SaveLog({
              payload: this.logHelper.createLog(
                LogType.ERROR,
                `Advanced search with params (${
                  advancedSearchParams ? JSON.stringify(advancedSearchParams) : 'Could not get params'
                })`,
                err.message
              ),
            })
          );
          this.searchResults.set([]);
          this.showAdvancedSearchSpinner.set(false);
          if (err) {
            await this.showError(err);
            this.hasSearched.set(false);
          }
          return of();
        })
      )
      .subscribe();
  }

  showError = async (error: Error): Promise<void> => {
    if (!error) return;

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
