import { Observable, of } from 'rxjs';

export class FindUserProviderMock {
	userExists(): Observable<Object> {
		return of();
	}
}
