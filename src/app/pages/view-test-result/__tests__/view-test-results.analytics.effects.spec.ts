import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsDimensionIndices,
  AnalyticsScreenNames,
  GoogleAnalyticsCustomDimension,
} from '@providers/analytics/analytics.model';
import { ReplaySubject } from 'rxjs';
import * as viewTestResultActions from '../view-test-result.actions';
import { ViewTestResultAnalyticsEffects } from '../view-test-result.analytics.effects';

describe('ViewTestResultAnalyticsEffects', () => {
  let effects: ViewTestResultAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;
  const screenName = AnalyticsScreenNames.VIEW_TEST_RESULT;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ViewTestResultAnalyticsEffects,
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        provideMockActions(() => actions$),
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(ViewTestResultAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
  });

  describe('viewTestResultViewDidEnter$', () => {
    it('should call setCurrentPage', (done) => {
      // ACT
      actions$.next(viewTestResultActions.ViewTestResultViewDidEnter('12345'));
      // ASSERT
      effects.viewTestResultViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenName);
        expect(analyticsProviderMock.addCustomDimension).toHaveBeenCalledWith(
          AnalyticsDimensionIndices.APPLICATION_REFERENCE,
          '12345'
        );

        expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenName);
        expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
          GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
          '12345'
        );
        done();
      });
    });
  });
});
