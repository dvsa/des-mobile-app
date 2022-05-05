import { createHash } from 'crypto';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DateTime } from '@shared/helpers/date-time';
import { getEnumKeyByValue } from '@shared/helpers/enum-keys';

import { DeviceProvider } from '../device/device';
import { AppConfigProvider } from '../app-config/app-config';
import { IAnalyticsProvider, AnalyticsEventCategories, AnalyticsDimensionIndices } from './analytics.model';
import { AuthenticationProvider } from '../authentication/authentication';

declare const gtag: Function;

@Injectable()
export class AnalyticsProvider implements IAnalyticsProvider {
  private analyticsKeyError: string = 'Missing Google Analytics key';
  googleAnalyticsKey: string = '';
  uniqueDeviceId: string;
  uniqueUserId: string;

  constructor(
    private appConfig: AppConfigProvider,
    private platform: Platform,
    private device: DeviceProvider,
    private authProvider: AuthenticationProvider,
  ) { }

  initialiseAnalytics = (): Promise<any> => new Promise((resolve) => {
    this.googleAnalyticsKey = this.appConfig.getAppConfig().googleAnalyticsId;
    this.addGAScript(!this.appConfig.environmentFile?.production);
    this.platform.ready().then(() => {
      this.setDeviceId(this.device.getUniqueDeviceId());
      this.setUserId(this.authProvider.getEmployeeId());
      this.addCustomDimension(AnalyticsDimensionIndices.DEVICE_ID, this.uniqueDeviceId);
    });
    resolve(true);
  });

  setCurrentPage(name: string): void {
    this.platform.ready().then(() => {
      if (this.isIos()) {
        try {
          gtag('config', this.googleAnalyticsKey, { send_page_view: false, page_title: name });
        } catch (error) {
          console.error('Analytics error - setCurrentPage', error);
        }
      }
    });
  }

  logEvent(category: string, event: string, label ?: string, value? : number): void {
    this.platform.ready().then(() => {
      if (this.isIos()) {
        try {
          gtag('event', event, {
            event_category: category,
            event_label: label,
            value,
          });
        } catch (error) {
          console.error('Analytics error - logEvent', error);
        }
      }
    });
  }

  addCustomDimension(key: number, value: string): void {
    if (this.isIos()) {
      try {
        const [dimension] = getEnumKeyByValue(AnalyticsDimensionIndices, key);
        gtag('event', dimension, { key: value });
      } catch (error) {
        console.error('Analytics error - addCustomDimension', error);
      }
    }
  }

  logError(type: string, message: string): void {
    this.logEvent(AnalyticsEventCategories.ERROR, type, message);
  }

  logException(message: string, fatal: boolean): void {
    if (this.isIos()) {
      try {
        gtag('event', 'exception', { description: message, fatal });
      } catch (error) {
        console.error('Analytics error - logException', error);
      }
    }
  }

  setUserId(userId: string): void {
    if (this.isIos()) {
      try {
        this.uniqueUserId = createHash('sha256').update(userId || 'unavailable').digest('hex');
        this.addCustomDimension(AnalyticsDimensionIndices.USER_ID, this.uniqueUserId);
        gtag('config', this.googleAnalyticsKey, { send_page_view: false, user_id: this.uniqueUserId });
      } catch (error) {
        console.log(`Analytics error - setUserId ${this.uniqueUserId}`, error);
      }
    }
  }

  setDeviceId(deviceId: string): void {
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

  private addGAScript(debugMode: boolean = false): void {
    if (!this.googleAnalyticsKey) {
      throw new Error(this.analyticsKeyError);
    }
    const gtagScript: HTMLScriptElement = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${this.googleAnalyticsKey}`;
    document.head.prepend(gtagScript);
    gtag('config', this.googleAnalyticsKey, { send_page_view: false, debugMode });
  }

}
