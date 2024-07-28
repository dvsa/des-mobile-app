import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlProvider } from '../url/url';
import { RekeySearchParams } from './rekey-search.model';

@Injectable()
export class RekeySearchProvider {
	constructor(
		private httpClient: HttpClient,
		private urlProvider: UrlProvider
	) {}

	getBooking(rekeySearchParams: RekeySearchParams): Observable<Object> {
		return this.httpClient.get(this.urlProvider.getRekeySearchUrl(rekeySearchParams.staffNumber), {
			params: {
				appRef: rekeySearchParams.applicationReference,
			},
		});
	}
}
