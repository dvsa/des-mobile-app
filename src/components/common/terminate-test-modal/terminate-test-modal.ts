import { Component, Input } from '@angular/core';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';

@Component({
  selector: 'terminate-test-modal',
  templateUrl: './terminate-test-modal.html',
  styleUrls: ['./terminate-test-modal.scss'],
  standalone: false,
})
export class TerminateTestModal {
  @Input()
  onCancel: Function;
  @Input()
  onTerminate: Function;
  @Input()
  shouldAuthenticate = true;
  @Input()
  isPracticeMode = false;

  constructor(private deviceAuthenticationProvider: DeviceAuthenticationProvider) {}

  /**
   * Fired when the termination of the test is confirmed.
   * Handles re-authentication and subsequent delegation to the onTerminate callback.
   */
  async terminationWrapper(): Promise<void> {
    if (this.shouldAuthenticate) {
      if (await this.deviceAuthenticationProvider.triggerLockScreen(this.isPracticeMode)) {
        this.onTerminate();
      }
    } else {
      this.onTerminate();
    }
    return Promise.resolve();
  }
}
