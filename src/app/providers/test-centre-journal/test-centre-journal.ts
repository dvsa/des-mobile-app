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
    private appConfig: AppConfigProvider
  ) {}

  getTestCentreJournal = (costCode?: string): Observable<Object> => {
    if (costCode) {
      return this.getTestCentreJournalByCostCode(costCode);
    }

    return this.http
      .get(this.urlProvider.getTestCentreJournalUrl())
      .pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  };

  private getTestCentreJournalByCostCode = (costCode: string): Observable<Object> => {
    return this.http
      .get(`${this.urlProvider.getTestCentreJournalUrl()}/${costCode}`)
      .pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  };
}
