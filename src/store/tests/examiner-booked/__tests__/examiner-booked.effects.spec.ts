import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ReplaySubject } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';

import { testsReducer } from '../../tests.reducer';
import { ExaminerBookedEffects } from '../examiner-booked.effects';
import { SetExaminerBooked } from '../examiner-booked.actions';
import { SetChangeMarker } from '../../change-marker/change-marker.actions';
import { StartTest } from '../../tests.actions';
import { SetExaminerConducted } from '../../examiner-conducted/examiner-conducted.actions';

describe('ExaminerBookedEffects', () => {
  let effects: ExaminerBookedEffects;
  let actions$: ReplaySubject<any>;
  let store$: Store<StoreModel>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        ExaminerBookedEffects,
        provideMockActions(() => actions$),
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(ExaminerBookedEffects);
    store$ = TestBed.inject(Store);
  });

  describe('setExaminerBookedEffect', () => {
    it('should set the change marker to true when the examiner booked is different to the conducted', (done) => {
      // ARRANGE
      store$.dispatch(StartTest(12345, TestCategory.B));
      store$.dispatch(SetExaminerConducted(123456));
      // ACT
      actions$.next(SetExaminerBooked(100001));
      // ASSERT
      effects.setExaminerBookedEffect$.subscribe((result) => {
        expect(result).toEqual(SetChangeMarker(true));
        done();
      });
    });
    it('should set the change marker to false when the examiner booked is the same as the conducted', (done) => {
      // ARRANGE
      store$.dispatch(StartTest(12345, TestCategory.B));
      store$.dispatch(SetExaminerConducted(123456));
      // ACT
      actions$.next(SetExaminerBooked(123456));
      // ASSERT
      effects.setExaminerBookedEffect$.subscribe((result) => {
        expect(result).toEqual(SetChangeMarker(false));
        done();
      });
    });
  });

});
