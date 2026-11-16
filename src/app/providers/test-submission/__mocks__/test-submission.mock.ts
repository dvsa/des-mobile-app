import { HttpErrorResponse, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { of } from 'rxjs';
import { vi } from 'vitest';

export class TestSubmissionProviderMock {
  submitTests = vi
    .fn()
    .mockReturnValue(
      of([
        new HttpResponse({ status: HttpStatusCode.Created }),
        new HttpResponse({ status: HttpStatusCode.Created }),
        new HttpErrorResponse({ status: HttpStatusCode.InternalServerError }),
      ])
    );

  buildUrl = vi.fn().mockReturnValue('some-url');

  compressData = vi.fn().mockReturnValue('some-data');

  removeFieldsForPartialData = vi.fn().mockReturnValue({} as TestResultSchemasUnion);

  removeNullFieldsDeep = vi.fn().mockReturnValue({} as TestResultSchemasUnion);

  removePassCompletionWhenTestIsNotPass = vi.fn().mockReturnValue({} as TestResultSchemasUnion);

  submitTest = vi.fn().mockReturnValue(new HttpResponse());

  isPartialSubmission = vi.fn().mockReturnValue(false);
}
