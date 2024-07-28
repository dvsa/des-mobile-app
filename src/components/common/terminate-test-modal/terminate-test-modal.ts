import { Component } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';

@Component({
  selector: 'terminate-test-modal',
  templateUrl: './terminate-test-modal.html',
  styleUrls: ['./terminate-test-modal.scss'],
})
export class TerminateTestModal {
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
