import { Component } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';

@Component({
  selector: 'terminate-test-modal',
  templateUrl: './change-start-end-time-modal.html',
  styleUrls: ['./change-start-end-time-modal.scss'],
})
export class ChangeStartEndTimeModal {
  onCancel: Function;

  onTerminate: Function;

  shouldAuthenticate = true;
  isPracticeMode = false;

  constructor(
    private navParams: NavParams,
    private deviceAuthenticationProvider: DeviceAuthenticationProvider
  ) {
    this.onCancel = this.navParams.get('onCancel');
    this.onTerminate = this.navParams.get('onTerminate');
    this.shouldAuthenticate = this.navParams.get('shouldAuthenticate');
    this.isPracticeMode = this.navParams.get('isPracticeMode');
  }

  /**
   * Fired when the termination of the test is confirmed.
   * Handles re-authentication and subsequent delegation to the onTerminate callback.
   */
  terminationWrapper(): Promise<void> {
    if (this.shouldAuthenticate) {
      return this.deviceAuthenticationProvider
        .triggerLockScreen(this.isPracticeMode)
        .then(() => {
          this.onTerminate();
        })
        .catch((err) => err);
    }
    this.onTerminate();
    return Promise.resolve();
  }
}
