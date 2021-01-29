import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RekeySearchParams } from './rekey-search.model';
import { UrlProvider } from '../url/url';

@Injectable()
export class RekeySearchProvider {

  constructor(
    private httpClient: HttpClient,
    private urlProvider: UrlProvider,
  ) { }

  getBooking(rekeySearchParams: RekeySearchParams): Observable<Object> {
    return this.httpClient.get(
      this.urlProvider.getRekeySearchUrl(rekeySearchParams.staffNumber),
      {
        params: {
          appRef: rekeySearchParams.applicationReference,
        },
      },
    );
  }

}
