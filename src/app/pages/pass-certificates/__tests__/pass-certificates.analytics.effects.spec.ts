import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { PassCertificatedViewDidEnter } from '@pages/pass-certificates/pass-certificates.actions';
import { PassCertificatesAnalyticsEffects } from '@pages/pass-certificates/pass-certificates.analytics.effects';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { ReplaySubject } from 'rxjs';

describe('PassCertificatesAnalyticsEffects', () => {
  let effects: PassCertificatesAnalyticsEffects;
  let analyticsProvider: AnalyticsProvider;
  let actions$: ReplaySubject<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PassCertificatesAnalyticsEffects,
        provideMockActions(() => actions$),
        {
          provide: AnalyticsProvider,
          useClass: AnalyticsProviderMock,
        },
      ],
    });

    effects = TestBed.inject(PassCertificatesAnalyticsEffects);
    analyticsProvider = TestBed.inject(AnalyticsProvider);
    actions$ = new ReplaySubject(1);
  });

  it('should log page view when pass certificates page is entered', (done) => {
    actions$.next(PassCertificatedViewDidEnter());

    effects.passCertificatesView$.subscribe((result) => {
      expect(result.type).toEqual(AnalyticRecorded.type);
      // TODO - MES-9495 - remove old analytics
      expect(analyticsProvider.setCurrentPage).toHaveBeenCalledWith(AnalyticsScreenNames.PASS_CERTIFICATES);

      // GA4 Analytics
      expect(analyticsProvider.setGACurrentPage).toHaveBeenCalledWith(AnalyticsScreenNames.PASS_CERTIFICATES);
      done();
    });
  });
});
