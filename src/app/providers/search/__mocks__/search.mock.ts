import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { searchResultsMock } from './search-results.mock';

export class SearchProviderMock {
	driverNumberSearch = jasmine.createSpy('driverNumberSearch').and.returnValue(of(searchResultsMock));

	applicationReferenceSearch = jasmine.createSpy('applicationReferenceSearch').and.returnValue(of(searchResultsMock));

	advancedSearch = jasmine.createSpy('advancedSearch').and.returnValue(of(searchResultsMock));

	getTestResult(): Observable<any> {
		return of(
			new HttpResponse({
				// eslint-disable-next-line max-len
				body: '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',
				status: HttpStatusCode.Ok,
				statusText: 'OK',
			})
		);
	}

	getTestResults(): Observable<any> {
		return of(
			new HttpResponse({
				// eslint-disable-next-line max-len
				body: '',
				status: HttpStatusCode.Ok,
				statusText: 'OK',
			})
		);
	}

	getRegeneratedEmails(): Observable<string> {
		return of(
			// eslint-disable-next-line max-len
			'H4sIAAAAAAAAA6tWSiwoCEpNU7IyNIADHaXU3MTMnKDU9NS81KLEksz8PJfUEqBIsZJVdLVSXmq5K0heyQrEjAerdShJLS5R0gEJ+CTmpZcmpqcCpV3z0nMyizOA4kUws1JTXIAEUM7IwMhY18BE18BUwdDQysDAytRCD2K9Um1sLQD5rqtemAAAAA=='
		);
	}
}
