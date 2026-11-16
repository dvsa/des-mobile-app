import { TestBed } from '@angular/core/testing';
import { provideBasePageMocks } from '@mocks/test-providers';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import {
  CacheExaminerRecords,
  ColourFilterChanged,
  UpdateLastCached,
} from '@pages/examiner-records/examiner-records.actions';
import { ExaminerRecordsEffects } from '@pages/examiner-records/examiner-records.effects';
import { DataStoreProviderMock } from '@providers/data-store/__mocks__/data-store.mock';
import { DataStoreProvider } from '@providers/data-store/data-store';
import { ColourEnum } from '@providers/examiner-records/examiner-records';
import { SearchProviderMock } from '@providers/search/__mocks__/search.mock';
import { SearchProvider } from '@providers/search/search';
import { StoreModel } from '@shared/models/store.model';
import {
  LoadExaminerRecordsFailure,
  LoadExaminerRecordsPreferences,
} from '@store/examiner-records/examiner-records.actions';
import { ReplaySubject, firstValueFrom, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('ExaminerRecordsStoreEffects', () => {
  let actions$: ReplaySubject<Action>;
  let effects: ExaminerRecordsEffects;
  let store$: Store<StoreModel>;
  let dataStore: DataStoreProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [
        provideBasePageMocks(),
        { provide: SearchProvider, useClass: SearchProviderMock },
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
    it('should persist examiner records preferences on ColourFilterChanged action', async () => {
      await new Promise<void>((done, reject) => {
        const action = ColourFilterChanged(ColourEnum.GREYSCALE);
        const examinerRecordsPreferences = { colourScheme: ColourEnum.GREYSCALE };
        vi.spyOn(store$, 'select').mockReturnValue(of(examinerRecordsPreferences));
        actions$.next(action);

        effects.persistExaminerRecordsPreferences$.subscribe(() => {
          try {
            expect(dataStore.setItem).toHaveBeenCalledWith(
              ExaminerRecordsEffects.EXAMINER_RECORDS_KEY,
              JSON.stringify(examinerRecordsPreferences)
            );
            done();
          } catch (error) {
            reject(error);
          }
        }, reject);
      });
    });

    it('should persist examiner records preferences on CacheExaminerRecords action', async () => {
      await new Promise<void>((done, reject) => {
        const action = CacheExaminerRecords([]);
        const examinerRecordsPreferences = { cachedRecords: [] };
        vi.spyOn(store$, 'select').mockReturnValue(of(examinerRecordsPreferences));
        actions$.next(action);

        effects.persistExaminerRecordsPreferences$.subscribe(() => {
          try {
            expect(dataStore.setItem).toHaveBeenCalledWith(
              ExaminerRecordsEffects.EXAMINER_RECORDS_KEY,
              JSON.stringify(examinerRecordsPreferences)
            );
            done();
          } catch (error) {
            reject(error);
          }
        }, reject);
      });
    });

    it('should persist examiner records preferences on UpdateLastCached action', async () => {
      await new Promise<void>((done, reject) => {
        const action = UpdateLastCached('2023-10-01T00:00:00Z');
        const examinerRecordsPreferences = { lastUpdatedTime: '2023-10-01T00:00:00Z' };
        vi.spyOn(store$, 'select').mockReturnValue(of(examinerRecordsPreferences));
        actions$.next(action);

        effects.persistExaminerRecordsPreferences$.subscribe(() => {
          try {
            expect(dataStore.setItem).toHaveBeenCalledWith(
              ExaminerRecordsEffects.EXAMINER_RECORDS_KEY,
              JSON.stringify(examinerRecordsPreferences)
            );
            done();
          } catch (error) {
            reject(error);
          }
        }, reject);
      });
    });
  });

  describe('loadExaminerRecordsPreferences$', () => {
    it('should dispatch LoadExaminerRecordsFailure when no preferences are found', async () => {
      const action = LoadExaminerRecordsPreferences();
      vi.spyOn(dataStore, 'getItem').mockReturnValue(Promise.resolve(null));
      actions$.next(action);
      const result = await firstValueFrom(effects.loadExaminerRecordsPreferences$);
      expect(result).toEqual(LoadExaminerRecordsFailure('Examiner stats preferences not found'));
    });

    it('should dispatch appropriate actions when preferences are found', () => {
      const action = LoadExaminerRecordsPreferences();
      const examinerRecords = JSON.stringify({
        colourScheme: ColourEnum.GREYSCALE,
        cachedRecords: [],
        lastUpdatedTime: '2023-10-01T00:00:00Z',
      });
      // actions$ = of(action);
      vi.spyOn(dataStore, 'getItem').mockReturnValue(Promise.resolve(examinerRecords));
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
