import { Platform, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { Subscription, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import { ErrorTypes } from '@shared/models/error-message';
import { BasePageComponent } from '@shared/classes/base-page';
import { StoreModel } from '@shared/models/store.model';
import { LogType } from '@shared/models/log.model';
import { MesError } from '@shared/models/mes-error.model';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { SearchProvider } from '@providers/search/search';
import { AdvancedSearchParams } from '@providers/search/search.models';
import { LogHelper } from '@providers/logs/logs-helper';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import { SaveLog } from '@store/logs/logs.actions';
import { AppComponent } from '@app/app.component';
import { ErrorPage } from '@pages/error-page/error';
import {
  TestResultSearchViewDidEnter, PerformApplicationReferenceSearch, PerformDriverNumberSearch, PerformLDTMSearch,
} from './test-results-search.actions';

enum SearchBy {
  DriverNumber = 'driverNumber',
  ApplicationReference = 'appReference',
}

@Component({
  selector: 'app-test-results-search',
  templateUrl: 'test-results-search.html',
  styleUrls: ['test-results-search.scss'],
})
export class TestResultsSearchPage extends BasePageComponent {

  searchBy: SearchBy = SearchBy.ApplicationReference;
  candidateInfo: string = '';
  focusedElement: string = null;
  searchResults: SearchResultTestSchema[] = [];
  hasSearched: boolean = false;
  showSearchSpinner: boolean = false;
  showAdvancedSearchSpinner: boolean = false;
  subscription: Subscription = Subscription.EMPTY;

  constructor(
    public modalController: ModalController,
    public router: Router,
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    public searchProvider: SearchProvider,
    private appConfig: AppConfigProvider,
    private store$: Store<StoreModel>,
    private logHelper: LogHelper,
    private app: AppComponent,
  ) {
    super(platform, authenticationProvider, router);
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(TestResultSearchViewDidEnter());
  }

  ionViewDidLeave(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  searchByChanged(val: SearchBy): void {
    this.searchBy = val;
  }

  displayAdvancedSearch(): boolean {
    const role: ExaminerRole = this.appConfig.getAppConfig().role as ExaminerRole;
    return [ExaminerRole.DLG, ExaminerRole.LDTM].includes(role);
  }

  candidateInfoChanged(val: string): void {
    this.candidateInfo = val;
  }

  searchTests(): void {
    if (this.searchBy === SearchBy.DriverNumber) {
      this.subscription.unsubscribe();
      this.store$.dispatch(PerformDriverNumberSearch());
      this.showSearchSpinner = true;
      this.subscription = this.searchProvider.driverNumberSearch(this.candidateInfo)
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
      this.subscription = this.searchProvider.applicationReferenceSearch(this.candidateInfo)
        .pipe(
          tap(() => this.hasSearched = true),
          map((results) => {
            this.searchResults = results;
            this.showSearchSpinner = false;
          }),
          catchError(async (err: HttpErrorResponse) => {
            this.store$.dispatch(SaveLog({
              payload: this.logHelper.createLog(
                LogType.ERROR, `Searching tests by app ref (${this.candidateInfo})`, err.message,
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
          this.searchResults = results;
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
      componentProps: { errorType: ErrorTypes.SEARCH, displayAsModal: true },
      cssClass: `modal-fullscreen ${this.app.getTextZoomClass()}`,
    });
    await modal.present();
  };

  setFocus(focus: string): void {
    this.focusedElement = focus;
  }
}
