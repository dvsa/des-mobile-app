import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppLauncher } from '@capacitor/app-launcher';
import { ModalController } from '@ionic/angular';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { DeviceProvider } from '@providers/device/device';

@Component({
  selector: 'exit-sam-button',
  templateUrl: './exit-sam-button.html',
  styleUrls: ['./exit-sam-button.scss'],
})
export class ExitSamButton {
  constructor(
    public deviceProvider: DeviceProvider,
    public modalController: ModalController,
    public accessibilityService: AccessibilityService
  ) {}

  @Input()
  isButtonActive = false;

  @Output()
  escapeSamButtonClicked = new EventEmitter<boolean>();

  timeToHold = 1000;
  isPressed = false;
  timeout: NodeJS.Timeout;

  onTouchStart() {
    this.isPressed = true;

    if (this.isButtonActive) {
      this.timeout = setTimeout(async () => {
        if (this.isPressed) {
          await this.disableSAMAndExit();
        }
      }, this.timeToHold);
    }
  }

  onTouchEnd() {
    this.isPressed = false;
    clearTimeout(this.timeout);
  }

  onClick() {
    this.isButtonActive = true;
    this.escapeSamButtonClicked.emit(this.isButtonActive);
  }

  async disableSAMAndExit() {
    this.isButtonActive = false;
    this.escapeSamButtonClicked.emit(this.isButtonActive);
    //disable single app mode
    await this.deviceProvider.disableSingleAppMode();
    try {
      // Go to teams
      await AppLauncher.openUrl({ url: 'msteams://teams.microsoft.com' });
      // Go to settings
      // await AppLauncher.openUrl({ url: 'App-prefs://' });
    } catch (e) {
      console.log(e);
    }
  }
}
