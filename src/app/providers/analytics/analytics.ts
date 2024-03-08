import { GoogleAnalytics } from '@awesome-cordova-plugins/google-analytics/ngx';
import { createHash } from 'crypto';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DateTime } from '@shared/helpers/date-time';
import { DeviceProvider } from '../device/device';
import { AppConfigProvider } from '../app-config/app-config';
import { AnalyticsDimensionIndices, AnalyticsEventCategories, IAnalyticsProvider } from './analytics.model';
import { AuthenticationProvider } from '../authentication/authentication';
import { getEnumKeyByValue } from '@shared/helpers/enum-keys';

declare const gtag: Function;

@Injectable()
export class AnalyticsProvider implements IAnalyticsProvider {
  googleAnalyticsKey: string = '';
  uniqueDeviceId: string;
  uniqueUserId: string;
  private analyticsStartupError: string = 'Error starting Google Analytics';

  constructor(
    private appConfig: AppConfigProvider,
    private ga: GoogleAnalytics,
    private platform: Platform,
    private device: DeviceProvider,
    private authProvider: AuthenticationProvider,
  ) {
  }

  /**
   * initial setup of GA4
   */

  initialiseGoogleAnalytics = async (): Promise<void> => {
    try {
      // TODO: Add guard for missing key
      // this.googleAnalyticsKey = this.appConfig.getAppConfig()?.googleAnalyticsId;
      this.googleAnalyticsKey = 'x';
      this.addGAScript();

      await this.platform.ready();

      const employeeId = this.authProvider.getEmployeeId();
      const uniqueDeviceId = await this.device.getUniqueDeviceId();
      const deviceModel = await this.device.getDeviceName();

      this.setGAUserId(employeeId);
      this.setGADeviceId(uniqueDeviceId);
      this.addGACustomDimension(AnalyticsDimensionIndices.DEVICE_ID, uniqueDeviceId);
      this.addGACustomDimension(AnalyticsDimensionIndices.DEVICE_MODEL, deviceModel);
    } catch (error) {
      // Handle any errors here
      console.error('Analytics - Error initializing Google Analytics:', error);
    }
  };

