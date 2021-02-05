import { HttpErrorResponse } from '@angular/common/http';
import { ExaminerWorkSchedule } from '@dvsa/mes-journal-schema';
import { of, Observable } from 'rxjs';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

const localJournalJson = require('../../../../../mock/local-journal.json');

export class JournalProviderMock {

  static mockJournal: ExaminerWorkSchedule = localJournalJson;

  private do304ErrorNextCall = false;
  private doTimeoutErrorNextCall = false;
  private doActualError = false;
  private doHttpResponseError = false;

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
    if (this.doHttpResponseError) {
      return ErrorObservable.create(new HttpErrorResponse({
        error: 'Error message',
        status: 403,
        statusText: 'Forbidden',
      }));
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

  public setupHttpError() {
    this.doHttpResponseError = true;
  }

  public resetErrors() {
    this.do304ErrorNextCall = false;
    this.doActualError = false;
    this.doTimeoutErrorNextCall = false;
    this.doHttpResponseError = false;
  }
}
