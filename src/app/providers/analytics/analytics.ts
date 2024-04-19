import { GoogleAnalytics } from '@awesome-cordova-plugins/google-analytics/ngx';
import { createHash } from 'crypto';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DateTime } from '@shared/helpers/date-time';
import { DeviceProvider } from '../device/device';
import { AppConfigProvider } from '../app-config/app-config';
import {
  AnalyticsDimensionIndices,
  AnalyticsEventCategories,
  GoogleAnalyticsCustomDimension,
  IAnalyticsProvider,
} from './analytics.model';
import { AuthenticationProvider } from '../authentication/authentication';
import { getEnumKeyByValue } from '@shared/helpers/enum-keys';

declare const gtag: Function;

@Injectable()
export class AnalyticsProvider implements IAnalyticsProvider {
  googleAnalyticsKey: string = '';
  googleAnalytics4Key: string = '';
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
   * Initial setup for Google Analytics, setting unique user and device id
   * for all events to be tagged with for this session
   *
   */
  initialiseGoogleAnalytics = async (): Promise<void> => {
    try {
      this.googleAnalytics4Key = this.appConfig.getAppConfig()?.googleAnalyticsKey;
      await this.setGoogleTagManager(this.googleAnalytics4Key);
      await this.platform.ready();

      const employeeId = this.authProvider.getEmployeeId();
      const uniqueDeviceId = await this.device.getUniqueDeviceId();
      const deviceModel = await this.device.getDeviceName();

      this.setGAUserId(this.googleAnalytics4Key, employeeId);
      this.setGADeviceId(uniqueDeviceId);
      this.addGACustomDimension(GoogleAnalyticsCustomDimension.DEVICE_MODEL, deviceModel);
    } catch (error) {
      console.error('Analytics - Error initializing Google Analytics:', error);
    }
  };

  /**
   * Sets up Google Tag Manager with the provided Google Analytics key.
   * The resulting script has all references for capacitor replaced with https
   * to provide a workaround when traffic is blocked
   *
   * @param {string} googleAnalyticsKey
   * @returns {Promise<void>}
   */
  setGoogleTagManager = async (googleAnalyticsKey: string) => {
    try {
      const gtResponse = await (
        await fetch(`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsKey}`)
      ).text();
      if (document.location.protocol.startsWith('http')) {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        Function(gtResponse)();
      } else {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        Function(gtResponse.replaceAll('http:', 'capacitor:'))();
      }
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Sets the Google Analytics user ID and custom dimension.
   *
   * Hashes the provided user ID to create a unique user ID,
   * sets it as a custom dimension in Google Analytics, and configures Google Analytics
   * to use the unique user ID for tracking for all events by this user for this session
   *
   * @param {string} key
   * @param {string} userId
   */
  setGAUserId(key: string, userId: string): void {
    if (this.isIos()) {
      try {
        console.log('set GA user id');
        const uniqueUserId = createHash('sha256')
          .update(userId || 'unavailable')
          .digest('hex');
        console.log(`set GA user id: ${uniqueUserId}`);
        this.addGACustomDimension(GoogleAnalyticsCustomDimension.USER_ID, uniqueUserId);
        gtag('config', key, {
          send_page_view: false,
          user_id: uniqueUserId,
        });
      } catch (error) {
        console.log('Analytics - setGAUserId error', error);
      }
    }
  }

  /**
   * Sets the Google Analytics device ID custom dimension.
   * Generates a unique device ID based on the provided device ID or a default value.
   *
   * @param {string} deviceId
   */
  setGADeviceId(deviceId: string): void {
    const uniqueDeviceId = createHash('sha256')
      .update(deviceId || 'defaultDevice')
      .digest('hex');
    this.addGACustomDimension(GoogleAnalyticsCustomDimension.DEVICE_ID, uniqueDeviceId);
  }

  /**
   * Adds a custom dimension for Google Analytics.
   * Custom events need to exist in the analytic dimension enum
   *
   * @param {number} key - The key representing the custom dimension index.
   * @param {string} value - The value to be associated with the custom dimension.
   */
  addGACustomDimension(key: GoogleAnalyticsCustomDimension, value: string): void {
    if (this.isIos()) {
      try {
        // const [dimension] = getEnumKeyByValue(AnalyticsDimensionIndices, key);
        if (key) { // Guard to check if dimension is not undefined or null
          gtag('set', 'user_properties', { [key]: value });
        } else {
          console.error('Analytics - addGACustomDimension: Dimension not found for key', key);
        }
      } catch (error) {
        console.error('Analytics - addGACustomDimension', error);
      }
    }
  }

  /**
   * Sets the current page for Google Analytics
   *
   * @param {string} pageName - The name of the current page to track.
   */
  setGACurrentPage(pageName: string): void {
    if (this.isIos()) {
      try {
        console.log(`Analytics - set page: ${pageName}`);
        gtag('config', this.googleAnalytics4Key, {
          page_title: pageName,
        });
      } catch (error) {
        console.error('Analytics - setGACurrentPage', error);
      }
    }
  }

  /**
   * Call gtag analyics function with an event with optional key value pairs for up
   * to 3 pairs of additional information.
   * @param eventName
   * @param title1
   * @param value1
   * @param title2
   * @param value2
   * @param title3
   * @param value3
   */
  logGAEvent(eventName: string, title1?: string, value1?: string,
    title2?: string, value2?: string, title3?: string, value3?: string,
  ): void {
    this.platform.ready()
      .then(() => {
        if (this.isIos()) {
          try {
            const eventData: { [key: string]: string } = {};

            // Conditionally include title1 and value1
            if (title1 && value1) {
              eventData[title1] = value1;
            }

            // Conditionally include title2 and value2
            if (title2 && value2) {
              eventData[title2] = value2;
            }

            // Conditionally include title3 and value3
            if (title3 && value3) {
              eventData[title3] = value3;
            }

            gtag('event', eventName, eventData);
          } catch (error) {
            console.error('Analytics - logEvent', error);
          }
        }
      });
  }

  /**
   * Record a GA4 event as a generic error
   * @param type
   * @param message
   */
  logGAError(type: string, message: string): void {
    this.logGAEvent(type, AnalyticsEventCategories.ERROR, message);
  }

  /**
   * Record a GA4 event as a validation error
   * @param type
   * @param message
   */
  logGAValidationError(type: string, message: string): void {
    this.logGAEvent(type, AnalyticsEventCategories.VALIDATION_ERROR, message);
  }

  // TODO - MES-9495 - remove old analytics
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

  // TODO - MES-9495 - remove old analytics
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

  // TODO - MES-9495 - remove old analytics
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

  // TODO - MES-9495 - remove old analytics
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

  // TODO - MES-9495 - remove old analytics
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

  // TODO - MES-9495 - remove old analytics
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

  // TODO - MES-9495 - remove old analytics
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
