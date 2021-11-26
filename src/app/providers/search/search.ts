import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UrlProvider } from '../url/url';
import { AdvancedSearchParams } from './search.models';
import { AppConfigProvider } from '../app-config/app-config';

@Injectable()
export class SearchProvider {

  constructor(
    private http: HttpClient,
    private urlProvider: UrlProvider,
    private appConfig: AppConfigProvider,
  ) { }

  driverNumberSearch(driverNumber: string): Observable<any> {
    return this.http.get(
      this.urlProvider.getTestResultServiceUrl(),
      {
        params: {
          driverNumber,
        },
      },
    ).pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  }

  applicationReferenceSearch(applicationReference: string): Observable<any> {
    return this.http.get(
      this.urlProvider.getTestResultServiceUrl(),
      {
        params: {
          applicationReference,
        },
      },
    ).pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  }

  advancedSearch(advancedSearchParams: AdvancedSearchParams): Observable<any> {
    return this.http.get(
      this.urlProvider.getTestResultServiceUrl(),
      {
        params: {
          startDate: advancedSearchParams.startDate,
          endDate: advancedSearchParams.endDate,
          staffNumber: advancedSearchParams.staffNumber,
          dtcCode: advancedSearchParams.costCode,
          excludeAutoSavedTests: advancedSearchParams.excludeAutoSavedTests,
        },
      },
    ).pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  }

  getTestResult(applicationReference: string, staffNumber: string): Observable<HttpResponse<any>> {
    return this.http.get(
      this.urlProvider.getTestResultServiceUrl().concat(`/${applicationReference}/${staffNumber}`),
      { observe: 'response' },
    ).pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  }
}
