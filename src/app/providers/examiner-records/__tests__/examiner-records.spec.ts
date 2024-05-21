import { ExaminerRecordsProvider } from '../examiner-records';
import { TestBed } from '@angular/core/testing';
import moment from 'moment';
import { SearchProvider } from '@providers/search/search';
import { SearchProviderMock } from '@providers/search/__mocks__/search.mock';
import { CompressionProvider } from '@providers/compression/compression';
import { CompressionProviderMock } from '@providers/compression/__mocks__/compression.mock';
import { Store } from '@ngrx/store';

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
    it('should return the date 90 days ago if the range is "90 days"', () => {
      expect(provider.getRangeDate('90 days').format('DD/MM/YYYY'))
        .toEqual(moment(new Date()).subtract(90, 'days').format('DD/MM/YYYY'));
    });
    it('should return the date 1 year ago if the range is "1 year"', () => {
      expect(provider.getRangeDate('1 year').format('DD/MM/YYYY'))
        .toEqual(moment(new Date()).subtract(1, 'year').format('DD/MM/YYYY'));
    });
    it('should return the date 2 years ago if the range is "1 years"', () => {
      expect(provider.getRangeDate('2 years').format('DD/MM/YYYY'))
        .toEqual(moment(new Date()).subtract(2, 'years').format('DD/MM/YYYY'));
    });
  });
  describe('getRangeDate', () => {
    it('should return the current date if the range is "today"', () => {
      expect(provider.getRangeDate('today').format('DD/MM/YYYY'))
        .toEqual(moment(new Date()).format('DD/MM/YYYY'));
    });
  });
});
