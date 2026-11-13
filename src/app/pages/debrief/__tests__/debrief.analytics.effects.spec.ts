import { TestBed } from '@angular/core/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { AnalyticsScreenNames, GoogleAnalyticsEventPrefix } from '@providers/analytics/analytics.model';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import { ActivityCodes } from '@shared/models/activity-codes';
import { StoreModel } from '@shared/models/store.model';
import * as activityCodeActions from '@store/tests/activity-code/activity-code.actions';
import * as testsActions from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import * as fakeJournalActions from '../../fake-journal/fake-journal.actions';
import * as debriefActions from '../debrief.actions';
import { DebriefAnalyticsEffects } from '../debrief.analytics.effects';

describe('DebriefAnalyticsEffects', () => {
  let effects: DebriefAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<Action>;
  let store$: Store<StoreModel>;
  const screenNamePass = AnalyticsScreenNames.PASS_DEBRIEF;
  const screenNameFail = AnalyticsScreenNames.FAIL_DEBRIEF;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        DebriefAnalyticsEffects,
        {
          provide: AnalyticsProvider,
          useClass: AnalyticsProviderMock,
        },
        provideMockActions(() => actions$),
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(DebriefAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    store$ = TestBed.inject(Store);
  });

  describe('debriefViewDidEnter', () => {
    it('should call setCurrentPage with pass page', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      actions$.next(debriefActions.DebriefViewDidEnter());
      const result = await firstValueFrom(effects.debriefViewDidEnter$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenNamePass);
    });
    it('should call setCurrentPage with fail page', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.FAIL));
      actions$.next(debriefActions.DebriefViewDidEnter());
      const result = await firstValueFrom(effects.debriefViewDidEnter$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenNameFail);
    });
    it('should call setCurrentPage with pass and practice mode prefix', async () => {
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      actions$.next(debriefActions.DebriefViewDidEnter());
      const result = await firstValueFrom(effects.debriefViewDidEnter$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${screenNamePass}`
      );
    });
    it('should call setCurrentPage with fail and practice mode prefix', async () => {
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.FAIL));
      actions$.next(debriefActions.DebriefViewDidEnter());
      const result = await firstValueFrom(effects.debriefViewDidEnter$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${screenNameFail}`
      );
    });
  });
});
