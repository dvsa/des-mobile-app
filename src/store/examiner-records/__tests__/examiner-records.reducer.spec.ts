import { ExaminerRecordModel } from '@dvsa/mes-microservice-common/domain/examiner-records';
import {
  CacheExaminerRecords,
  ColourFilterChanged,
  LoadingExaminerRecords,
  UpdateLastCached,
} from '@pages/examiner-records/examiner-records.actions';
import { ColourEnum } from '@providers/examiner-records/examiner-records';
import { ExaminerRecordStateModel } from '@store/examiner-records/examiner-records.model';
import { examinerRecordsReducer } from '@store/examiner-records/examiner-records.reducer';

describe('ExaminerRecordsReducer', () => {
  let initialState: ExaminerRecordStateModel = {
    cachedRecords: null,
    colourScheme: ColourEnum.DEFAULT,
    isLoading: false,
    lastUpdatedTime: null,
  };
  beforeEach(() => {
    initialState = {
      cachedRecords: null,
      colourScheme: ColourEnum.DEFAULT,
      isLoading: false,
      lastUpdatedTime: null,
    };
  });

  describe('examinerRecordsReducer', () => {
    it('should update lastUpdatedTime on UpdateLastCached action', () => {
      const action = UpdateLastCached('2023-10-01T00:00:00Z');
      const state = examinerRecordsReducer(initialState, action);
      expect(state.lastUpdatedTime).toEqual('2023-10-01T00:00:00Z');
    });

    it('should cache examiner records and set isLoading to false on CacheExaminerRecords action', () => {
      const action = CacheExaminerRecords([{ startDate: '2023-10-01' } as ExaminerRecordModel]);
      const state = examinerRecordsReducer(initialState, action);
      expect(state.cachedRecords).toEqual([{ startDate: '2023-10-01' } as ExaminerRecordModel]);
      expect(state.isLoading).toBe(false);
    });

    it('should set isLoading to true on LoadingExaminerRecords action', () => {
      const action = LoadingExaminerRecords();
      const state = examinerRecordsReducer(initialState, action);
      expect(state.isLoading).toBe(true);
    });

    it('should update colourScheme on ColourFilterChanged action', () => {
      const action = ColourFilterChanged(ColourEnum.GREYSCALE);
      const state = examinerRecordsReducer(initialState, action);
      expect(state.colourScheme).toEqual(ColourEnum.GREYSCALE);
    });
  });
});
