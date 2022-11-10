import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsScreenNames, AnalyticsDimensionIndices } from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
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
          '12345',
        );
        done();
      });
    });
  });
});
