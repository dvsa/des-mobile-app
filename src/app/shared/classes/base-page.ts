import { Inject, Injector } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { KeepAwake as Insomnia } from '@capacitor-community/keep-awake';
import { OrientationType, ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';

import { ExitSamError, ExitSAMUserReturned } from '@components/common/test-flow-header/exit-sam.actions';
import { LOGIN_PAGE } from '@pages/page-names.constants';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DeviceProvider } from '@providers/device/device';
import { LogHelper } from '@providers/logs/logs-helper';
import { serialiseLogMessage } from '@shared/helpers/serialise-log-message';
import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { SaveLog } from '@store/logs/logs.actions';
import { SetHasExitedApp } from '@store/tests/user-exited-app/user-exited-app.actions';
import { get } from 'lodash-es';
import { Subscription } from 'rxjs';

export abstract class BasePageComponent {
  protected platform = this.injector.get(Platform);
  protected authenticationProvider = this.injector.get(AuthenticationProvider);
  public router = this.injector.get(Router);
  public deviceProvider = this.injector.get(DeviceProvider);
  public route = this.injector.get(ActivatedRoute);
  public logHelper = this.injector.get(LogHelper);
  public store$ = this.injector.get<Store<StoreModel>>(Store);

  public isExitSAMBannerActivated = false;
  public returnToAppSubscription: Subscription = null;
  public leaveAppSubscription: Subscription = null;

  protected constructor(
    public injector: Injector,
    @Inject(true) public loginRequired = true
  ) {}

  /**
   * Re-enables single app mode to lock the user back in when they come back.
   * Dispatches an error action if enabling single app mode fails.
   *
   * @returns {Promise<void>}
   */
  async reEnableSingleAppMode(): Promise<void> {
    try {
      // Re-enable single app mode to lock the user back in when they come back
      const didEnable = await this.deviceProvider.enableSingleAppMode();

      if (!didEnable) {
        this.store$.dispatch(ExitSamError('Could not enable single app mode', didEnable));
      }
    } catch (e) {
      this.store$.dispatch(ExitSamError('Enable single app mode error', e));
    }
  }

  leaveSubscriptionFunction = async () => {
    // If the user leaves the app, we want to set up a subscription to the resume event to listen for the user returns
    this.setupEscapeSAMResumeSubscription();
    // Destroy the subscription to prevent memory leaks and locking the user in every time they return to the app
    this.destroyLeaveAppSubscription();
  };

  resumeSubscriptionFunction = async () => {
    this.store$.dispatch(ExitSAMUserReturned());
    // Re-enable single app mode to lock the user back in when they come back
    await this.reEnableSingleAppMode();
    // Destroy the subscription to prevent memory leaks and locking the user in every time they return to the app
    this.destroyReturnToAppSubscription();
  };

  /**
   * Sets up a subscription to the platform pause event.
   * When the app is paused, sets up a subscription to the resume event and destroys the pause subscription.
   */
  setupEscapeSAMLeaveSubscription() {
    if (!this.leaveAppSubscription) {
      //If there isn't one already, we want to set up a subscription to listen for the user pauses
      this.leaveAppSubscription = this.platform.pause.subscribe(this.leaveSubscriptionFunction);
    }
  }

  /**
   * Sets up a subscription to the platform resume event.
   * When the app is resumed, dispatches an action indicating the user has returned,
   * re-enables single app mode, and destroys the resume subscription.
   */
  setupEscapeSAMResumeSubscription() {
    if (!this.returnToAppSubscription) {
      //If there isn't one already, we want to set up a subscription to listen for the user returns
      this.returnToAppSubscription = this.platform.resume.subscribe(this.resumeSubscriptionFunction);
    }
  }

  /**
   * Destroys the subscription to the platform resume event.
   */
  destroyReturnToAppSubscription() {
    if (this.returnToAppSubscription) {
      this.returnToAppSubscription.unsubscribe();
      this.returnToAppSubscription = null;
    }
  }

  /**
   * Destroys the subscription to the platform resume event.
   */
  destroyLeaveAppSubscription() {
    if (this.leaveAppSubscription) {
      this.leaveAppSubscription.unsubscribe();
      this.leaveAppSubscription = null;
    }
  }

  ionViewDidLeave() {
    /**
     If leaveAppSubscription is active, it means the user attempted to escape SAM but did not actually
     leave the app. We need to re-enable single app mode to lock the user back in
     and destroy the subscription to prevent it from firing.
     */
    if (this.leaveAppSubscription) {
      this.reEnableSingleAppMode().then(() => {});
      this.destroyLeaveAppSubscription();
    }
    if (this.returnToAppSubscription) {
      this.destroyReturnToAppSubscription();
    }
    this.isExitSAMBannerActivated = false;
  }

  /**
   * By calling authenticationProvider.determineAuthenticationMode(), we will set
   * authenticationProvider.inUnAuthenticatedMode to true if the user is offline.
   * This will then be used to prevent redirects to LOGIN_PAGE if the user is offline
   * Otherwise - on view entry route the user to LOGIN_PAGE if their token is invalid,
   * and they are online
   */
  ionViewWillEnter() {
    if (this.isIos()) {
      // re-evaluate connectivity status
      // this.authenticationProvider.determineAuthenticationMode();

      this.authenticationProvider.hasValidToken().then(async (hasValidToken) => {
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
        this.authenticationProvider.logEvent(LogType.ERROR, error, 'Logout Failed');
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

  async lockDevice(isPracticeMode = false): Promise<void> {
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

  isSamActivatedChanged(isActive: boolean): void {
    this.isExitSAMBannerActivated = isActive;
  }

  onUsedExitSam(): void {
    this.store$.dispatch(SetHasExitedApp());
  }

  private reportLog = (method: string, error: unknown): void => {
    const page = get(this.route.snapshot, '_routerState.url', 'Unknown Page');

    this.store$.dispatch(
      SaveLog({
        payload: this.logHelper.createLog(
          LogType.ERROR,
          `BasePageComponent => ${page} => ${method}`,
          serialiseLogMessage(error)
        ),
      })
    );
  };
}
