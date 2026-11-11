import { TestBed } from '@angular/core/testing';
import { Application } from '@dvsa/mes-journal-schema';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsCustomDimension,
  GoogleAnalyticsEventPrefix,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import { ActivityCodes } from '@shared/models/activity-codes';
import { StoreModel } from '@shared/models/store.model';
import * as activityCodeActions from '@store//tests/activity-code/activity-code.actions';
import { testsReducer } from '@store//tests/tests.reducer';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import * as applicationReferenceActions from '@store/tests/journal-data/common/application-reference/application-reference.actions';
import { PopulateCandidateDetails } from '@store/tests/journal-data/common/candidate/candidate.actions';
import { SetStartDate } from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.actions';
import * as testsActions from '@store/tests/tests.actions';
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import * as fakeJournalActions from '../../fake-journal/fake-journal.actions';
import * as backToOfficeActions from '../back-to-office.actions';
import { BackToOfficeAnalyticsEffects } from '../back-to-office.analytics.effects';

describe('BackToOfficeAnalyticsEffects', () => {
  let effects: BackToOfficeAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<Action>;
  let store$: Store<StoreModel>;
  const screenName = AnalyticsScreenNames.BACK_TO_OFFICE;
  const mockApplication: Application = {
    applicationId: 123456,
    bookingSequence: 78,
    checkDigit: 9,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        BackToOfficeAnalyticsEffects,
        {
          provide: AnalyticsProvider,
          useClass: AnalyticsProviderMock,
        },
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
        provideMockActions(() => actions$),
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(BackToOfficeAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    store$ = TestBed.inject(Store);
  });

  describe('backToOfficeViewDidEnter', () => {
    it('should call setCurrentPage', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(backToOfficeActions.BackToOfficeViewDidEnter());
      const result = await firstValueFrom(effects.backToOfficeViewDidEnter$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenName);
    });
    it('should call setCurrentPage with practice mode prefix', async () => {
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(backToOfficeActions.BackToOfficeViewDidEnter());
      const result = await firstValueFrom(effects.backToOfficeViewDidEnter$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${screenName}`
      );
    });
  });

  describe('deferWriteUpEffect', () => {
    it('should call logEvent with pass page and addCustomDimension', async () => {
      const startDate = '2026-10-15T09:30:00.000Z';
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      store$.dispatch(SetStartDate(startDate));
      actions$.next(backToOfficeActions.DeferWriteUp());
      const result = await firstValueFrom(effects.deferWriteUpEffect$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.CANDIDATE_ID,
        '1'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
        '123456789'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.TEST_SLOT_DATETIME,
        startDate
      );
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.DEFER_WRITE_UP,
        GoogleAnalyticsEventsTitles.RESULT,
        GoogleAnalyticsEventsValues.PASS
      );
    });
    it('should call logEvent with fail page and addCustomDimension', async () => {
      const startDate = '2026-10-15T09:30:00.000Z';
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.FAIL));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      store$.dispatch(SetStartDate(startDate));
      actions$.next(backToOfficeActions.DeferWriteUp());
      const result = await firstValueFrom(effects.deferWriteUpEffect$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.CANDIDATE_ID,
        '1'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
        '123456789'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.TEST_SLOT_DATETIME,
        startDate
      );
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.DEFER_WRITE_UP,
        GoogleAnalyticsEventsTitles.RESULT,
        GoogleAnalyticsEventsValues.FAIL
      );
    });
    it('should call logEvent with pass page, practice mode prefix and addCustomDimension', async () => {
      const startDate = '2026-10-15T09:30:00.000Z';
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      store$.dispatch(SetStartDate(startDate));
      actions$.next(backToOfficeActions.DeferWriteUp());
      const result = await firstValueFrom(effects.deferWriteUpEffect$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.CANDIDATE_ID,
        '1'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
        '123456789'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.TEST_SLOT_DATETIME,
        startDate
      );
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.DEFER_WRITE_UP}`,
        GoogleAnalyticsEventsTitles.RESULT,
        GoogleAnalyticsEventsValues.PASS
      );
    });

    it('should call logEvent with fail page, practice mode prefix and addCustomDimension', async () => {
      const startDate = '2026-10-15T09:30:00.000Z';
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.FAIL));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      store$.dispatch(SetStartDate(startDate));
      actions$.next(backToOfficeActions.DeferWriteUp());
      const result = await firstValueFrom(effects.deferWriteUpEffect$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.CANDIDATE_ID,
        '1'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
        '123456789'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.TEST_SLOT_DATETIME,
        startDate
      );
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.DEFER_WRITE_UP}`,
        GoogleAnalyticsEventsTitles.RESULT,
        GoogleAnalyticsEventsValues.FAIL
      );
    });
  });
});
