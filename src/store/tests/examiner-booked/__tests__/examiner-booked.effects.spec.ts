import { TestBed } from '@angular/core/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { SetChangeMarker } from '../../change-marker/change-marker.actions';
import { SetExaminerConducted } from '../../examiner-conducted/examiner-conducted.actions';
import { StartTest } from '../../tests.actions';
import { testsReducer } from '../../tests.reducer';
import { SetExaminerBooked } from '../examiner-booked.actions';
import { ExaminerBookedEffects } from '../examiner-booked.effects';

describe('ExaminerBookedEffects', () => {
  let effects: ExaminerBookedEffects;
  let actions$: ReplaySubject<Action>;
  let store$: Store<StoreModel>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [ExaminerBookedEffects, provideMockActions(() => actions$), Store],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(ExaminerBookedEffects);
    store$ = TestBed.inject(Store);
  });

  describe('setExaminerBookedEffect', () => {
    it('should set the change marker to true when the examiner booked is different to the conducted', async () => {
      store$.dispatch(StartTest(12345, TestCategory.B));
      store$.dispatch(SetExaminerConducted(123456));
      actions$.next(SetExaminerBooked(100001));
      const result = await firstValueFrom(effects.setExaminerBookedEffect$);
      expect(result).toEqual(SetChangeMarker(true));
    });
    it('should set the change marker to false when the examiner booked is the same as the conducted', async () => {
      store$.dispatch(StartTest(12345, TestCategory.B));
      store$.dispatch(SetExaminerConducted(123456));
      actions$.next(SetExaminerBooked(123456));
      const result = await firstValueFrom(effects.setExaminerBookedEffect$);
      expect(result).toEqual(SetChangeMarker(false));
    });
  });
});
