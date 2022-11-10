import { ReplaySubject } from 'rxjs';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import * as testStatusActions from '@store/tests/test-status/test-status.actions';
import * as testsActions from '@store/tests/tests.actions';
import * as activityCodeActions from '@store/tests/activity-code/activity-code.actions';
import { ActivityCodes } from '@shared/models/activity-codes';
import { StoreModel } from '@shared/models/store.model';
import { testsReducer } from '@store/tests/tests.reducer';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import * as debriefActions from '../debrief.actions';
import { DebriefEffects } from '../debrief.effects';

describe('DebriefEffects', () => {
  let effects: DebriefEffects;
  let actions$: ReplaySubject<any>;
  let store$: Store<StoreModel>;
  const currentSlotId = '1234';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        DebriefEffects,
        provideMockActions(() => actions$),
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(DebriefEffects);
    store$ = TestBed.inject(Store);
  }));

  describe('endDebriefEffect', () => {
    it('should return SET_TEST_STATUS_DECIDED & PERSIST_TESTS actions when passed test', (done) => {
      // Set activity code as passed
      store$.dispatch(testsActions.StartTest(1234, TestCategory.B));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));

      actions$.next(debriefActions.EndDebrief());

      effects.endDebriefEffect$.subscribe((result) => {
        if (result.type === testStatusActions.SetTestStatusDecided.type) {
          expect(result).toEqual(testStatusActions.SetTestStatusDecided(currentSlotId));
        }
        if (result.type === testsActions.PersistTests.type) {
          expect(result).toEqual(testsActions.PersistTests());
        }
        done();
      });
    });

    it('should return SET_TEST_STATUS_DECIDED & PERSIST_TESTS actions when failed test', (done) => {
      // Set activity code as failed
      store$.dispatch(testsActions.StartTest(1234, TestCategory.B));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.FAIL));

      actions$.next(debriefActions.EndDebrief());

      effects.endDebriefEffect$.subscribe((result) => {
        if (result.type === testStatusActions.SetTestStatusDecided.type) {
          expect(result).toEqual(testStatusActions.SetTestStatusDecided(currentSlotId));
        }
        if (result.type === testsActions.PersistTests.type) {
          expect(result).toEqual(testsActions.PersistTests());
        }
        done();
      });
    });

  });

});
