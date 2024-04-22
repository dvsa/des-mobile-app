import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { StoreModule, Store } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { Application } from '@dvsa/mes-journal-schema';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import {
  AnalyticsDimensionIndices,
  AnalyticsScreenNames,
  AnalyticsEventCategories,
  AnalyticsEvents,
  GoogleAnalyticsEventPrefix,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues, GoogleAnalyticsCustomDimension,
} from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { StoreModel } from '@shared/models/store.model';
import * as testsActions from '@store/tests/tests.actions';
import * as fakeJournalActions from '@pages/fake-journal/fake-journal.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { testReportPracticeModeSlot, candidateMock } from '@store/tests/__mocks__/tests.mock';
import { PopulateCandidateDetails } from '@store/tests/journal-data/common/candidate/candidate.actions';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import * as applicationReferenceActions
  from '@store/tests/journal-data/common/application-reference/application-reference.actions';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import * as reverseDiagramModalActions from '../reverse-diagram-modal.actions';
import { ReverseDiagramModalAnalyticsEffects } from '../reverse-diagram-modal.analytics.effects';

describe('ReverseDiagramModalAnalyticsEffects', () => {
  let effects: ReverseDiagramModalAnalyticsEffects;
  let analyticsProviderMock;
  let actions$: ReplaySubject<any>;
  let store$: Store<StoreModel>;
  const screenName = AnalyticsScreenNames.REVERSE_DIAGRAM;
  const screenNamePracticeMode = `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsScreenNames.REVERSE_DIAGRAM}`;
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
    spyOn(analyticsProviderMock, 'logEvent');
  });

  describe('reverseDiagramViewDidEnter', () => {
    it('should call setCurrentPage and addCustomDimension', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.BE));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      store$.dispatch(PopulateTestCategory(TestCategory.BE));
      // ACT
      actions$.next(reverseDiagramModalActions.ReverseDiagramViewDidEnter());
      // ASSERT
      effects.reverseDiagramViewDidEnter$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.TEST_CATEGORY, 'B+E');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.CANDIDATE_ID, '1');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.APPLICATION_REFERENCE, '123456789');
        expect(analyticsProviderMock.setCurrentPage)
          .toHaveBeenCalledWith(screenName);

        // GA4 Analytics
        expect(analyticsProviderMock.addGACustomDimension)
          .toHaveBeenCalledWith(GoogleAnalyticsCustomDimension.TEST_CATEGORY, 'B+E');
        expect(analyticsProviderMock.addGACustomDimension)
          .toHaveBeenCalledWith(GoogleAnalyticsCustomDimension.CANDIDATE_ID, '1');
        expect(analyticsProviderMock.addGACustomDimension)
          .toHaveBeenCalledWith(GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE, '123456789');
        expect(analyticsProviderMock.setGACurrentPage)
          .toHaveBeenCalledWith(screenName);
        done();
      });
    });
    it('should call setCurrentPage with practice mode prefix and addCustomDimension', (done) => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      store$.dispatch(PopulateTestCategory(TestCategory.BE));
      // ACT
      actions$.next(reverseDiagramModalActions.ReverseDiagramViewDidEnter());
      // ASSERT
      effects.reverseDiagramViewDidEnter$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.TEST_CATEGORY, 'B+E');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.CANDIDATE_ID, '1');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.APPLICATION_REFERENCE, '123456789');
        expect(analyticsProviderMock.setCurrentPage)
          .toHaveBeenCalledWith(screenNamePracticeMode);

        // GA4 Analytics
        expect(analyticsProviderMock.addGACustomDimension)
          .toHaveBeenCalledWith(GoogleAnalyticsCustomDimension.TEST_CATEGORY, 'B+E');
        expect(analyticsProviderMock.addGACustomDimension)
          .toHaveBeenCalledWith(GoogleAnalyticsCustomDimension.CANDIDATE_ID, '1');
        expect(analyticsProviderMock.addGACustomDimension)
          .toHaveBeenCalledWith(GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE, '123456789');
        expect(analyticsProviderMock.setGACurrentPage)
          .toHaveBeenCalledWith(`${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${screenName}`);
        done();
      });
    });
  });

  describe('reverseDiagramOpened', () => {
    it('should call logEvent with the correct parameters', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(reverseDiagramModalActions.ReverseDiagramOpened());
      // ASSERT
      effects.reverseDiagramOpened$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.REVERSE_DIAGRAM_OPENED}`,
        );
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.NAVIGATION,
          GoogleAnalyticsEventsTitles.OPENED,
          GoogleAnalyticsEventsValues.REVERSE_DIAGRAM,
        );
        done();
      });
    });
  });

  describe('reverseDiagramClosed', () => {
    it('should call logEvent with the correct parameters', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(reverseDiagramModalActions.ReverseDiagramClosed());
      // ASSERT
      effects.reverseDiagramClosed$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.REVERSE_DIAGRAM_CLOSED}`,
        );
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.NAVIGATION,
          GoogleAnalyticsEventsTitles.CLOSED,
          GoogleAnalyticsEventsValues.REVERSE_DIAGRAM,
        );
        done();
      });
    });
  });

  describe('reverseDiagramLengthChanged', () => {
    it('should call logEvent with the correct parameters', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(reverseDiagramModalActions.ReverseDiagramLengthChanged(100, 10));
      // ASSERT
      effects.reverseDiagramLengthChanged$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.REVERSE_DIAGRAM_LENGTH_CHANGED}`,
          'from 100 to 10',
        );
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.VEHICLE_LENGTH,
          GoogleAnalyticsEventsTitles.CHANGED_FROM,
          '100',
          GoogleAnalyticsEventsTitles.CHANGED_TO,
          '10',
        );
        done();
      });
    });
  });

  describe('reverseDiagramWidthChanged', () => {
    it('should call logEvent with the correct parameters', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(reverseDiagramModalActions.ReverseDiagramWidthChanged(100, 10));
      // ASSERT
      effects.reverseDiagramWidthChanged$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.REVERSE_DIAGRAM_WIDTH_CHANGED}`,
          'from 100 to 10',
        );
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.VEHICLE_WIDTH,
          GoogleAnalyticsEventsTitles.CHANGED_FROM,
          '100',
          GoogleAnalyticsEventsTitles.CHANGED_TO,
          '10',
        );
        done();
      });
    });
  });
});
