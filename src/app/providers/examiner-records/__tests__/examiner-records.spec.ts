import { ExaminerRecordsProvider } from '../examiner-records';
import { TestBed } from '@angular/core/testing';
import moment from 'moment';
import { SearchProvider } from '@providers/search/search';
import { SearchProviderMock } from '@providers/search/__mocks__/search.mock';
import { CompressionProvider } from '@providers/compression/compression';
import { CompressionProviderMock } from '@providers/compression/__mocks__/compression.mock';
import { Store } from '@ngrx/store';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { JournalData, TestData, TestSlotAttributes } from '@dvsa/mes-test-schema/categories/common';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';

describe('ExaminerRecordsProvider', () => {
  let provider: ExaminerRecordsProvider;

  class StoreMock {
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExaminerRecordsProvider,
        {
          provide: SearchProvider,
          useClass: SearchProviderMock,
        },
        {
          provide: CompressionProvider,
          useClass: CompressionProviderMock,
        },
        { provide: Store, useClass: StoreMock },
      ],
    });

    provider = TestBed.inject(ExaminerRecordsProvider);
  });


  describe('getRangeDate', () => {
    it('should return the current date if the range is "today"', () => {
      expect(provider.getRangeDate('today').format('DD/MM/YYYY'))
        .toEqual(moment(new Date()).format('DD/MM/YYYY'));
    });
    it('should return the date last week if the range is "week"', () => {
      expect(provider.getRangeDate('week').format('DD/MM/YYYY'))
        .toEqual(moment(new Date()).subtract(1, 'week').format('DD/MM/YYYY'));
    });
    it('should return the date 2 weeks ago if the range is "fortnight"', () => {
      expect(provider.getRangeDate('fortnight').format('DD/MM/YYYY'))
        .toEqual(moment(new Date()).subtract(2, 'week').format('DD/MM/YYYY'));
    });
    it('should return the date 90 days ago if the range is "90 days"', () => {
      expect(provider.getRangeDate('90 days').format('DD/MM/YYYY'))
        .toEqual(moment(new Date()).subtract(90, 'days').format('DD/MM/YYYY'));
    });
    it('should return the date 1 year ago if the range is "1 year"', () => {
      expect(provider.getRangeDate('1 year').format('DD/MM/YYYY'))
        .toEqual(moment(new Date()).subtract(1, 'year').format('DD/MM/YYYY'));
    });
    it('should return the date 18 months ago if the range is "18 months"', () => {
      expect(provider.getRangeDate('18 months').format('DD/MM/YYYY'))
        .toEqual(moment(new Date()).subtract(18, 'months').format('DD/MM/YYYY'));
    });
  });

  describe('formatForExaminerRecords', () => {
    it('should an object containing the mandatory fields', () => {
      expect(provider.formatForExaminerRecords({
        journalData: {
          testSlotAttributes: {
            start: 'Text Date',
          } as TestSlotAttributes,
          applicationReference: {
            applicationId: 1,
            bookingSequence: 2,
            checkDigit: 3,
          },
          testCentre: {
            centreId: 1,
            costCode: 'EXPLE',
            centreName: 'Example',
          },
        } as JournalData,
        category: TestCategory.B,
      } as TestResultSchemasUnion)).toEqual({
        appRef: 1023,
        testCategory: TestCategory.B,
        testCentre: {
          centreId: 1,
          costCode: 'EXPLE',
          centreName: 'Example',
        },
        startDate: 'Text Date',
      });
    });
    it('should an object containing an optional field contained within the for loop', () => {
      expect(provider.formatForExaminerRecords({
        testData: { controlledStop: { selected: true } },
        journalData: {
          testSlotAttributes: {
            start: 'Text Date',
          } as TestSlotAttributes,
          applicationReference: {
            applicationId: 1,
            bookingSequence: 2,
            checkDigit: 3,
          },
          testCentre: {
            centreId: 1,
            costCode: 'EXPLE',
            centreName: 'Example',
          },
        } as JournalData,
        category: TestCategory.B,
      } as TestResultSchemasUnion)).toEqual({
        controlledStop: true,
        appRef: 1023,
        testCategory: TestCategory.B,
        testCentre: {
          centreId: 1,
          costCode: 'EXPLE',
          centreName: 'Example',
        },
        startDate: 'Text Date',
      });
    });
    it('should an object containing an optional route number', () => {
      expect(provider.formatForExaminerRecords({
        testSummary: { routeNumber: 1 },
        journalData: {
          testSlotAttributes: {
            start: 'Text Date',
          } as TestSlotAttributes,
          applicationReference: {
            applicationId: 1,
            bookingSequence: 2,
            checkDigit: 3,
          },
          testCentre: {
            centreId: 1,
            costCode: 'EXPLE',
            centreName: 'Example',
          },
        } as JournalData,
        category: TestCategory.B,
      } as TestResultSchemasUnion)).toEqual({
        routeNumber: 1,
        appRef: 1023,
        testCategory: TestCategory.B,
        testCentre: {
          centreId: 1,
          costCode: 'EXPLE',
          centreName: 'Example',
        },
        startDate: 'Text Date',
      });
    });
    it('should an object containing an optional show me question', () => {
      expect(provider.formatForExaminerRecords({
        testData: {
          vehicleChecks: {
            showMeQuestion: {
              code: 'code',
              description: 'description',
              outcome: 'P',
            },
          },
        } as TestData,
        journalData: {
          testSlotAttributes: {
            start: 'Text Date',
          } as TestSlotAttributes,
          applicationReference: {
            applicationId: 1,
            bookingSequence: 2,
            checkDigit: 3,
          },
          testCentre: {
            centreId: 1,
            costCode: 'EXPLE',
            centreName: 'Example',
          },
        } as JournalData,
        category: TestCategory.B,
      } as TestResultSchemasUnion)).toEqual({
        showMeQuestions: [{ code: 'code', description: 'description', outcome: 'P' }],
        appRef: 1023,
        testCategory: TestCategory.B,
        testCentre: {
          centreId: 1,
          costCode: 'EXPLE',
          centreName: 'Example',
        },
        startDate: 'Text Date',
      });
    });
    it('should an object containing an optional show me questions array', () => {
      expect(provider.formatForExaminerRecords({
        testData: {
          vehicleChecks: {
            showMeQuestions: [{
              code: 'code',
              description: 'description',
              outcome: 'P',
            }],
          },
        } as TestData,
        journalData: {
          testSlotAttributes: {
            start: 'Text Date',
          } as TestSlotAttributes,
          applicationReference: {
            applicationId: 1,
            bookingSequence: 2,
            checkDigit: 3,
          },
          testCentre: {
            centreId: 1,
            costCode: 'EXPLE',
            centreName: 'Example',
          },
        } as JournalData,
        category: TestCategory.B,
      } as TestResultSchemasUnion)).toEqual({
        showMeQuestions: [{ code: 'code', description: 'description', outcome: 'P' }],
        appRef: 1023,
        testCategory: TestCategory.B,
        testCentre: {
          centreId: 1,
          costCode: 'EXPLE',
          centreName: 'Example',
        },
        startDate: 'Text Date',
      });
    });
    it('should an object containing an optional tell me question', () => {
      expect(provider.formatForExaminerRecords({
        testData: {
          vehicleChecks: {
            tellMeQuestion: {
              code: 'code',
              description: 'description',
              outcome: 'P',
            },
          },
        } as TestData,
        journalData: {
          testSlotAttributes: {
            start: 'Text Date',
          } as TestSlotAttributes,
          applicationReference: {
            applicationId: 1,
            bookingSequence: 2,
            checkDigit: 3,
          },
          testCentre: {
            centreId: 1,
            costCode: 'EXPLE',
            centreName: 'Example',
          },
        } as JournalData,
        category: TestCategory.B,
      } as TestResultSchemasUnion)).toEqual({
        tellMeQuestions: [{ code: 'code', description: 'description', outcome: 'P' }],
        appRef: 1023,
        testCategory: TestCategory.B,
        testCentre: {
          centreId: 1,
          costCode: 'EXPLE',
          centreName: 'Example',
        },
        startDate: 'Text Date',
      });
    });
    it('should an object containing an optional tell me questions array', () => {
      expect(provider.formatForExaminerRecords({
        testData: {
          vehicleChecks: {
            tellMeQuestions: [{
              code: 'code',
              description: 'description',
              outcome: 'P',
            }],
          },
        } as TestData,
        journalData: {
          testSlotAttributes: {
            start: 'Text Date',
          } as TestSlotAttributes,
          applicationReference: {
            applicationId: 1,
            bookingSequence: 2,
            checkDigit: 3,
          },
          testCentre: {
            centreId: 1,
            costCode: 'EXPLE',
            centreName: 'Example',
          },
        } as JournalData,
        category: TestCategory.B,
      } as TestResultSchemasUnion)).toEqual({
        tellMeQuestions: [{ code: 'code', description: 'description', outcome: 'P' }],
        appRef: 1023,
        testCategory: TestCategory.B,
        testCentre: {
          centreId: 1,
          costCode: 'EXPLE',
          centreName: 'Example',
        },
        startDate: 'Text Date',
      });
    });
  });

  describe('handleLoadingUI', () => {
    it('should call handleUILoading if should load while not currently loading', () => {
      spyOn(provider.loadingProvider, 'handleUILoading').and.callThrough();
      provider.currentlyLoading = false;
      provider.handleLoadingUI(true);
      expect(provider.loadingProvider.handleUILoading)
        .toHaveBeenCalledWith(true, {
          id: 'examinerRecord_loading_spinner',
          spinner: 'circles',
          backdropDismiss: false,
          translucent: false,
          message: 'Loading...',
        });
    });
    it('should call handleUILoading if should not load while currently loading', () => {
      spyOn(provider.loadingProvider, 'handleUILoading').and.callThrough();
      provider.currentlyLoading = true;
      provider.handleLoadingUI(false);
      expect(provider.loadingProvider.handleUILoading)
        .toHaveBeenCalledWith(false, {
          id: 'examinerRecord_loading_spinner',
          spinner: 'circles',
          backdropDismiss: false,
          translucent: false,
          message: 'Loading...',
        });
    });
    it('should not call handleUILoading if should load while currently loading', () => {
      spyOn(provider.loadingProvider, 'handleUILoading').and.callThrough();
      provider.currentlyLoading = true;
      provider.handleLoadingUI(true);
      expect(provider.loadingProvider.handleUILoading)
        .not.toHaveBeenCalled();
    });
    it('should not call handleUILoading if should not load while not currently loading', () => {
      spyOn(provider.loadingProvider, 'handleUILoading').and.callThrough();
      provider.currentlyLoading = true;
      provider.handleLoadingUI(true);
      expect(provider.loadingProvider.handleUILoading)
        .not.toHaveBeenCalled();
    });
  });
});
