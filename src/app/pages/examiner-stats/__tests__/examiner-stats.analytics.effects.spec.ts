import { ExaminerStatsAnalyticsEffects } from '@pages/examiner-stats/examiner-stats.analytics.effects';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { ReplaySubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AnalyticsEventCategories, AnalyticsEvents, AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { provideMockActions } from '@ngrx/effects/testing';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AccordionClosed,
  AccordionOpened,
  ColourFilterChanged,
  DateRangeChanged,
  ExaminerStatsViewDidEnter,
  HideChartsActivated,
  HideChartsDeactivated,
  LocationChanged,
  TestCategoryChanged,
} from '@pages/examiner-stats/examiner-stats.actions';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ColourEnum } from '@pages/examiner-stats/examiner-stats.page';

describe('ExaminerStatsAnalyticsEffects', () => {
  let effects: ExaminerStatsAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;
  const screenName = AnalyticsScreenNames.EXAMINER_STATS;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        ExaminerStatsAnalyticsEffects,
        {
          provide: AnalyticsProvider,
          useClass: AnalyticsProviderMock,
        },
        provideMockActions(() => actions$),
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(ExaminerStatsAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    spyOn(analyticsProviderMock, 'logEvent');
  }));

  describe('examinerStatsViewDidEnter$', () => {
    it('should call setCurrentPage', (done) => {
      // ACT
      actions$.next(ExaminerStatsViewDidEnter());
      // ASSERT
      effects.examinerStatsViewDidEnter$.subscribe((result) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.setCurrentPage)
          .toHaveBeenCalledWith(screenName);
        done();
      });
    });
  });
  describe('dateRangeChanged$', () => {
    it('should log an event', (done) => {
      // ACT
      actions$.next(DateRangeChanged('some range'));
      // ASSERT
      effects.dateRangeChanged$.subscribe((result) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.EXAMINER_STATS,
            AnalyticsEvents.DATE_RANGE_CHANGED,
            'some range',
          );
        done();
      });
    });
  });
  describe('locationChanged$', () => {
    it('should log an event', (done) => {
      // ACT
      actions$.next(LocationChanged('some location'));
      // ASSERT
      effects.locationChanged$.subscribe((result) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.EXAMINER_STATS,
            AnalyticsEvents.LOCATION_CHANGED,
            'some location',
          );
        done();
      });
    });
  });
  describe('testCategoryChanged$', () => {
    it('should log an event', (done) => {
      // ACT
      actions$.next(TestCategoryChanged(TestCategory.ADI2));
      // ASSERT
      effects.testCategoryChanged$.subscribe((result) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.EXAMINER_STATS,
            AnalyticsEvents.TEST_CATEGORY_CHANGED,
            TestCategory.ADI2,
          );
        done();
      });
    });
  });
  describe('colourFilterChanged$', () => {
    it('should log an event', (done) => {
      // ACT
      actions$.next(ColourFilterChanged(ColourEnum.Amethyst));
      // ASSERT
      effects.colourFilterChanged$.subscribe((result) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.EXAMINER_STATS,
            AnalyticsEvents.COLOUR_SCHEME_CHANGED,
            ColourEnum.Amethyst,
          );
        done();
      });
    });
  });
  describe('hideChartsEnabled$', () => {
    it('should log an event', (done) => {
      // ACT
      actions$.next(HideChartsActivated());
      // ASSERT
      effects.hideChartsEnabled$.subscribe((result) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.EXAMINER_STATS,
            AnalyticsEvents.HIDE_CHARTS_CHANGED,
            'Charts hidden',
          );
        done();
      });
    });
  });
  describe('hideChartsDisabled$', () => {
    it('should log an event', (done) => {
      // ACT
      actions$.next(HideChartsDeactivated());
      // ASSERT
      effects.hideChartsDisabled$.subscribe((result) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.EXAMINER_STATS,
            AnalyticsEvents.HIDE_CHARTS_CHANGED,
            'Charts unhidden',
          );
        done();
      });
    });
  });
  describe('accordionOpened$', () => {
    it('should log an event', (done) => {
      // ACT
      actions$.next(AccordionOpened());
      // ASSERT
      effects.accordionOpened$.subscribe((result) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.EXAMINER_STATS,
            AnalyticsEvents.ADDITIONAL_FILTERS_TOGGLED,
            'Additional filters opened',
          );
        done();
      });
    });
  });
  describe('accordionClosed$', () => {
    it('should log an event', (done) => {
      // ACT
      actions$.next(AccordionClosed());
      // ASSERT
      effects.accordionClosed$.subscribe((result) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.EXAMINER_STATS,
            AnalyticsEvents.ADDITIONAL_FILTERS_TOGGLED,
            'Additional filters closed',
          );
        done();
      });
    });
  });

});
