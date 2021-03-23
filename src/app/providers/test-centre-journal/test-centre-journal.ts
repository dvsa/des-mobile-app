import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

import { AppConfigProvider } from '../app-config/app-config';
import { UrlProvider } from '../url/url';
import { TestCentreDetailResponse } from '../../shared/models/test-centre-journal.model';

@Injectable()
export class TestCentreJournalProvider {

  constructor(
    private http: HttpClient,
    private urlProvider: UrlProvider,
    private appConfig: AppConfigProvider,
  ) { }

  getTestCentreJournal = (): Observable<Object> => {
    return this.http.get(
      this.urlProvider.getTestCentreJournalUrl(),
    ).pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  };

  allJournalsEmpty = (
    testCentreResponse: TestCentreDetailResponse,
  ): boolean => testCentreResponse?.examiners.every((examiner) => !examiner.journal);

}
