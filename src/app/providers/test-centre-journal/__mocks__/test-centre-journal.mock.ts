import { Observable, of } from 'rxjs';

export class TestCentreJournalMock {

  getTestCentreJournal = (): Observable<Object> => {
    return of();
  };

  allJournalsEmpty = () => true;

}
