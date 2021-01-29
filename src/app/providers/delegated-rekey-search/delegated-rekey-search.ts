import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

import { AppConfigProvider } from '../app-config/app-config';
import { UrlProvider } from '../url/url';

@Injectable()
export class DelegatedRekeySearchProvider {

  constructor(
    private http: HttpClient,
    private urlProvider: UrlProvider,
    private appConfig: AppConfigProvider,
  ) { }

  getDelegatedExaminerBookingByAppRef(applicationReference: string): Observable<Object> {
    return this.http.get(
      this.urlProvider.getDelegatedExaminerSearchBookingUrl(applicationReference),
    ).pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  }

}
