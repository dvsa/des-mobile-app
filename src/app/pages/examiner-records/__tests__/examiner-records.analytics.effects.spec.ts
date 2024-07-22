import { ExaminerRecordsAnalyticsEffects } from '@pages/examiner-records/examiner-records.analytics.effects';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { ReplaySubject } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { provideMockActions } from '@ngrx/effects/testing';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  ClickDataCard,
  ColourFilterChanged,
  DateRangeChanged, DisplayPartialBanner,
  ExaminerRecordsViewDidEnter,
  HideChartsChanged,
  LocationChanged, ReturnToDashboardPressed,
  TestCategoryChanged,
} from '@pages/examiner-records/examiner-records.actions';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ColourEnum } from '@providers/examiner-records/examiner-records';

describe('ExaminerStatsAnalyticsEffects', () => {
  let effects: ExaminerRecordsAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;
  const screenName = AnalyticsScreenNames.EXAMINER_RECORDS;

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
    spyOn(analyticsProviderMock, 'logGAEvent');
  }));

  describe('examinerStatsViewDidEnter$', () => {
    it('should call setCurrentPage', (done) => {
      // ACT
      actions$.next(ExaminerRecordsViewDidEnter());
      // ASSERT
      effects.examinerStatsViewDidEnter$.subscribe((result) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.setGACurrentPage)
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
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.EXAMINER_RECORDS,
            GoogleAnalyticsEventsTitles.DATE_RANGE_CHANGED,
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
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.EXAMINER_RECORDS,
            GoogleAnalyticsEventsTitles.LOCATION_FILTER,
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
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.EXAMINER_RECORDS,
            GoogleAnalyticsEventsTitles.TEST_CATEGORY_FILTER,
            TestCategory.ADI2,
          );
        done();
      });
    });
  });
  describe('colourFilterChanged$', () => {
    it('should log an event with the default colour title if default is selected', (done) => {
      // ACT
      actions$.next(ColourFilterChanged(ColourEnum.DEFAULT));
      // ASSERT
      effects.colourFilterChanged$.subscribe((result) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.EXAMINER_RECORDS,
            GoogleAnalyticsEventsTitles.DEFAULT_COLOUR,
            GoogleAnalyticsEventsValues.SELECTED,
          );
        done();
      });
    });
    it('should log an event with the greyscale colour title if greyscale is selected', (done) => {
      // ACT
      actions$.next(ColourFilterChanged(ColourEnum.GREYSCALE));
      // ASSERT
      effects.colourFilterChanged$.subscribe((result) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.EXAMINER_RECORDS,
            GoogleAnalyticsEventsTitles.GREYSCALE_COLOUR,
            GoogleAnalyticsEventsValues.SELECTED,
          );
        done();
      });
    });
  });
  describe('hideChartsChanged$', () => {
    it('should log unselected if called with false', (done) => {
      // ACT
      actions$.next(HideChartsChanged(false));
      // ASSERT
      effects.hideChartsChanged$.subscribe((result) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.EXAMINER_RECORDS,
            GoogleAnalyticsEventsTitles.CHART_VISUALISATION,
            GoogleAnalyticsEventsValues.UNSELECTED,
          );
        done();
      });
    });
    it('should log selected if called with true', (done) => {
      // ACT
      actions$.next(HideChartsChanged(true));
      // ASSERT
      effects.hideChartsChanged$.subscribe((result) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.EXAMINER_RECORDS,
            GoogleAnalyticsEventsTitles.CHART_VISUALISATION,
            GoogleAnalyticsEventsValues.SELECTED,
          );
        done();
      });
    });
  });
  describe('returnToDashboardPressed$', () => {
    it('should log an event', (done) => {
      // ACT
      actions$.next(ReturnToDashboardPressed());
      // ASSERT
      effects.returnToDashboardPressed$.subscribe((result) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.EXAMINER_RECORDS,
            GoogleAnalyticsEventsTitles.BUTTON_SELECTION,
            GoogleAnalyticsEventsValues.RETURN_TO_DASHBOARD,
          );
        done();
      });
    });
  });
  describe('onCardClicked$', () => {
    it('should log an event with the tap to show title if expanded', (done) => {
      // ACT
      actions$.next(ClickDataCard({
        isExpanded: true,
        title: 'title',
      }));
      // ASSERT
      effects.onCardClicked$.subscribe((result) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.EXAMINER_RECORDS,
            GoogleAnalyticsEventsTitles.TAP_TO_SHOW,
            'title',
          );
        done();
      });
    });
    it('should log an event with the tap to hide title if not expanded', (done) => {
      // ACT
      actions$.next(ClickDataCard({
        isExpanded: false,
        title: 'title',
      }));
      // ASSERT
      effects.onCardClicked$.subscribe((result) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.EXAMINER_RECORDS,
            GoogleAnalyticsEventsTitles.TAP_TO_HIDE,
            'title',
          );
        done();
      });
    });
  });
  describe('partialBannerDisplayed$', () => {
    it('should log an event', (done) => {
      // ACT
      actions$.next(DisplayPartialBanner());
      // ASSERT
      effects.partialBannerDisplayed$.subscribe((result) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.EXAMINER_RECORDS,
            GoogleAnalyticsEventsTitles.DATA_UNAVAILABLE,
            GoogleAnalyticsEventsValues.DATA_BANNER_DISPLAY,
          );
        done();
      });
    });
  });
});
