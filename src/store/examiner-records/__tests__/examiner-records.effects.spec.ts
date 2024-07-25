import { TestBed } from '@angular/core/testing';
import { of, ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { DataStoreProvider } from '@providers/data-store/data-store';
import { DataStoreProviderMock } from '@providers/data-store/__mocks__/data-store.mock';
import { ExaminerRecordsEffects } from '@store/examiner-records/examiner-records.effects';
import { StoreModel } from '@shared/models/store.model';
import {
  CacheExaminerRecords,
  ColourFilterChanged,
  UpdateLastCached,
} from '@pages/examiner-records/examiner-records.actions';
import { ColourEnum } from '@providers/examiner-records/examiner-records';
import {
  LoadExaminerRecordsFailure,
  LoadExaminerRecordsPreferences,
} from '@store/examiner-records/examiner-records.actions';

fdescribe('ExaminerRecordsStoreEffects', () => {
  let actions$: ReplaySubject<any>;
  let effects: ExaminerRecordsEffects;
  let store$: Store<StoreModel>;
  let dataStore: DataStoreProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
      ],
      providers: [
        ExaminerRecordsEffects,
        provideMockActions(() => actions$),
        { provide: DataStoreProvider, useClass: DataStoreProviderMock },
        Store,
      ],
    });

    // ARRANGE
    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(ExaminerRecordsEffects);
    store$ = TestBed.inject(Store);
    dataStore = TestBed.inject(DataStoreProvider);
  });

  describe('persistExaminerRecordsPreferences$', () => {
    it('should persist examiner records preferences on ColourFilterChanged action', (done) => {
      const action = ColourFilterChanged(ColourEnum.GREYSCALE);
      const examinerRecordsPreferences = { colourScheme: ColourEnum.GREYSCALE };
      spyOn(store$, 'select').and.returnValue(of(examinerRecordsPreferences));
      actions$.next(action)

      effects.persistExaminerRecordsPreferences$.subscribe(() => {
        expect(dataStore.setItem).toHaveBeenCalledWith(
          ExaminerRecordsEffects['EXAMINER_RECORDS_KEY'],
          JSON.stringify(examinerRecordsPreferences)
        );
        done();
      });
    });

    it('should persist examiner records preferences on CacheExaminerRecords action', (done) => {
      const action = CacheExaminerRecords([]);
      const examinerRecordsPreferences = { cachedRecords: [] };
      spyOn(store$, 'select').and.returnValue(of(examinerRecordsPreferences));
      actions$.next(action)

      effects.persistExaminerRecordsPreferences$.subscribe(() => {
        expect(dataStore.setItem).toHaveBeenCalledWith(
          ExaminerRecordsEffects['EXAMINER_RECORDS_KEY'],
          JSON.stringify(examinerRecordsPreferences)
        );
        done();
      });
    });

    it('should persist examiner records preferences on UpdateLastCached action', (done) => {
      const action = UpdateLastCached('2023-10-01T00:00:00Z');
      const examinerRecordsPreferences = { lastUpdatedTime: '2023-10-01T00:00:00Z' };
      spyOn(store$, 'select').and.returnValue(of(examinerRecordsPreferences));
      actions$.next(action)

      effects.persistExaminerRecordsPreferences$.subscribe(() => {
        expect(dataStore.setItem).toHaveBeenCalledWith(
          ExaminerRecordsEffects['EXAMINER_RECORDS_KEY'],
          JSON.stringify(examinerRecordsPreferences)
        );
        done();
      });
    });
  });

  describe('loadExaminerRecordsPreferences$', () => {
    it('should dispatch LoadExaminerRecordsFailure when no preferences are found', (done) => {
      const action = LoadExaminerRecordsPreferences();
      spyOn(dataStore, 'getItem').and.returnValue(Promise.resolve(null));
      actions$.next(action);

      effects.loadExaminerRecordsPreferences$.subscribe((result) => {
        expect(result).toEqual(LoadExaminerRecordsFailure('Examiner stats preferences not found'));
        done();
      });
    });

    it('should dispatch appropriate actions when preferences are found', () => {
      const action = LoadExaminerRecordsPreferences();
      const examinerRecords = JSON.stringify({
        colourScheme: ColourEnum.GREYSCALE,
        cachedRecords: [],
        lastUpdatedTime: '2023-10-01T00:00:00Z',
      });
      // actions$ = of(action);
      spyOn(dataStore, 'getItem').and.returnValue(Promise.resolve(examinerRecords));
      actions$.next(action);

      effects.loadExaminerRecordsPreferences$.subscribe((result) => {
        if (result.type === ColourFilterChanged.type) {
          expect(result).toEqual(ColourFilterChanged(ColourEnum.GREYSCALE));
        }
        if (result.type === UpdateLastCached.type) {
          expect(result).toEqual(UpdateLastCached('2023-10-01T00:00:00Z'));
        }
      });
    });
  });
});
