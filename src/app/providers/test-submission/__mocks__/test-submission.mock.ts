import { HttpErrorResponse, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { of } from 'rxjs';

export class TestSubmissionProviderMock {
  submitTests = jasmine
    .createSpy('submitTests')
    .and.returnValue(
      of([
        new HttpResponse({ status: HttpStatusCode.Created }),
        new HttpResponse({ status: HttpStatusCode.Created }),
        new HttpErrorResponse({ status: HttpStatusCode.InternalServerError }),
      ])
    );

  buildUrl = jasmine.createSpy('buildUrl').and.returnValue('some-url');

  compressData = jasmine.createSpy('compressData').and.returnValue('some-data');

  removeFieldsForPartialData = jasmine
    .createSpy('removeFieldsForPartialData')
    .and.returnValue({} as TestResultSchemasUnion);

  removeNullFieldsDeep = jasmine.createSpy('removeNullFieldsDeep').and.returnValue({} as TestResultSchemasUnion);

  removePassCompletionWhenTestIsNotPass = jasmine
    .createSpy('removePassCompletionWhenTestIsNotPass')
    .and.returnValue({} as TestResultSchemasUnion);

  submitTest = jasmine.createSpy('submitTest').and.returnValue(new HttpResponse());

  isPartialSubmission = jasmine.createSpy('isPartialSubmission').and.returnValue(false);
}
