import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';

import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsEventPrefix,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';

import * as testReportDashboardActions from '../test-report-dashboard.actions';
import {
  TestReportDashboardAnalyticsEffects
} from '@pages/test-report-dashboard/test-report-dashboard.analytics.effects';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import * as testsActions from '@store/tests/tests.actions';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { PopulateCandidateDetails } from '@store/tests/journal-data/common/candidate/candidate.actions';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import * as fakeJournalActions from '@pages/fake-journal/fake-journal.actions';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import { testsReducer } from '@store/tests/tests.reducer';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import { TestReportDashboardModalOpened, TestReportDashboardNavigateToPage } from '../test-report-dashboard.actions';
import { DASHBOARD_PAGE } from '@pages/page-names.constants';
import { FeedbackChanged } from '@store/tests/test-data/cat-adi-part3/review/review.actions';

describe('TestReportDashboardAnalyticsEffects', () => {
  let effects: TestReportDashboardAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;
  let store$: Store<StoreModel>;
  const screenName = AnalyticsScreenNames.TEST_REPORT_DASHBOARD;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        TestReportDashboardAnalyticsEffects,
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
    effects = TestBed.inject(TestReportDashboardAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    store$ = TestBed.inject(Store);
    spyOn(analyticsProviderMock, 'logEvent');
  });

  describe('testReportDashboardViewDidEnter$', () => {
    it('should call setCurrentPage', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.ADI3));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(testReportDashboardActions.TestReportDashboardViewDidEnter());
      // ASSERT
      effects.testReportDashboardViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);

        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.setCurrentPage)
          .toHaveBeenCalledWith(screenName);

        // GA4 Analytics
        expect(analyticsProviderMock.setGACurrentPage)
          .toHaveBeenCalledWith(AnalyticsScreenNames.TEST_REPORT_DASHBOARD);
        done();
      });
    });

    it('should call setCurrentPage and prefix correctly when practice mode', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.ADI3));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(testReportDashboardActions.TestReportDashboardViewDidEnter());
      // ASSERT
      effects.testReportDashboardViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);

        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.setCurrentPage)
          .toHaveBeenCalledWith(`practice mode - ${screenName}`);

        // GA4 Analytics
        expect(analyticsProviderMock.setGACurrentPage)
          .toHaveBeenCalledWith(
            `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${AnalyticsScreenNames.TEST_REPORT_DASHBOARD}`);
        done();
      });
    });

  });

  describe('testReportDashboardModalOpened$', () => {
    it('should dispatch action when opening modal', () => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.ADI3));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(PopulateTestCategory(TestCategory.ADI3));
      // ACT
      actions$.next(TestReportDashboardModalOpened());
      // ASSERT
      effects.testReportDashboardModalOpened$.subscribe((result: ReturnType<typeof AnalyticRecorded>) => {
        expect(result.type)
          .toBe(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.NAVIGATION,
            GoogleAnalyticsEventsTitles.OPENED,
            GoogleAnalyticsEventsValues.ASSESSMENT_MODAL,
          );
      });
    });
  });

  describe('testReportDashboardNavigateToPage$', () => {
    it('should dispatch action when opening modal', () => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.ADI3));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(PopulateTestCategory(TestCategory.ADI3));
      // ACT
      actions$.next(TestReportDashboardNavigateToPage(DASHBOARD_PAGE));
      // ASSERT
      effects.testReportDashboardNavigateToPage$.subscribe((result: ReturnType<typeof AnalyticRecorded>) => {
        expect(result.type)
          .toBe(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.NAVIGATION,
            GoogleAnalyticsEventsTitles.OPENED,
            DASHBOARD_PAGE,
          );
      });
    });
  });

  describe('testReportDashboardFeedbackChanged$', () => {
    it('should dispatch action when opening modal', () => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.ADI3));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(PopulateTestCategory(TestCategory.ADI3));
      // ACT
      actions$.next(FeedbackChanged('feedback'));
      // ASSERT
      effects.testReportDashboardFeedbackChanged$.subscribe((result: ReturnType<typeof AnalyticRecorded>) => {
        expect(result.type)
          .toBe(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.FEEDBACK,
            GoogleAnalyticsEventsTitles.TEST_CATEGORY,
            TestCategory.ADI3,
            GoogleAnalyticsEventsTitles.REASON,
            GoogleAnalyticsEventsValues.FREE_TEXT_ENTERED,
          );
      });
    });
  });

});