import { TestBed } from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { PlatformMock } from '@mocks/index.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AppConfigProviderMock } from '@providers//app-config/__mocks__/app-config.mock';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { DeviceProvider } from '@providers/device/device';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AppInfoProvider } from '@providers/app-info/app-info';
import { AppInfoProviderMock } from '@providers/app-info/__mocks__/app-info.mock';

describe('AnalyticsProvider', () => {
  let analyticsProvider: AnalyticsProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AnalyticsProvider,
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
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
        {
          provide: AppInfoProvider,
          useClass: AppInfoProviderMock,
        },
      ],
    });

    analyticsProvider = TestBed.inject(AnalyticsProvider);
    spyOn(analyticsProvider, 'isIos')
      .and
      .returnValue(true);
  });

  it('should create', () => {
    expect(analyticsProvider)
      .toBeTruthy();
  });
});
