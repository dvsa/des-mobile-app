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
    const params = JSON.parse(JSON.stringify(stripNullishValues(advancedSearchParams)));
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

  getRegeneratedEmails(applicationReference: string): Observable<string> {
    return this.http.get<string>(this.urlProvider.getTestResultServiceUrl()
      .concat(`/regeneratedemails/${applicationReference}`))
      .pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  }
}
