import { Component, EventEmitter, Output } from '@angular/core';
import { AppLauncher } from '@capacitor/app-launcher';
import { ModalController } from '@ionic/angular';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { DeviceProvider } from '@providers/device/device';

@Component({
  selector: 'exit-sam-banner',
  templateUrl: './exit-sam-banner.html',
  styleUrls: ['./exit-sam-banner.scss'],
})
export class ExitSamBanner {
  constructor(
    public deviceProvider: DeviceProvider,
    public modalController: ModalController,
    public accessibilityService: AccessibilityService
  ) {}

  @Output()
  cancelClicked = new EventEmitter<void>();

  timeToHold = 1000;
  isPressed = false;

  onTouchStart() {
    this.isPressed = true;

    setTimeout(async () => {
      if (this.isPressed) {
        await this.disableSAMAndExit();
      }
    }, this.timeToHold);
  }

  onTouchEnd() {
    this.isPressed = false;
  }

  cancelButtonClicked() {
    this.cancelClicked.emit();
  }

  async disableSAMAndExit() {
    //disable single app mode
    await this.deviceProvider.disableSingleAppMode();
    try {
      // Go to teams
      // await AppLauncher.openUrl({ url: 'msteams://teams.microsoft.com' });
      // Go to settings
      await AppLauncher.openUrl({ url: 'App-prefs://' });
    } catch (e) {
      console.log(e);
    }
  }
}
