import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { stripNullishValues } from '@shared/helpers/formatters';
import { UrlProvider } from '../url/url';
import { AdvancedSearchParams } from './search.models';
import { AppConfigProvider } from '../app-config/app-config';

@Injectable()
export class SearchProvider {

  constructor(
    private http: HttpClient,
    private urlProvider: UrlProvider,
    private appConfig: AppConfigProvider,
  ) {
  }

  examinerRecordsSearch(staffNumber: string, startDate?: string, endDate?: string): Observable<string> {
    let parameters = {};

    [
      { name: 'staffNumber', val: staffNumber },
      { name: 'startDate', val: startDate },
      { name: 'endDate', val: endDate },
    ].forEach(param => {
      if (param.val) parameters[param.name] = param.val
    })

    return this.http.get<string>(
      this.urlProvider.getExaminerRecordsUrl(),
      {
        params: parameters,
      },
    ).pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  }

  driverNumberSearch(driverNumber: string): Observable<SearchResultTestSchema[]> {
    return this.http.get<SearchResultTestSchema[]>(
      this.urlProvider.getTestResultServiceUrl(),
      {
        params: {
          driverNumber,
        },
      },
    ).pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  }

  applicationReferenceSearch(applicationReference: string): Observable<SearchResultTestSchema[]> {
    return this.http.get<SearchResultTestSchema[]>(
      this.urlProvider.getTestResultServiceUrl(),
      {
        params: {
          applicationReference,
        },
      },
    ).pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
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
    return this.http.get<SearchResultTestSchema[]>(
      this.urlProvider.getTestResultServiceUrl(),
      { params },
    ).pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  }

  getTestResult(applicationReference: string, staffNumber: string): Observable<HttpResponse<SearchResultTestSchema[]>> {
    return this.http.get<SearchResultTestSchema[]>(
      this.urlProvider.getTestResultServiceUrl().concat(`/${applicationReference}/${staffNumber}`),
      { observe: 'response' },
    ).pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  }

  getTestResults(body: string): Observable<HttpResponse<string>> {
    return this.http.post<string>(
      this.urlProvider.getMultipleTestResultsUrl(),
      body,
      { observe: 'response' }
    ).pipe(timeout(this.appConfig.getAppConfig().requestTimeout))
  }

  getRegeneratedEmails(applicationReference: string): Observable<string> {
    return this.http.get<string>(this.urlProvider.getTestResultServiceUrl()
      .concat(`/regeneratedemails/${applicationReference}`))
      .pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  }
}
