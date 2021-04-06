import { Observable, of } from 'rxjs';
import { bookedTestMockHash } from './booked-test.mock';

export class RekeySearchProviderMock {

  getBooking(): Observable<any> {
    return of(bookedTestMockHash);
  }

}
