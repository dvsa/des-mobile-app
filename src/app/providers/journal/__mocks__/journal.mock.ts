import { HttpErrorResponse } from '@angular/common/http';
import { ExaminerWorkSchedule } from '@dvsa/mes-journal-schema';
import { Observable, of, throwError } from 'rxjs';
import { default as localJournalJson } from '@assets/mock/local-journal.json';

export class JournalProviderMock {

  static mockJournal = localJournalJson as ExaminerWorkSchedule;

  private do304ErrorNextCall = false;
  private doTimeoutErrorNextCall = false;
  private doActualError = false;
  private doHttpResponseError = false;

  public getJournal(): Observable<ExaminerWorkSchedule> {
    if (this.do304ErrorNextCall) {
      return throwError(() => ({ status: 304 }));
    }
    if (this.doTimeoutErrorNextCall) {
      return throwError(() => ({ message: 'Timeout has occurred' }));
    }
    if (this.doActualError) {
      return throwError(() => ({}));
    }
    if (this.doHttpResponseError) {
      return throwError(() => new HttpErrorResponse({
        error: 'Error message',
        status: 403,
        statusText: 'Forbidden',
      }));
    }
    return of(JournalProviderMock.mockJournal);
  }

  public saveJournalForOffline = () => {
  };

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

  emptyCachedData = () => ({}) as ExaminerWorkSchedule;

  isCacheTooOld = () => true;
}
