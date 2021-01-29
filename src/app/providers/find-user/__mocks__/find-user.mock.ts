import { Observable } from 'rxjs/observable';
import { of } from 'rxjs';

export class FindUserProviderMock {

  userExists(): Observable<Object> {
    return of();
  }
}
