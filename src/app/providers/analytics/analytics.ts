import { GoogleAnalytics } from '@awesome-cordova-plugins/google-analytics/ngx';
import { createHash } from 'crypto';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DateTime } from '@shared/helpers/date-time';
import { DeviceProvider } from '../device/device';
import { AppConfigProvider } from '../app-config/app-config';
import { IAnalyticsProvider, AnalyticsEventCategories, AnalyticsDimensionIndices } from './analytics.model';
import { AuthenticationProvider } from '../authentication/authentication';

@Injectable()
export class AnalyticsProvider implements IAnalyticsProvider {
  private analyticsStartupError: string = 'Error starting Google Analytics';
  googleAnalyticsKey: string = '';
  uniqueDeviceId: string;
  uniqueUserId: string;
  constructor(
    private appConfig: AppConfigProvider,
    private ga: GoogleAnalytics,
    private platform: Platform,
    private device: DeviceProvider,
    private authProvider: AuthenticationProvider,
  ) { }

  initialiseAnalytics = (): Promise<any> => new Promise((resolve) => {
    this.googleAnalyticsKey = this.appConfig.getAppConfig().googleAnalyticsId;
    this.platform.ready().then(() => {
      this.setDeviceId(this.device.getUniqueDeviceId());
      this.setUserId(this.authProvider.getEmployeeId());
      this.addCustomDimension(AnalyticsDimensionIndices.DEVICE_ID, this.uniqueDeviceId);
      this.addCustomDimension(AnalyticsDimensionIndices.DEVICE_MODEL, this.device.getDescriptiveDeviceName());
      this.enableExceptionReporting();
    });
    resolve(true);
  });

  enableExceptionReporting(): void {
    this.platform.ready().then(() => {
      if (this.isIos()) {
        this.ga
          .startTrackerWithId(this.googleAnalyticsKey)
          .then(() => {
            this.ga.enableUncaughtExceptionReporting(true)
              .then(() => { })
              .catch((uncaughtError) => console.log('Error enabling uncaught exceptions', uncaughtError));
          })
          .catch((error) => console.log(`enableExceptionReporting: ${this.analyticsStartupError}`, error));
      }
    });
  }

  setCurrentPage(name: string): void {
    this.platform.ready().then(() => {
      if (this.isIos()) {
        this.ga
          .startTrackerWithId(this.googleAnalyticsKey)
          .then(() => {
            this.ga.trackView(name)
              .then(() => { })
              .catch((pageError) => console.log('Error setting page', pageError));
          })
          .catch((error) => console.log('Error starting Google Analytics', error));
      }
    });
  }

  logEvent(category: string, event: string, label ?: string, value? : number): void {
    this.platform.ready().then(() => {
      if (this.isIos()) {
        this.ga
          .startTrackerWithId(this.googleAnalyticsKey)
          .then(() => {
            this.ga.trackEvent(category, event, label, value)
              .then(() => { })
              .catch((eventError) => console.log('Error tracking event', eventError));
          })
          .catch((error) => console.log(`logEvent: ${this.analyticsStartupError}`, error));
      }
    });
  }

  addCustomDimension(key: number, value: string): void {
    if (this.isIos()) {
      this.ga
        .startTrackerWithId(this.googleAnalyticsKey)
        .then(() => {
          this.ga.addCustomDimension(key, value)
            .then(() => { })
            .catch((dimError) => console.log('Error adding custom dimension ', dimError));
        })
        .catch((error) => console.log(`addCustomDimension: ${this.analyticsStartupError}`, error));
    }
  }

  logError(type: string, message: string): void {
    this.logEvent(AnalyticsEventCategories.ERROR, type, message);
  }

  logException(message: string, fatal: boolean): void {
    if (this.isIos()) {
      this.ga
        .startTrackerWithId(this.googleAnalyticsKey)
        .then(() => {
          this.ga.trackException(message, fatal)
            .then(() => { })
            .catch((trackingError) => console.log('Error logging exception in Google Analytics', trackingError));
        })
        .catch((error) => console.log(`logException: ${this.analyticsStartupError}`, error));
    }
  }

  setUserId(userId: string): void {
    if (this.isIos()) {
      // @TODO: Consider using `createHash('sha512')` based on SonarQube suggestion.
      // This will have GA user implications
      this.uniqueUserId = createHash('sha256').update(userId || 'unavailable').digest('hex');
      this.ga
        .startTrackerWithId(this.googleAnalyticsKey)
        .then(() => {
          this.addCustomDimension(AnalyticsDimensionIndices.USER_ID, this.uniqueUserId);
          this.ga.setUserId(this.uniqueUserId)
            .then(() => { })
            .catch((idError) => console.log(`Error setting userid ${this.uniqueUserId}`, idError));
        })
        .catch((error) => console.log(`setUserId: ${this.analyticsStartupError}`, error));
    }
  }

  setDeviceId(deviceId: string): void {
    // @TODO: Consider using `createHash('sha512')` based on SonarQube suggestion.
    // This will have GA device implications
    this.uniqueDeviceId = createHash('sha256').update(deviceId || 'defaultDevice').digest('hex');
    this.addCustomDimension(AnalyticsDimensionIndices.DEVICE_ID, this.uniqueDeviceId);
  }

  getDiffDays(userDate: string) : number {
    const today = new DateTime();
    return today.daysDiff(userDate);
  }

  getDescriptiveDate(userDate: string) : string {
    let ret: string;

    const daysDiff = this.getDiffDays(userDate);

    switch (daysDiff) {
      case -1:
        ret = 'Yesterday';
        break;
      case 0:
        ret = 'Today';
        break;
      case 1:
        ret = 'Tomorrow';
        break;
      default:
        ret = userDate;
        break;
    }
    return ret;
  }

  isIos = (): boolean => this.platform.is('cordova');

}
