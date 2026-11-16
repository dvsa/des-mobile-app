import { TestBed } from '@angular/core/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import {
  ClickDataCard,
  ColourFilterChanged,
  DateRangeChanged,
  DisplayPartialBanner,
  ExaminerRecordsViewDidEnter,
  HideChartsChanged,
  LocationChanged,
  ReturnToDashboardPressed,
  TestCategoryChanged,
} from '@pages/examiner-records/examiner-records.actions';
import { ExaminerRecordsAnalyticsEffects } from '@pages/examiner-records/examiner-records.analytics.effects';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { ColourEnum } from '@providers/examiner-records/examiner-records';
import { DateRange } from '@shared/helpers/date-time';
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('ExaminerStatsAnalyticsEffects', () => {
  let effects: ExaminerRecordsAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<Action>;
  const screenName = AnalyticsScreenNames.EXAMINER_RECORDS;

  beforeEach(() => {
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
    vi.spyOn(analyticsProviderMock, 'logGAEvent');
  });

  describe('examinerStatsViewDidEnter$', () => {
    it('should call setCurrentPage', async () => {
      actions$.next(ExaminerRecordsViewDidEnter());
      const result = await firstValueFrom(effects.examinerStatsViewDidEnter$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenName);
    });
  });
  describe('dateRangeChanged$', () => {
    it('should log an event', async () => {
      actions$.next(
        DateRangeChanged({
          display: '1',
          val: DateRange.TODAY,
        })
      );
      const result = await firstValueFrom(effects.dateRangeChanged$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.EXAMINER_RECORDS,
        GoogleAnalyticsEventsTitles.DATE_RANGE_CHANGED,
        'today'
      );
    });
  });
  describe('locationChanged$', () => {
    it('should log an event', async () => {
      actions$.next(LocationChanged({ centreId: 1, centreName: '2', costCode: '3' }));
      const result = await firstValueFrom(effects.locationChanged$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.EXAMINER_RECORDS,
        GoogleAnalyticsEventsTitles.LOCATION_FILTER,
        '2'
      );
    });
  });
  describe('testCategoryChanged$', () => {
    it('should log an event', async () => {
      actions$.next(TestCategoryChanged(TestCategory.ADI2));
      const result = await firstValueFrom(effects.testCategoryChanged$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.EXAMINER_RECORDS,
        GoogleAnalyticsEventsTitles.TEST_CATEGORY_FILTER,
        TestCategory.ADI2
      );
    });
  });
  describe('colourFilterChanged$', () => {
    it('should log an event with the default colour title if default is selected', async () => {
      actions$.next(ColourFilterChanged(ColourEnum.DEFAULT));
      const result = await firstValueFrom(effects.colourFilterChanged$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.EXAMINER_RECORDS,
        GoogleAnalyticsEventsTitles.DEFAULT_COLOUR,
        GoogleAnalyticsEventsValues.SELECTED
      );
    });
    it('should log an event with the greyscale colour title if greyscale is selected', async () => {
      actions$.next(ColourFilterChanged(ColourEnum.GREYSCALE));
      const result = await firstValueFrom(effects.colourFilterChanged$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.EXAMINER_RECORDS,
        GoogleAnalyticsEventsTitles.GREYSCALE_COLOUR,
        GoogleAnalyticsEventsValues.SELECTED
      );
    });
  });
  describe('hideChartsChanged$', () => {
    it('should log unselected if called with false', async () => {
      actions$.next(HideChartsChanged(false));
      const result = await firstValueFrom(effects.hideChartsChanged$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.EXAMINER_RECORDS,
        GoogleAnalyticsEventsTitles.CHART_VISUALISATION,
        GoogleAnalyticsEventsValues.UNSELECTED
      );
    });
    it('should log selected if called with true', async () => {
      actions$.next(HideChartsChanged(true));
      const result = await firstValueFrom(effects.hideChartsChanged$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.EXAMINER_RECORDS,
        GoogleAnalyticsEventsTitles.CHART_VISUALISATION,
        GoogleAnalyticsEventsValues.SELECTED
      );
    });
  });
  describe('returnToDashboardPressed$', () => {
    it('should log an event', async () => {
      actions$.next(ReturnToDashboardPressed());
      const result = await firstValueFrom(effects.returnToDashboardPressed$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.EXAMINER_RECORDS,
        GoogleAnalyticsEventsTitles.BUTTON_SELECTION,
        GoogleAnalyticsEventsValues.RETURN_TO_DASHBOARD
      );
    });
  });
  describe('onCardClicked$', () => {
    it('should log an event with the tap to show title if expanded', async () => {
      actions$.next(
        ClickDataCard({
          isExpanded: true,
          title: 'title',
        })
      );
      const result = await firstValueFrom(effects.onCardClicked$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.EXAMINER_RECORDS,
        GoogleAnalyticsEventsTitles.TAP_TO_SHOW,
        'title'
      );
    });
    it('should log an event with the tap to hide title if not expanded', async () => {
      actions$.next(
        ClickDataCard({
          isExpanded: false,
          title: 'title',
        })
      );
      const result = await firstValueFrom(effects.onCardClicked$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.EXAMINER_RECORDS,
        GoogleAnalyticsEventsTitles.TAP_TO_HIDE,
        'title'
      );
    });
  });
  describe('partialBannerDisplayed$', () => {
    it('should log an event', async () => {
      actions$.next(DisplayPartialBanner());
      const result = await firstValueFrom(effects.partialBannerDisplayed$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.EXAMINER_RECORDS,
        GoogleAnalyticsEventsTitles.DATA_UNAVAILABLE,
        GoogleAnalyticsEventsValues.DATA_BANNER_DISPLAY
      );
    });
  });
});
