import { TestBed, waitForAsync } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { StoreModule, Store } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import {
  AnalyticsScreenNames,
  AnalyticsEventCategories,
} from '@providers/analytics/analytics.model';
import { StoreModel } from '@shared/models/store.model';
import { testsReducer } from '@store/tests/tests.reducer';
import * as testsActions from '@store/tests/tests.actions';
import * as activityCodeActions from '@store/tests/activity-code/activity-code.actions';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import { ActivityCodes } from '@shared/models/activity-codes';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { DebriefAnalyticsEffects } from '../debrief.analytics.effects';
import * as debriefActions from '../debrief.actions';
import * as fakeJournalActions from '../../fake-journal/fake-journal.actions';

describe('DebriefAnalyticsEffects', () => {
  let effects: DebriefAnalyticsEffects;
  let analyticsProviderMock;
  let actions$: ReplaySubject<any>;
  let store$: Store<StoreModel>;
  const screenNamePass = AnalyticsScreenNames.PASS_DEBRIEF;
  const screenNameFail = AnalyticsScreenNames.FAIL_DEBRIEF;
  const screenNamePracticeModePass = `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsScreenNames.PASS_DEBRIEF}`;
  const screenNamePracticeModeFail = `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsScreenNames.FAIL_DEBRIEF}`;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        DebriefAnalyticsEffects,
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        provideMockActions(() => actions$),
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(DebriefAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    store$ = TestBed.inject(Store);
  }));

  describe('debriefViewDidEnter', () => {
    it('should call setCurrentPage with pass page', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      // ACT
      actions$.next(debriefActions.DebriefViewDidEnter());
      // ASSERT
      effects.debriefViewDidEnter$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenNamePass);
        done();
      });
    });
    it('should call setCurrentPage with fail page', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.FAIL));
      // ACT
      actions$.next(debriefActions.DebriefViewDidEnter());
      // ASSERT
      effects.debriefViewDidEnter$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenNameFail);
        done();
      });
    });
    it('should call setCurrentPage with pass and practice mode prefix', (done) => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      // ACT
      actions$.next(debriefActions.DebriefViewDidEnter());
      // ASSERT
      effects.debriefViewDidEnter$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenNamePracticeModePass);
        done();
      });
    });
    it('should call setCurrentPage with fail and practice mode prefix', (done) => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.FAIL));
      // ACT
      actions$.next(debriefActions.DebriefViewDidEnter());
      // ASSERT
      effects.debriefViewDidEnter$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenNamePracticeModeFail);
        done();
      });
    });

  });

});
