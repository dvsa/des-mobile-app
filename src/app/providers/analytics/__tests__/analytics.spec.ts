import { TestBed } from '@angular/core/testing';
import { PlatformMock, GoogleAnalyticsMock } from 'ionic-mocks';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { Platform } from '@ionic/angular';
import { AnalyticsProvider } from '../analytics';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';
import { DeviceProviderMock } from '../../device/__mocks__/device.mock';
import { AuthenticationProviderMock } from '../../authentication/__mocks__/authentication.mock';
import { AppConfigProvider } from '../../app-config/app-config';
import { DeviceProvider } from '../../device/device';
import { AuthenticationProvider } from '../../authentication/authentication';

describe('AnalyticsProvider', () => {
  let analyticsProvider: AnalyticsProvider;
  let googleAnalyticsMock: GoogleAnalyticsMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AnalyticsProvider,
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
        { provide: GoogleAnalytics, useFactory: () => GoogleAnalyticsMock.instance() },
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: DeviceProvider, useClass: DeviceProviderMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
      ],
    });

    analyticsProvider = TestBed.inject(AnalyticsProvider);
    googleAnalyticsMock = TestBed.inject(GoogleAnalytics);
  });

  describe('setUserId', () => {
    it('should hash the userId for 123 correctly', () => {
      expect(googleAnalyticsMock).toBeDefined();
      analyticsProvider.setUserId('123');
      expect(analyticsProvider.uniqueUserId)
        .toEqual('a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3');
    });
    it('should hash the userId for 456 correctly', () => {
      expect(googleAnalyticsMock).toBeDefined();
      analyticsProvider.setUserId('456');
      expect(analyticsProvider.uniqueUserId)
        .toEqual('b3a8e0e1f9ab1bfe3a36f231f676f78bb30a519d2b21e6c530c0eee8ebb4a5d0');
    });
    it('should hash the userId consistently when no value is available', () => {
      expect(googleAnalyticsMock).toBeDefined();
      analyticsProvider.setUserId('');
      expect(analyticsProvider.uniqueUserId)
        .toEqual('ba691ba042bcedd9a61a36f5969026bc95859dccdc7e47f24e6bce35673baf2f');
    });
  });

  describe('setDeviceId', () => {
    it('should hash the userId for abcdef123456 correctly', () => {
      expect(googleAnalyticsMock).toBeDefined();
      analyticsProvider.setDeviceId('abcdef123456');
      expect(analyticsProvider.uniqueDeviceId)
        .toEqual('da4ec3358a10c9b0872eb877953cc7b07af5f4d75e4c1cb0597cbbf41e5dbe35');
    });
    it('should hash the userId for aabbccddeeff correctly', () => {
      expect(googleAnalyticsMock).toBeDefined();
      analyticsProvider.setDeviceId('aabbccddeeff');
      expect(analyticsProvider.uniqueDeviceId)
        .toEqual('c1799564f2eefcaf63dd2e5cc08573e63856222a232dab2d91a17b232830d430');
    });
    it('should hash the userId consistently when no value is available', () => {
      expect(googleAnalyticsMock).toBeDefined();
      analyticsProvider.setDeviceId('');
      expect(analyticsProvider.uniqueDeviceId)
        .toEqual('96ed066cad78965eafb18fdffbc37509aa98ff9dc21b9781589eebba01d5be3e');
    });
  });

});
