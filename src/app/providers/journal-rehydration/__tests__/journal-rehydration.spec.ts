import { TestBed } from '@angular/core/testing';

import { JournalRehydrationProvider, RehydrationReturn } from '../journal-rehydration';
import { TestsModel } from '@store/tests/tests.model';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { SearchProviderMock } from '@providers/search/__mocks__/search.mock';
import { SearchProvider } from '@providers/search/search';
import { CompressionProvider } from '@providers/compression/compression';
import { CompressionProviderMock } from '@providers/compression/__mocks__/compression.mock';
import { StoreModule } from '@ngrx/store';
import { LogHelper } from '@providers/logs/logs-helper';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LoadRemoteTests } from '@store/tests/tests.actions';
import { of, throwError } from 'rxjs';
import { JournalData } from '@dvsa/mes-test-schema/categories/common';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { SaveLog } from '@store/logs/logs.actions';
import { LogType } from '@shared/models/log.model';

describe('JournalRehydrationService', () => {
  let service: JournalRehydrationProvider;
  let searchProviderMock: SearchProvider;
  let compressionProviderMock: CompressionProvider;
  let logHelperMock: LogHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
      ],
      providers: [
        JournalRehydrationProvider,
        {
          provide: SearchProvider,
          useClass: SearchProviderMock,
        },
        {
          provide: CompressionProvider,
          useClass: CompressionProviderMock,
        },
        {
          provide: LogHelper,
          useClass: LogHelperMock,
        },
      ],
    });
    service = TestBed.inject(JournalRehydrationProvider);
    searchProviderMock = TestBed.inject(SearchProvider);
    compressionProviderMock = TestBed.inject(CompressionProvider);
    logHelperMock = TestBed.inject(LogHelper);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('hasRehydratableTestStatus', () => {
    it('should return true if the test status is not WriteUp, Autosaved, Completed or Submitted', () => {
      const testsModel: TestsModel = {
        currentTest: {
          slotId: '',
        },
        startedTests: {},
        testStatus: {
          1: TestStatus.Started,
        },
      };
      expect(service.hasRehydratableTestStatus(1, testsModel)).toBe(true);
    });
    it('should return false if the test status is WriteUp', () => {
      const testsModel: TestsModel = {
        currentTest: {
          slotId: '',
        },
        startedTests: {},
        testStatus: {
          1: TestStatus.WriteUp,
        },
      };
      expect(service.hasRehydratableTestStatus(1, testsModel)).toBe(false);
    });
    it('should return false if the test status is Autosaved', () => {
      const testsModel: TestsModel = {
        currentTest: {
          slotId: '',
        },
        startedTests: {},
        testStatus: {
          1: TestStatus.Autosaved,
        },
      };
      expect(service.hasRehydratableTestStatus(1, testsModel)).toBe(false);
    });
    it('should return false if the test status is Completed', () => {
      const testsModel: TestsModel = {
        currentTest: {
          slotId: '',
        },
        startedTests: {},
        testStatus: {
          1: TestStatus.Completed,
        },
      };
      expect(service.hasRehydratableTestStatus(1, testsModel)).toBe(false);
    });
    it('should return false if the test status is Submitted', () => {
      const testsModel: TestsModel = {
        currentTest: {
          slotId: '',
        },
        startedTests: {},
        testStatus: {
          1: TestStatus.Submitted,
        },
      };
      expect(service.hasRehydratableTestStatus(1, testsModel)).toBe(false);
    });
  });

  describe('rehydrateTests', () => {
    it('should call makeRehydrationNetworkCall with correct parameters for rehydratable tests', async () => {
      spyOn(service, 'makeRehydrationNetworkCall');

      const testSlots = [
        {
          slotData: {
            slotDetail: { slotId: 1 },
            booking: { application: { applicationId: 123, bookingSequence: 2, checkDigit: 4 } },
          },
        },
        { slotData: { slotDetail: { slotId: 2 }, booking: null } },
      ];
      const testsModel: TestsModel = {
        currentTest: { slotId: '' },
        startedTests: {},
        testStatus: {},
      };


      await service.rehydrateTests(testsModel, testSlots as SlotItem[], 'test');

      expect(service.makeRehydrationNetworkCall).toHaveBeenCalledWith([{
        slotId: 1,
        appRef: '123024',
      }], 'test');
    });

    it('should not call network call if no tests need rehydration', async () => {
      spyOn(service, 'makeRehydrationNetworkCall');

      const testSlots = [
        { slotData: { slotDetail: { slotId: 1 }, booking: null } },
      ];
      const testsModel: TestsModel = {
        currentTest: { slotId: '' },
        startedTests: {},
        testStatus: { 1: TestStatus.Completed },
      };

      await service.rehydrateTests(testsModel, testSlots as SlotItem[], 'test');

      expect(service.makeRehydrationNetworkCall).not.toHaveBeenCalled();
    });
  });

  describe('makeRehydrationNetworkCall', () => {
    it('should dispatch LoadRemoteTests with the returned payload when tests are rehydrated', async () => {
      const mockData: RehydrationReturn[] = [{
        autosave: 1,
        test_result: {
          journalData: {
            applicationReference: {
              applicationId: 123,
              bookingSequence: 2,
              checkDigit: 4,
            },
          } as JournalData,
        } as TestResultSchemasUnion,
      },
      ];
      const mockResponse: HttpResponse<string> = {
        body: JSON.stringify(mockData),
        status: HttpStatusCode.Ok,
        statusText: 'OK',
      } as HttpResponse<string>;

      spyOn(searchProviderMock, 'getTestResults').and.returnValue(of(mockResponse));
      spyOn(compressionProviderMock, 'extract').and.returnValue(mockData);
      const dispatchSpy = spyOn(service['store$'], 'dispatch');

      searchProviderMock.getTestResults(['123024'], 'test').subscribe((response) => {
        console.log(response.body);
      });

      service.makeRehydrationNetworkCall([{ appRef: '123024', slotId: '1' }], 'test');

      expect(dispatchSpy).toHaveBeenCalledWith(LoadRemoteTests([{
        autosave: true,
        testData: {
          journalData: {
            applicationReference: {
              applicationId: 123,
              bookingSequence: 2,
              checkDigit: 4,
            },
          } as JournalData,
        } as TestResultSchemasUnion,
        slotId: '1',
      }]));
    });

    it('should not dispatch when there are no tests to rehydrate', async () => {
      const mockResponse: HttpResponse<string> = {
        body: JSON.stringify([]),
        status: HttpStatusCode.Ok,
        statusText: 'OK',
      } as HttpResponse<string>;

      spyOn(searchProviderMock, 'getTestResults').and.returnValue(of(mockResponse));
      spyOn(compressionProviderMock, 'extract').and.returnValue([]);
      spyOn(service['store$'], 'dispatch');

      service.makeRehydrationNetworkCall([], 'test');

      expect(service['store$'].dispatch).not.toHaveBeenCalled();
    });

    it('should dispatch SaveLog action when an error occurs during rehydration process', async () => {
      spyOn(searchProviderMock, 'getTestResults').and.returnValue(
        throwError(() => new Error('Error fetching test results'),
        ));

      spyOn(logHelperMock, 'createLog').and.callThrough();
      spyOn(service['store$'], 'dispatch');

      service.makeRehydrationNetworkCall([{ appRef: '123024', slotId: '1' }], 'test');

      expect(logHelperMock.createLog).toHaveBeenCalled();
      expect(service['store$'].dispatch).toHaveBeenCalledWith(jasmine.any(SaveLog));
    });
  });
});
