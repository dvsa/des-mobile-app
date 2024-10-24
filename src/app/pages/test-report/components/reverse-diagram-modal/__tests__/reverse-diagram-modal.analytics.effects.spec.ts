import { TestBed } from '@angular/core/testing';
import { Application } from '@dvsa/mes-journal-schema';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
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
import { ReplaySubject } from 'rxjs';
import * as reverseDiagramModalActions from '../reverse-diagram-modal.actions';
import { ReverseDiagramModalAnalyticsEffects } from '../reverse-diagram-modal.analytics.effects';

describe('ReverseDiagramModalAnalyticsEffects', () => {
  let effects: ReverseDiagramModalAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;
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

        // GA4 Analytics
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

        // GA4 Analytics
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

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.NAVIGATION,
          GoogleAnalyticsEventsTitles.OPENED,
          GoogleAnalyticsEventsValues.REVERSE_DIAGRAM
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

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.NAVIGATION,
          GoogleAnalyticsEventsTitles.CLOSED,
          GoogleAnalyticsEventsValues.REVERSE_DIAGRAM
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

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.VEHICLE_LENGTH,
          GoogleAnalyticsEventsTitles.CHANGED_FROM,
          '100',
          GoogleAnalyticsEventsTitles.CHANGED_TO,
          '10'
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

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.VEHICLE_WIDTH,
          GoogleAnalyticsEventsTitles.CHANGED_FROM,
          '100',
          GoogleAnalyticsEventsTitles.CHANGED_TO,
          '10'
        );
        done();
      });
    });
  });
});