  addGAScript(): void {
// Create a new script element
    const gtagScript: HTMLScriptElement = document.createElement('script');

    gtagScript.async = true;
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-4XPD2B5Y1J';

    document.head.appendChild(gtagScript);

    const gtagScript2: HTMLScriptElement = document.createElement('script');

    gtagScript2.innerHTML = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('set', 'checkProtocolTask', function() {});
  gtag('config', 'G-4XPD2B5Y1J'{
      send_page_view: false,
      client_storage: 'none',
    });
`;

    document.head.appendChild(gtagScript2);
  }

  setGAUserId(userId: string): void {
    if (this.isIos()) {
      try {
        console.log('set GA user id');
        this.uniqueUserId = createHash('sha256')
          .update(userId || 'unavailable')
          .digest('hex');
        console.log(`set GA user id: ${this.uniqueUserId}`);
        this.addGACustomDimension(AnalyticsDimensionIndices.USER_ID, this.uniqueUserId);
        gtag('config', this.googleAnalyticsKey, {
          send_page_view: false,
          user_id: this.uniqueUserId,
        });
      } catch (error) {
        console.log(`Analytics - setGAUserId ${this.uniqueUserId}`, error);
      }
    }
  }

  setGADeviceId(deviceId: string): void {
    this.uniqueDeviceId = createHash('sha256')
      .update(deviceId || 'defaultDevice')
      .digest('hex');
    this.addGACustomDimension(AnalyticsDimensionIndices.DEVICE_ID, this.uniqueDeviceId);
  }

  addGACustomDimension(key: number, value: string): void {
    if (this.isIos()) {
      try {
        console.log(`Analytics - add custom dimension: ${key}`);
        const [dimension] = getEnumKeyByValue(AnalyticsDimensionIndices, key);
        gtag('event', dimension, { key: value });
      } catch (error) {
        console.error('Analytics - addGACustomDimension', error);
      }
    }
  }

  setGACurrentPage(name: string): void {
    this.platform.ready()
      .then(() => {
        if (this.isIos()) {
          try {
            console.log(`Analytics - set page: ${name}`);
            gtag('config', this.googleAnalyticsKey, {
              send_page_view: false,
              page_title: name,
            });
          } catch (error) {
            console.error('Analytics - setGACurrentPage', error);
          }
        }
      });
  }

  logGAEvent(category: string, event: string, label?: string, value?: number): void {
    this.platform.ready()
      .then(() => {
        if (this.isIos()) {
          try {
            gtag('event', event, {
              event_category: category,
              event_label: label,
              value,
            });
          } catch (error) {
            console.error('Analytics - logEvent', error);
          }
        }
      });
  }

  initialiseAnalytics = (): Promise<any> => new Promise((resolve) => {
    this.googleAnalyticsKey = this.appConfig.getAppConfig()?.googleAnalyticsId;
    this.platform.ready()
      .then(async () => {
        this.setDeviceId(await this.device.getUniqueDeviceId());
        this.setUserId(this.authProvider.getEmployeeId());
        this.addCustomDimension(AnalyticsDimensionIndices.DEVICE_ID, this.uniqueDeviceId);
        this.addCustomDimension(AnalyticsDimensionIndices.DEVICE_MODEL, await this.device.getDeviceName());
        this.enableExceptionReporting();
      });
    resolve(true);
  });

  enableExceptionReporting(): void {
    this.platform.ready()
      .then(() => {
        if (this.isIos()) {
          this.ga
            .startTrackerWithId(this.googleAnalyticsKey)
            .then(() => {
              this.ga.enableUncaughtExceptionReporting(true)
                .then(() => {
                })
                .catch((uncaughtError) => console.log('Error enabling uncaught exceptions', uncaughtError));
            })
            .catch((error) => console.log(`enableExceptionReporting: ${this.analyticsStartupError}`, error));
        }
      });
  }

  setCurrentPage(name: string): void {
    this.platform.ready()
      .then(() => {
        if (this.isIos()) {
          this.ga
            .startTrackerWithId(this.googleAnalyticsKey)
            .then(() => {
              this.ga.trackView(name)
                .then(() => {
                })
                .catch((pageError) => console.log('Error setting page', pageError));
            })
            .catch((error) => console.log('Error starting Google Analytics', error));
        }
      });
  }

  logEvent(category: string, event: string, label?: string, value?: number): void {
    this.platform.ready()
      .then(() => {
        if (this.isIos()) {
          this.ga
            .startTrackerWithId(this.googleAnalyticsKey)
            .then(() => {
              this.ga.trackEvent(category, event, label, value)
                .then(() => {
                })
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
            .then(() => {
            })
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
            .then(() => {
            })
            .catch((trackingError) => console.log('Error logging exception in Google Analytics', trackingError));
        })
        .catch((error) => console.log(`logException: ${this.analyticsStartupError}`, error));
    }
  }

  setUserId(userId: string): void {
    if (this.isIos()) {
      // @TODO: Consider using `createHash('sha512')` based on SonarQube suggestion.
      // This will have GA user implications
      this.uniqueUserId = createHash('sha256')
        .update(userId || 'unavailable')
        .digest('hex');
      this.ga
        .startTrackerWithId(this.googleAnalyticsKey)
        .then(() => {
          this.addCustomDimension(AnalyticsDimensionIndices.USER_ID, this.uniqueUserId);
          this.ga.setUserId(this.uniqueUserId)
            .then(() => {
            })
            .catch((idError) => console.log(`Error setting userid ${this.uniqueUserId}`, idError));
        })
        .catch((error) => console.log(`setUserId: ${this.analyticsStartupError}`, error));
    }
  }

  setDeviceId(deviceId: string): void {
    // @TODO: Consider using `createHash('sha512')` based on SonarQube suggestion.
    // This will have GA device implications
    this.uniqueDeviceId = createHash('sha256')
      .update(deviceId || 'defaultDevice')
      .digest('hex');
    this.addCustomDimension(AnalyticsDimensionIndices.DEVICE_ID, this.uniqueDeviceId);
  }

  getDiffDays(userDate: string): number {
    const today = new DateTime();
    return today.daysDiff(userDate);
  }

  getDescriptiveDate(userDate: string): string {
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
