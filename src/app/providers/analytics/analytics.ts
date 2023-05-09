import { GoogleAnalytics } from '@awesome-cordova-plugins/google-analytics/ngx';
import { createHash } from 'crypto';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DateTime } from '@shared/helpers/date-time';
import { getEnumKeyByValue } from '@shared/helpers/enum-keys';
import { DeviceProvider } from '../device/device';
import { AppConfigProvider } from '../app-config/app-config';
import { AnalyticsDimensionIndices, AnalyticsEventCategories, IAnalyticsProvider } from './analytics.model';
import { AuthenticationProvider } from '../authentication/authentication';

declare const gtag: Function;

@Injectable()
export class AnalyticsProvider implements IAnalyticsProvider {
  googleAnalyticsKey: string = '';
  ga4Key: string = 'G-4XPD2B5Y1J';
  uniqueDeviceId: string;
  uniqueUserId: string;
  private analyticsStartupError: string = 'Error starting Google Analytics';
  private analyticsKeyError: string = 'Missing Google Analytics key';

  constructor(
    private appConfig: AppConfigProvider,
    private ga: GoogleAnalytics,
    private platform: Platform,
    private device: DeviceProvider,
    private authProvider: AuthenticationProvider,
  ) {
  }

  initialiseAnalytics = (): Promise<any> => new Promise((resolve) => {
    this.googleAnalyticsKey = this.appConfig.getAppConfig().googleAnalyticsId;
    // this.addGAScript(!this.appConfig.environmentFile?.production);
    this.addGAScript(true);
    this.platform.ready()
      .then(() => {
        this.setDeviceId(this.device.getUniqueDeviceId());
        this.setUserId(this.authProvider.getEmployeeId());
        this.addCustomDimension(AnalyticsDimensionIndices.DEVICE_ID, this.uniqueDeviceId);
        this.addCustomDimension(AnalyticsDimensionIndices.DEVICE_MODEL, this.device.getDescriptiveDeviceName());
      });
    resolve(true);
  });

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

        if (this.isIos()) {
          try {
            gtag('config', this.ga4Key, {
              send_page_view: false,
              page_title: name,
            });
          } catch (error) {
            console.error('Analytics error - setCurrentPage', error);
          }
        }
      });
  }

  logEvent(category: string, event: string, label ?: string, value?: number): void {
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
      this.ga
        .startTrackerWithId(this.googleAnalyticsKey)
        .then(() => {
          this.ga.addCustomDimension(key, value)
            .then(() => {
            })
            .catch((dimError) => console.log('Error adding custom dimension ', dimError));
        })
        .catch((error) => console.log(`addCustomDimension: ${this.analyticsStartupError}`, error));

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

    if (this.isIos()) {
      try {
        gtag('event', 'exception', {
          description: message,
          fatal,
        });
      } catch (error) {
        console.error('Analytics error - logException', error);
      }
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

    if (this.isIos()) {
      try {
        this.uniqueUserId = createHash('sha256')
          .update(userId || 'unavailable')
          .digest('hex');

        this.addCustomDimension(AnalyticsDimensionIndices.USER_ID, this.uniqueUserId);

        gtag('config', this.ga4Key, {
          send_page_view: false,
          user_id: this.uniqueUserId,
        });
      } catch (error) {
        console.log(`Analytics error - setUserId ${this.uniqueUserId}`, error);
      }
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

  private addGAScript(debugMode: boolean = false): void {
    // if (!this.ga4Key) {
    //   throw new Error(this.analyticsKeyError);
    // }
    // const gtagScript: HTMLScriptElement = document.createElement('script');
    //
    // gtagScript.async = true;
    // gtagScript.type = 'text/javascript';
    // // gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${this.ga4Key}`;
    // gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-4XPD2B5Y1J';
    //
    // document.head.prepend(gtagScript);
    //
    // gtag('config', this.ga4Key, {
    //   send_page_view: false,
    //   debugMode,
    // });

    // if (!this.googleAnalyticsKey) {
    //   throw new Error(this.analyticsKeyError);
    // }
    // const gtagScript: HTMLScriptElement = document.createElement('script');
    // gtagScript.async = true;
    // gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${this.googleAnalyticsKey}`;
    // window['dataLayer'] = window['dataLayer'] || [];
    // function gtag(...args) { window['dataLayer'].push(args); }
    // document.head.prepend(gtagScript);
    // gtag('config', this.googleAnalyticsKey, { send_page_view: false, debugMode });
  }

}

// export function gtagFactory(config) {
//   if ((window as any).gtag) {
//     return (window as any).gtag;
//   }
//
//   const script = document.createElement('script');
//
//   script.src = `https://www.googletagmanager.com/gtag/js?id=${config.targetId}`;
//   script.type = 'text/javascript';
//   script.async = true;
//
//   document.head.appendChild(script);
//
//   (window as any).dataLayer = (window as any).dataLayer || [];
//
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   function gtag(...args) {
//     // eslint-disable-next-line prefer-rest-params
//     (window as any).dataLayer.push(arguments);
//   }
//
//   gtag('js', new Date());
//
//   gtag('config', config.targetId, { send_page_view: false, ...config.configInfo });
//
//   if ('setParams' in config) {
//     gtag('set', config.setParams);
//   }
//
//   if ('moreIds' in config) {
//     config.moreIds.forEach((id) => gtag('config', id));
//   }
//
//   return (window as any).gtag = gtag;
// }
