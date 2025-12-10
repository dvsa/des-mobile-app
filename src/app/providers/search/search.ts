import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { stripNullishValues } from '@shared/helpers/formatters';
import { ActivityCodes } from '@shared/models/activity-codes';
import { Observable, of } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { AppConfigProvider } from '../app-config/app-config';
import { UrlProvider } from '../url/url';
import { AdvancedSearchParams } from './search.models';

@Injectable()
export class SearchProvider {
  constructor(
    private http: HttpClient,
    private urlProvider: UrlProvider,
    private appConfig: AppConfigProvider
  ) {}

  examinerRecordsSearch(staffNumber: string, startDate?: string, endDate?: string): Observable<string> {
    const parameters = {};

    [
      { name: 'staffNumber', val: staffNumber },
      { name: 'startDate', val: startDate },
      { name: 'endDate', val: endDate },
    ].forEach((param) => {
      if (param.val) parameters[param.name] = param.val;
    });

    return this.http
      .get<string>(this.urlProvider.getExaminerRecordsUrl(), {
        params: parameters,
      })
      .pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  }

  driverNumberSearch(driverNumber: string): Observable<SearchResultTestSchema[]> {
    return this.http
      .get<SearchResultTestSchema[]>(this.urlProvider.getTestResultServiceUrl(), {
        params: {
          driverNumber,
        },
      })
      .pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  }

  applicationReferenceSearch(applicationReference: string): Observable<SearchResultTestSchema[]> {
    return of([
      {
        /**
         * The test center ID
         */
        costCode: 'cost code',
        /**
         * The date and time of the test
         */
        testDate: '2025-12-10',
        /**
         * The candidate's driver number, typically (though not always) 16 characters if UK, or 8 digits if NI
         */
        driverNumber: 'number',
        candidateName: {
          title: 'mr',
          firstName: 'name',
          lastName: 'name',
        },
        /**
         * The application ID
         */
        applicationReference: 'This is an app ref',
        /**
         * Category code for the test report
         */
        category: 'B',
        activityCode: ActivityCodes.PASS,
        /**
         * Upload status of the test
         */
        autosave: 1,
      },
    ]);
    // return this.http
    //   .get<SearchResultTestSchema[]>(this.urlProvider.getTestResultServiceUrl(), {
    //     params: {
    //       applicationReference,
    //     },
    //   })
    //   .pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  }

  advancedSearch(advancedSearchParams: AdvancedSearchParams): Observable<SearchResultTestSchema[]> {
    const params = stripNullishValues({
      startDate: advancedSearchParams.startDate,
      endDate: advancedSearchParams.endDate,
      staffNumber: advancedSearchParams.staffNumber,
      dtcCode: advancedSearchParams.costCode,
      excludeAutoSavedTests: advancedSearchParams.excludeAutoSavedTests,
      category: encodeURIComponent(advancedSearchParams.category),
      activityCode: advancedSearchParams.activityCode,
      rekey: advancedSearchParams.rekey,
      passCertificateNumber: advancedSearchParams.passCertificateNumber
        ? encodeURIComponent(advancedSearchParams.passCertificateNumber)
        : null,
    });
    return this.http
      .get<SearchResultTestSchema[]>(this.urlProvider.getTestResultServiceUrl(), { params })
      .pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  }

  getTestResult(applicationReference: string, staffNumber: string): Observable<HttpResponse<string>> {
    return this.http
      .get<string>(this.urlProvider.getTestResultServiceUrl().concat(`/${applicationReference}/${staffNumber}`), {
        observe: 'response',
      })
      .pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  }

  getTestResults(body: string): Observable<HttpResponse<string>> {
    return this.http
      .post<string>(this.urlProvider.getMultipleTestResultsUrl(), body, { observe: 'response' })
      .pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  }

  getRegeneratedEmails(applicationReference: string): Observable<string> {
    return this.http
      .get<string>(this.urlProvider.getTestResultServiceUrl().concat(`/regeneratedemails/${applicationReference}`))
      .pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  }
}
