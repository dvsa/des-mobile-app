import { waitForAsync, TestBed } from '@angular/core/testing';
import {
  ReplaySubject, of,
} from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule, Store } from '@ngrx/store';
import * as etaActions from '@store/tests/test-data/common/eta/eta.actions';
import * as testsActions from '@store/tests/tests.actions';
import * as activityCodeActions from '@store/tests/activity-code/activity-code.actions';
import { StoreModel } from '@shared/models/store.model';
import { testsReducer } from '@store/tests/tests.reducer';
import { TestResultProvider } from '@providers/test-result/test-result';
import { ActivityCodes } from '@shared/models/activity-codes';
import { ExaminerActions } from '@store/tests/test-data/test-data.constants';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import * as testReportActions from '../test-report.actions';
import { TestReportEffects } from '../test-report.effects';

describe('TestReportEffects', () => {
  let effects: TestReportEffects;
  let actions$: ReplaySubject<any>;
  let testResultProvider: TestResultProvider;
  let store$: Store<StoreModel>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        TestReportEffects,
        provideMockActions(() => actions$),
        TestResultProvider,
        FaultCountProvider,
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    testResultProvider = TestBed.inject(TestResultProvider);
    effects = TestBed.inject(TestReportEffects);
    store$ = TestBed.inject(Store);
  }));

  describe('calculateTestResult', () => {

    beforeEach(() => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(PopulateTestCategory(TestCategory.B));
    });

    it('should dispatch an action containing the correct result for a test', (done) => {
      // ARRANGE
      spyOn(testResultProvider, 'calculateTestResult').and.returnValue(of(ActivityCodes.PASS));
      // ACT
      actions$.next(testReportActions.CalculateTestResult());
      // ASSERT
      effects.calculateTestResult$.subscribe((result) => {
        expect(testResultProvider.calculateTestResult).toHaveBeenCalled();
        expect(result).toEqual(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
        done();
      });
    });
  });

  describe('persistTestReport', () => {

    beforeEach(() => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
    });

    it('should dispatch an action requesting the test data to be saved when triggered', (done) => {
      // ACT
      actions$.next(etaActions.ToggleETA(ExaminerActions.physical));
      // ASSERT
      effects.persistTestReport$.subscribe((result) => {
        expect(result).toEqual(testsActions.PersistTests());
        done();
      });
    });

  });

  describe('terminateTestReport', () => {
    beforeEach(() => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
    });

    it('should dispatch an action terminating the test', (done) => {
      // ACT
      actions$.next(testReportActions.TerminateTestFromTestReport());
      // ASSERT
      effects.terminateTestFromTestReport$.subscribe((result) => {
        expect(result).toEqual(activityCodeActions.SetActivityCode(null));
        done();
      });
    });
  });
});
