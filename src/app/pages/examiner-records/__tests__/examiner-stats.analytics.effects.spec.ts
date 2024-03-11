import { ExaminerRecordsAnalyticsEffects } from '@pages/examiner-records/examiner-records.analytics.effects';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { ReplaySubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AnalyticsEventCategories, AnalyticsEvents, AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { provideMockActions } from '@ngrx/effects/testing';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AccordionChanged,
  ColourFilterChanged,
  DateRangeChanged,
  ExaminerRecordsViewDidEnter,
  HideChartsChanged,
  LocationChanged,
  TestCategoryChanged,
} from '@pages/examiner-records/examiner-records.actions';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ColourEnum } from '@providers/examiner-records/examiner-records';

describe('ExaminerStatsAnalyticsEffects', () => {
  let effects: ExaminerRecordsAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;
  const screenName = AnalyticsScreenNames.EXAMINER_STATS;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        ExaminerRecordsAnalyticsEffects,
        {
          provide: AnalyticsProvider,
          useClass: AnalyticsProviderMock,
        },
        provideMockActions(() => actions$),
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(ExaminerRecordsAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    spyOn(analyticsProviderMock, 'logEvent');
  }));

  describe('examinerStatsViewDidEnter$', () => {
    it('should call setCurrentPage', (done) => {
      // ACT
      actions$.next(ExaminerRecordsViewDidEnter());
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
      actions$.next(DateRangeChanged({
        display: '1',
        val: 'today',
      }));
      // ASSERT
      effects.dateRangeChanged$.subscribe((result) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.EXAMINER_STATS,
            AnalyticsEvents.DATE_RANGE_CHANGED,
            'today',
          );
        done();
      });
    });
  });
  describe('locationChanged$', () => {
    it('should log an event', (done) => {
      // ACT
      actions$.next(LocationChanged({ centreId: 1, centreName: '2', costCode: '3' }));
      // ASSERT
      effects.locationChanged$.subscribe((result) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.EXAMINER_STATS,
            AnalyticsEvents.LOCATION_CHANGED,
            '2',
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
  describe('hideChartsChanged$', () => {
    it('should log Charts unhidden if called with false', (done) => {
      // ACT
      actions$.next(HideChartsChanged(false));
      // ASSERT
      effects.hideChartsChanged$.subscribe((result) => {
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
    it('should log Charts hidden if called with true', (done) => {
      // ACT
      actions$.next(HideChartsChanged(true));
      // ASSERT
      effects.hideChartsChanged$.subscribe((result) => {
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
  describe('accordionChanged$', () => {
    it('should log Additional filters opened when called with true', (done) => {
      // ACT
      actions$.next(AccordionChanged(true));
      // ASSERT
      effects.accordionChanged$.subscribe((result) => {
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
    it('should log Additional filters closed when called with false', (done) => {
      // ACT
      actions$.next(AccordionChanged(false));
      // ASSERT
      effects.accordionChanged$.subscribe((result) => {
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
