import { ExaminerWorkSchedule } from '@dvsa/mes-journal-schema';
import { of, Observable } from 'rxjs';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

const localJournalJson = require('../../../../../mock/local-journal.json');

export class JournalProviderMock {

  static mockJournal: ExaminerWorkSchedule = localJournalJson;

  private do304ErrorNextCall = false;
  private doTimeoutErrorNextCall = false;
  private doActualError = false;

  public getJournal(): Observable<ExaminerWorkSchedule> {
    if (this.do304ErrorNextCall) {
      return ErrorObservable.create({ status: 304 });
    }
    if (this.doTimeoutErrorNextCall) {
      return ErrorObservable.create({ message: 'Timeout has occurred' });
    }
    if (this.doActualError) {
      return ErrorObservable.create({});
    }
    return of(JournalProviderMock.mockJournal);
  }
  public saveJournalForOffline = () => { };

  public setupHttp304Error() {
    this.do304ErrorNextCall = true;
  }

  public setupActualError() {
    this.doActualError = true;
  }

  public setupTimeoutError() {
    this.doTimeoutErrorNextCall = true;
  }
}
