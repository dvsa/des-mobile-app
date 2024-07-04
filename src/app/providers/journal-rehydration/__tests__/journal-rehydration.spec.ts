import { TestBed } from '@angular/core/testing';

import { JournalRehydrationProvider } from '../journal-rehydration';
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

fdescribe('JournalRehydrationService', () => {
  let service: JournalRehydrationProvider;

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

      const spy = spyOn(service, 'makeRehydrationNetworkCall');

      await service.rehydrateTests(testsModel, testSlots as SlotItem[], 'test');

      expect(spy).toHaveBeenCalledWith([{
        slotId: 1,
        appRef: '123024',
      }], 'test');
    });

    it('should not call network call if no tests need rehydration', async () => {
      const testSlots = [
        { slotData: { slotDetail: { slotId: 1 }, booking: null } },
      ];
      const testsModel: TestsModel = {
        currentTest: { slotId: '' },
        startedTests: {},
        testStatus: { 1: TestStatus.Completed },
      };
      const spy = spyOn(service, 'makeRehydrationNetworkCall');

      await service.rehydrateTests(testsModel, testSlots as SlotItem[], 'test');

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
