import { ExaminerConductedEffects } from '../examiner-conducted.effects';
import { SetExaminerConducted } from '../examiner-conducted.actions';
import { ReplaySubject } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { testsReducer } from '../../tests.reducer';
import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '../../../../shared/models/store.model';
import { SetChangeMarker } from '../../change-marker/change-marker.actions';
import { StartTest } from '../../tests.actions';
import { SetExaminerBooked } from '../../examiner-booked/examiner-booked.actions';
import { journalReducer } from '../../../journal/journal.reducer';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { configureTestSuite } from 'ng-bullet';

describe('Examiner Conducted Effects', () => {

  let effects: ExaminerConductedEffects;
  let actions$: any;
  let store$: Store<StoreModel>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
          journal: journalReducer,
        }),
      ],
      providers: [
        ExaminerConductedEffects,
        provideMockActions(() => actions$),
        Store,
      ],
    });
  });

  beforeEach(() => {
    actions$ = new ReplaySubject(1);
    effects = TestBed.get(ExaminerConductedEffects);
    store$ = TestBed.get(Store);
  });

  describe('setExaminerConductedEffect', () => {
    it('should set the change marker to true when the examiner conducted is different to the booked', (done) => {
      // ARRANGE
      store$.dispatch(new StartTest(12345, TestCategory.B));
      store$.dispatch(new SetExaminerBooked(123456));
      // ACT
      actions$.next(new SetExaminerConducted(100001));
      // ASSERT
      effects.setExaminerConductedEffect$.subscribe((result) => {
        expect(result).toEqual(new SetChangeMarker(true));
        done();
      });
    });
    it('should set the change marker to false when the examiner conducted is the same as the booked', (done) => {
      // ARRANGE
      store$.dispatch(new StartTest(12345, TestCategory.B));
      store$.dispatch(new SetExaminerBooked(123456));
      // ACT
      actions$.next(new SetExaminerConducted(123456));
      // ASSERT
      effects.setExaminerConductedEffect$.subscribe((result) => {
        expect(result).toEqual(new SetChangeMarker(false));
        done();
      });
    });
  });

});
