import { of } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';

export class TestSubmissionProviderMock {

  submitTests = jasmine.createSpy('submitTests')
    .and
    .returnValue(of([
      new HttpResponse({ status: 201 }),
      new HttpResponse({ status: 201 }),
      new HttpErrorResponse({ status: 500 }),
    ]));

  buildUrl = jasmine
    .createSpy('buildUrl')
    .and
    .returnValue('some-url');

  compressData = jasmine
    .createSpy('compressData')
    .and
    .returnValue('some-data');

  removeFieldsForPartialData = jasmine
    .createSpy('removeFieldsForPartialData')
    .and
    .returnValue({} as TestResultSchemasUnion);

  removeNullFieldsDeep = jasmine
    .createSpy('removeNullFieldsDeep')
    .and
    .returnValue({} as TestResultSchemasUnion);

  removePassCompletionWhenTestIsNotPass = jasmine
    .createSpy('removePassCompletionWhenTestIsNotPass')
    .and
    .returnValue({} as TestResultSchemasUnion);

  submitTest = jasmine
    .createSpy('submitTest')
    .and
    .returnValue(new HttpResponse());

  isPartialSubmission = jasmine
    .createSpy('isPartialSubmission')
    .and
    .returnValue(false);

}
