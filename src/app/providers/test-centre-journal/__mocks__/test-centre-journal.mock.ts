import { Observable, of } from 'rxjs';
import { TestCentreDetailResponse } from '../../../shared/models/test-centre-journal.model';

export class TestCentreJournalMock {

  getTestCentreJournal = (): Observable<Object> => {
    return of({} as TestCentreDetailResponse);
  };

  allJournalsEmpty = () => true;

}
