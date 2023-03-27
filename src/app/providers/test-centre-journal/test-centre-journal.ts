import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

import { AppConfigProvider } from '../app-config/app-config';
import { UrlProvider } from '../url/url';

@Injectable()
export class TestCentreJournalProvider {

  constructor(
    private http: HttpClient,
    private urlProvider: UrlProvider,
    private appConfig: AppConfigProvider,
  ) { }

  getTestCentreJournal = (tcID?: number): Observable<Object> => {
    if (tcID) {
      return this.getTestCentreJournalByID(tcID);
    }

    return this.http.get(
      this.urlProvider.getTestCentreJournalUrl(),
    ).pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  };

  private getTestCentreJournalByID = (tcID: number): Observable<Object> => {
    return this.http.get(
      `${this.urlProvider.getTestCentreJournalUrl()}/${tcID}`,
    ).pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  };
}
