import { of } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

export class TestSubmissionProviderMock {

  submitTests = jasmine.createSpy('submitTests').and.returnValue(of([
    new HttpResponse({ status: 201 }),
    new HttpResponse({ status: 201 }),
    new HttpErrorResponse({ status: 500 }),
  ]));

}
