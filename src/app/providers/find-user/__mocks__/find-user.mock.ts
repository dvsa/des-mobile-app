import { of, Observable } from 'rxjs';

export class FindUserProviderMock {

  userExists(): Observable<Object> {
    return of();
  }
}
