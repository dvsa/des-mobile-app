import { gunzipSync } from 'zlib';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { Store, StoreModule } from '@ngrx/store';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { take } from 'rxjs/operators';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '../../app-config/app-config';
import { LogHelper } from '../../logs/logs-helper';
import { UrlProviderMock } from '../../url/__mocks__/url.mock';
import { UrlProvider } from '../../url/url';
import { TestSubmissionProvider, TestToSubmit } from '../test-submission';

describe('TestSubmissionProvider', () => {
  let testSubmissionProvider: TestSubmissionProvider;
  let urlProvider: UrlProvider;
  let httpMock: HttpTestingController;
  const mockTestToSubmit = {
    index: 0,
    slotId: '',
    payload: {},
    status: TestStatus.Completed,
  } as TestToSubmit;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({
          appInfo: () => ({
            versionNumber: '5',
          }),
        }),
      ],
      providers: [
        TestSubmissionProvider,
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
        {
          provide: UrlProvider,
          useClass: UrlProviderMock,
        },
        Store,
        {
          provide: LogHelper,
          useClass: LogHelperMock,
        },
      ],
    });

    testSubmissionProvider = TestBed.inject(TestSubmissionProvider);
    httpMock = TestBed.inject(HttpTestingController);
    urlProvider = TestBed.inject(UrlProvider);
    spyOn(testSubmissionProvider, 'compressData').and.callThrough();
    spyOn(testSubmissionProvider, 'removeNullFieldsDeep').and.callThrough();
    spyOn(testSubmissionProvider, 'submitTest').and.callThrough();
  }));

  afterAll(() => {
    httpMock.verify();
  });

  describe('submitTests', () => {
    it('should attempt to submit a test', () => {
      testSubmissionProvider
        .submitTests([mockTestToSubmit] as TestToSubmit[])
        .pipe(take(1))
        .subscribe();

      const req = httpMock.expectOne('https://www.example.com/api/v1/test-result');

      expect(req.request.body).toBe('H4sIAAAAAAAAA6uuBQBDv6ajAgAAAA==');
      expect(req.request.method).toBe('POST');
      req.flush({});

      expect(urlProvider.getTestResultServiceUrl).toHaveBeenCalled();
      expect(testSubmissionProvider.compressData).toHaveBeenCalled();
      expect(testSubmissionProvider.removeNullFieldsDeep).toHaveBeenCalled();
      expect(testSubmissionProvider.submitTest).toHaveBeenCalledTimes(1);
    });
  });
  describe('compressData', () => {
    it('should successfully compress the provided data', () => {
      // ARRANGE
      const mockData: Partial<CatBUniqueTypes.TestResult> = {
        category: 'B',
        communicationPreferences: {
          updatedEmail: 'test@test.com',
          communicationMethod: 'Post',
          conductedLanguage: 'English',
        },
      };
      // ACT
      const result = testSubmissionProvider.compressData(mockData);
      // ASSERT
      const gzippedBytes = Buffer.from(result, 'base64');
      const unzippedJson = gunzipSync(gzippedBytes).toString();
      const json = JSON.parse(unzippedJson);
      expect(json).toEqual(mockData);
    });
  });
  describe('removeNullFieldsDeep', () => {
    it('should successfully remove null props from the provided data', () => {
      // ARRANGE
      const mockData: Partial<CatBUniqueTypes.TestResult> = {
        category: 'B',
        activityCode: null,
        communicationPreferences: {
          updatedEmail: 'test@test.com',
          communicationMethod: 'Post',
          conductedLanguage: 'English',
        },
        instructorDetails: {
          registrationNumber: null,
        },
      };
      const expected = {
        category: 'B',
        communicationPreferences: {
          updatedEmail: 'test@test.com',
          communicationMethod: 'Post',
          conductedLanguage: 'English',
        },
        instructorDetails: {},
      } as Partial<CatBUniqueTypes.TestResult>;
      // ACT
      const result = testSubmissionProvider.removeNullFieldsDeep(mockData as CatBUniqueTypes.TestResult);
      // ASSERT
      expect(result).toEqual(expected);
    });
  });
  describe('isPartialSubmission', () => {
    it('should be a partial submission when the test status is WRITE_UP and test is not a rekey', () => {
      const result = testSubmissionProvider.isPartialSubmission({
        index: 0,
        slotId: '',
        payload: {
          version: '0.0.1',
          category: 'B',
          rekey: false,
          journalData: null,
          activityCode: '1',
          changeMarker: false,
          examinerBooked: 1,
          examinerConducted: 1,
          examinerKeyed: 1,
        },
        status: TestStatus.WriteUp,
      });

      // ASSERT
      expect(result).toEqual(true);
    });
    it('should not be a partial submission when the test status is WRITE_UP and test is a rekey', () => {
      const result = testSubmissionProvider.isPartialSubmission({
        index: 0,
        slotId: '',
        payload: {
          version: '0.0.1',
          category: 'B',
          rekey: true,
          journalData: null,
          activityCode: '1',
          changeMarker: false,
          examinerBooked: 1,
          examinerConducted: 1,
          examinerKeyed: 1,
        },
        status: TestStatus.WriteUp,
      });

      // ASSERT
      expect(result).toEqual(false);
    });
    it('should not be a partial submission when the test status is not WRITE_UP and test is not a rekey', () => {
      const result = testSubmissionProvider.isPartialSubmission({
        index: 0,
        slotId: '',
        payload: {
          version: '0.0.1',
          category: 'B',
          rekey: false,
          journalData: null,
          activityCode: '1',
          changeMarker: false,
          examinerBooked: 1,
          examinerConducted: 1,
          examinerKeyed: 1,
        },
        status: TestStatus.Completed,
      });

      // ASSERT
      expect(result).toEqual(false);
    });
    it('should not be a partial submission when the test status is not WRITE_UP and test is a rekey', () => {
      const result = testSubmissionProvider.isPartialSubmission({
        index: 0,
        slotId: '',
        payload: {
          version: '0.0.1',
          category: 'B',
          rekey: false,
          journalData: null,
          activityCode: '1',
          changeMarker: false,
          examinerBooked: 1,
          examinerConducted: 1,
          examinerKeyed: 1,
        },
        status: TestStatus.Completed,
      });

      // ASSERT
      expect(result).toEqual(false);
    });
  });

  describe('buildUrl', () => {
    it('build url should set partial query string as true if not a rekey and test status is write up', () => {
      const result = testSubmissionProvider.buildUrl({
        index: 0,
        slotId: '',
        payload: {
          version: '0.0.1',
          category: 'B',
          rekey: false,
          journalData: null,
          activityCode: '1',
          changeMarker: false,
          examinerBooked: 1,
          examinerConducted: 1,
          examinerKeyed: 1,
        },
        status: TestStatus.WriteUp,
      });

      // ASSERT
      expect(result).toEqual('https://www.example.com/api/v1/test-result?partial=true');
    });

    it('url should not set partial query string as if its a rekey', () => {
      const result = testSubmissionProvider.buildUrl({
        index: 0,
        slotId: '',
        payload: {
          version: '0.0.1',
          category: 'B',
          rekey: true,
          journalData: null,
          activityCode: '1',
          changeMarker: false,
          examinerBooked: 1,
          examinerConducted: 1,
          examinerKeyed: 1,
        },
        status: TestStatus.WriteUp,
      });

      // ASSERT
      expect(result).toEqual('https://www.example.com/api/v1/test-result');
    });

    it('should not have partial query string if its not rekey and test status is not writeup', () => {
      const result = testSubmissionProvider.buildUrl({
        index: 0,
        slotId: '',
        payload: {
          version: '0.0.1',
          category: 'B',
          rekey: false,
          journalData: null,
          activityCode: '1',
          changeMarker: false,
          examinerBooked: 1,
          examinerConducted: 1,
          examinerKeyed: 1,
        },
        status: TestStatus.Completed,
      });

      // ASSERT
      expect(result).toEqual('https://www.example.com/api/v1/test-result');
    });
  });

  describe('removePassCompletionWhenTestIsNotPass', () => {
    it('should not remove the pass completion key if the activity code is a Pass', () => {
      const result: Partial<TestResultSchemasUnion> = testSubmissionProvider.removePassCompletionWhenTestIsNotPass({
        activityCode: '1',
        category: 'B',
        accompaniment: {
          ADI: true,
        },
        passCompletion: {
          passCertificateNumber: 'A123456X',
          provisionalLicenceProvided: true,
        },
      });

      expect(result).toEqual({
        activityCode: '1',
        category: 'B',
        accompaniment: {
          ADI: true,
        },
        passCompletion: {
          passCertificateNumber: 'A123456X',
          provisionalLicenceProvided: true,
        },
      });
    });
    it('should remove the pass completion key if the activity code is not a pass', () => {
      const result: Partial<TestResultSchemasUnion> = testSubmissionProvider.removePassCompletionWhenTestIsNotPass({
        activityCode: '3',
        category: 'B',
        accompaniment: {
          ADI: true,
        },
        passCompletion: {
          passCertificateNumber: 'A123456X',
          provisionalLicenceProvided: true,
        },
      });

      expect(result).toEqual({
        activityCode: '3',
        category: 'B',
        accompaniment: {
          ADI: true,
        },
      });
    });
  });
});
