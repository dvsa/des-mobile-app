import { Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Inject, Injector } from '@angular/core';
import { OrientationType, ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { KeepAwake as Insomnia } from '@capacitor-community/keep-awake';

import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DeviceProvider } from '@providers/device/device';
import { LogHelper } from '@providers/logs/logs-helper';
import { LOGIN_PAGE } from '@pages/page-names.constants';
import { SaveLog } from '@store/logs/logs.actions';
import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { get } from 'lodash';
import { serialiseLogMessage } from '@shared/helpers/serialise-log-message';

export abstract class BasePageComponent {
  protected platform = this.injector.get(Platform);
  protected authenticationProvider = this.injector.get(AuthenticationProvider);
  public router = this.injector.get(Router);
  public deviceProvider = this.injector.get(DeviceProvider);
  public route = this.injector.get(ActivatedRoute);
  public logHelper = this.injector.get(LogHelper);
  public store$ = this.injector.get<Store<StoreModel>>(Store);

  protected constructor(
    public injector: Injector,
    @Inject(true) public loginRequired: boolean = true,
  ) {
  }

  /**
   * By calling authenticationProvider.determineAuthenticationMode(), we will set
   * authenticationProvider.inUnAuthenticatedMode to true if the user is offline.
   * This will then be used to prevent redirects to LOGIN_PAGE if the user is offline
   * Otherwise - on view entry route the user to LOGIN_PAGE if their token is invalid,
   * and they are online
   //
   */
  ionViewWillEnter() {
    if (this.isIos()) {
      this.authenticationProvider
        .hasValidToken()
        .then(async (hasValidToken) => {
          if (this.loginRequired && !hasValidToken && !this.authenticationProvider.isInUnAuthenticatedMode()) {
            const navigationExtras: NavigationExtras = {
              replaceUrl: true,
              state: {
                hasLoggedOut: false,
                invalidToken: true,
              },
            };
            await this.router.navigate([LOGIN_PAGE], navigationExtras);
          }
        });
    }
  }

  isIos(): boolean {
    return this.platform.is('cordova');
  }

  async logout(): Promise<void> {
    if (this.isIos()) {
      try {
        await this.authenticationProvider.logout();
      } catch (error) {
        this.authenticationProvider.onLogoutError(error);
      } finally {
        const navigationExtras: NavigationExtras = {
          replaceUrl: true,
          state: {
            hasLoggedOut: true,
          },
        };
        await this.router.navigate([LOGIN_PAGE], navigationExtras);
      }
    }
  }

  async lockDevice(isPracticeMode: boolean = false): Promise<void> {
    if (this.isIos()) {
      try {
        await ScreenOrientation.lock({ type: OrientationType.PORTRAIT_PRIMARY });
        await Insomnia.keepAwake();

        if (!isPracticeMode) {
          await this.deviceProvider.enableSingleAppMode();
        }
      } catch (err) {
        this.reportLog('lockDevice', err);
      }
    }
  }

  async unlockDevice(): Promise<void> {
    if (this.isIos()) {
      try {
        await this.deviceProvider.disableSingleAppMode();

        const isEnabled = await this.deviceProvider.isSAMEnabled();

        if (!isEnabled) {
          await ScreenOrientation.unlock();
          await Insomnia.allowSleep();
        }
      } catch (err) {
        this.reportLog('unlockDevice', err);
      }
    }
  }

  private reportLog = (method: string, error: unknown): void => {
    const page = get(this.route.snapshot, '_routerState.url', 'Unknown Page');

    this.store$.dispatch(SaveLog({
      payload: this.logHelper.createLog(
        LogType.ERROR,
        `BasePageComponent => ${page} => ${method}`,
        serialiseLogMessage(error),
      ),
    }));
  };

}
