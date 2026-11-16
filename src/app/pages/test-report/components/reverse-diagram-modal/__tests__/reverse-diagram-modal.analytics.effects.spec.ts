import { TestBed } from '@angular/core/testing';
import { Application } from '@dvsa/mes-journal-schema';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import * as fakeJournalActions from '@pages/fake-journal/fake-journal.actions';
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
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import { StoreModel } from '@shared/models/store.model';
import { candidateMock, testReportPracticeModeSlot } from '@store/tests/__mocks__/tests.mock';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import * as applicationReferenceActions from '@store/tests/journal-data/common/application-reference/application-reference.actions';
import { PopulateCandidateDetails } from '@store/tests/journal-data/common/candidate/candidate.actions';
import * as testsActions from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import * as reverseDiagramModalActions from '../reverse-diagram-modal.actions';
import { ReverseDiagramModalAnalyticsEffects } from '../reverse-diagram-modal.analytics.effects';

describe('ReverseDiagramModalAnalyticsEffects', () => {
  let effects: ReverseDiagramModalAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<Action>;
  let store$: Store<StoreModel>;
  const screenName = AnalyticsScreenNames.REVERSE_DIAGRAM;
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
        ReverseDiagramModalAnalyticsEffects,
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        provideMockActions(() => actions$),
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(ReverseDiagramModalAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    store$ = TestBed.inject(Store);
  });

  describe('reverseDiagramViewDidEnter', () => {
    it('should call setCurrentPage and addCustomDimension', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.BE));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      store$.dispatch(PopulateTestCategory(TestCategory.BE));
      actions$.next(reverseDiagramModalActions.ReverseDiagramViewDidEnter());
      const result = await firstValueFrom(effects.reverseDiagramViewDidEnter$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.TEST_CATEGORY,
        'B+E'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.CANDIDATE_ID,
        '1'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
        '123456789'
      );
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenName);
    });
    it('should call setCurrentPage with practice mode prefix and addCustomDimension', async () => {
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      store$.dispatch(PopulateTestCategory(TestCategory.BE));
      actions$.next(reverseDiagramModalActions.ReverseDiagramViewDidEnter());
      const result = await firstValueFrom(effects.reverseDiagramViewDidEnter$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.TEST_CATEGORY,
        'B+E'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.CANDIDATE_ID,
        '1'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
        '123456789'
      );
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${screenName}`
      );
    });
  });

  describe('reverseDiagramOpened', () => {
    it('should call logEvent with the correct parameters', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(reverseDiagramModalActions.ReverseDiagramOpened());
      const result = await firstValueFrom(effects.reverseDiagramOpened$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.NAVIGATION,
        GoogleAnalyticsEventsTitles.OPENED,
        GoogleAnalyticsEventsValues.REVERSE_DIAGRAM
      );
    });
  });

  describe('reverseDiagramClosed', () => {
    it('should call logEvent with the correct parameters', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(reverseDiagramModalActions.ReverseDiagramClosed());
      const result = await firstValueFrom(effects.reverseDiagramClosed$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.NAVIGATION,
        GoogleAnalyticsEventsTitles.CLOSED,
        GoogleAnalyticsEventsValues.REVERSE_DIAGRAM
      );
    });
  });

  describe('reverseDiagramLengthChanged', () => {
    it('should call logEvent with the correct parameters', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(reverseDiagramModalActions.ReverseDiagramLengthChanged(100, 10));
      const result = await firstValueFrom(effects.reverseDiagramLengthChanged$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.VEHICLE_LENGTH,
        GoogleAnalyticsEventsTitles.CHANGED_FROM,
        '100',
        GoogleAnalyticsEventsTitles.CHANGED_TO,
        '10'
      );
    });
  });

  describe('reverseDiagramWidthChanged', () => {
    it('should call logEvent with the correct parameters', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(reverseDiagramModalActions.ReverseDiagramWidthChanged(100, 10));
      const result = await firstValueFrom(effects.reverseDiagramWidthChanged$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.VEHICLE_WIDTH,
        GoogleAnalyticsEventsTitles.CHANGED_FROM,
        '100',
        GoogleAnalyticsEventsTitles.CHANGED_TO,
        '10'
      );
    });
  });
});
