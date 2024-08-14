import { TestBed } from '@angular/core/testing';
import { GoogleAnalytics } from '@awesome-cordova-plugins/google-analytics/ngx';
import { Platform } from '@ionic/angular';
import { GoogleAnalyticsMock, PlatformMock } from '@mocks/index.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AppConfigProviderMock } from '@providers//app-config/__mocks__/app-config.mock';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { DeviceProvider } from '@providers/device/device';
import { AuthenticationProvider } from '@providers/authentication/authentication';

xdescribe('AnalyticsProvider', () => {
  let analyticsProvider: AnalyticsProvider;
  let googleAnalyticsMock: GoogleAnalytics;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AnalyticsProvider,
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
        {
          provide: GoogleAnalytics,
          useClass: GoogleAnalyticsMock,
        },
        {
          provide: Platform,
          useClass: PlatformMock,
        },
        {
          provide: DeviceProvider,
          useClass: DeviceProviderMock,
        },
        {
          provide: AuthenticationProvider,
          useClass: AuthenticationProviderMock,
        },
      ],
    });

    analyticsProvider = TestBed.inject(AnalyticsProvider);
    googleAnalyticsMock = TestBed.inject(GoogleAnalytics);
    spyOn(googleAnalyticsMock, 'startTrackerWithId');
    analyticsProvider.googleAnalyticsKey = 'abc123-ghj-123';
    spyOn(analyticsProvider, 'isIos')
      .and
      .returnValue(true);
  });
});
