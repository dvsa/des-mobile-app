import { TestCentreDetailResponse } from '@shared/models/test-centre-journal.model';
import { Observable, of } from 'rxjs';

export class TestCentreJournalMock {
	getTestCentreJournal = (): Observable<Object> => {
		return of({} as TestCentreDetailResponse);
	};

	allJournalsEmpty = () => true;
}
