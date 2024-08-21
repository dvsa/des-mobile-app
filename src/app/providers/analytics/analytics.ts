import { createHash } from 'crypto';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AppInfoProvider } from '@providers/app-info/app-info';
import { DateTime } from '@shared/helpers/date-time';
import { AppConfigProvider } from '../app-config/app-config';
import { AuthenticationProvider } from '../authentication/authentication';
import { DeviceProvider } from '../device/device';
import { AnalyticsEventCategories, GoogleAnalyticsCustomDimension } from './analytics.model';

declare const gtag: Function;

@Injectable()
export class AnalyticsProvider {
  googleAnalytics4Key = '';
  uniqueDeviceId: string;
  uniqueUserId: string;

  constructor(
    private appConfig: AppConfigProvider,
    private platform: Platform,
    private device: DeviceProvider,
    private authProvider: AuthenticationProvider,
    protected appInfo: AppInfoProvider
  ) {}

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

      const employeeId = createHash('sha256')
        .update(this.authProvider.getEmployeeId() || 'unavailable')
        .digest('hex');
      const uniqueDeviceId = await this.device.getUniqueDeviceId();
      const deviceModel = await this.device.getDeviceName();
      const appVersion: string = await this.appInfo.getFullVersionNumber();

      this.setGAGlobalConfig(this.googleAnalytics4Key, employeeId);
      this.setGAUserId(employeeId);
      this.setGADeviceId(uniqueDeviceId);
      this.addGACustomDimension(GoogleAnalyticsCustomDimension.DEVICE_MODEL, deviceModel);
      this.addGACustomDimension(GoogleAnalyticsCustomDimension.APP_VERSION, appVersion);
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
   * Sets the Google Analytics global configuration for the provided key.
   * Disables the default page view tracking for all events by this user for this session.
   *
   * @param {string} key - The Google Analytics key to set the global configuration for.
   * @param {string} userId
   */
  setGAGlobalConfig(key: string, userId: string): void {
    if (this.isIos()) {
      try {
        gtag('config', key, {
          send_page_view: false,
          user_id: userId,
        });
      } catch (error) {
        console.log('Analytics - setGAGlobalConfig error', error);
      }
    }
  }

  /**
   * Sets the Google Analytics user ID custom dimension.
   * @param userId
   */
  setGAUserId(userId: string): void {
    if (this.isIos()) {
      try {
        this.addGACustomDimension(GoogleAnalyticsCustomDimension.USER_ID, userId);
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
   *
   * @param {number} key - The key representing the custom dimension index.
   * @param {string} value - The value to be associated with the custom dimension.
   */
  addGACustomDimension(key: GoogleAnalyticsCustomDimension, value: string): void {
    if (this.isIos()) {
      try {
        if (key) {
          // Guard to check if dimension is not undefined or null
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
  logGAEvent(
    eventName: string,
    title1?: string,
    value1?: string,
    title2?: string,
    value2?: string,
    title3?: string,
    value3?: string
  ): void {
    this.platform.ready().then(() => {
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
