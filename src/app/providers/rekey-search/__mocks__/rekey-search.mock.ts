import { of } from 'rxjs';
import { bookedTestMockHash } from './booked-test.mock';

export class RekeySearchProviderMock {
  getBooking() {
    return of(bookedTestMockHash);
  }
}
