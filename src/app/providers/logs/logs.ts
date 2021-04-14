import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Log } from '@shared/models/log.model';
import { UrlProvider } from '../url/url';

@Injectable()
export class LogsProvider {
  constructor(
    public http: HttpClient,
    public urlProvider: UrlProvider,
  ) {
  }

  public sendLogs = (logs: Log[]): Observable<Object> => {
    if (logs.length > 0) {
      const logsServiceUrl = this.urlProvider.getLogsServiceUrl();
      return this.http.post(logsServiceUrl, logs);
    }
    return of();
  };
}
