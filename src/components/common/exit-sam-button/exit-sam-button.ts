import { Component } from '@angular/core';
import { AppLauncher } from '@capacitor/app-launcher';
import { ExitSAMModalEvent, ExitSamModal } from '@components/common/exit-sam-modal/exit-sam-modal';
import { ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
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

  timeToHold = 1000;
  isPressed = false;

  onTouchStart() {
    this.isPressed = true;

    setTimeout(async () => {
      if (this.isPressed) {
        await this.openConfirmationModal();
      }
    }, this.timeToHold);
  }

  onTouchEnd() {
    this.isPressed = false;
  }

  async openConfirmationModal() {
    const modal: HTMLIonModalElement = await this.modalController.create({
      id: 'exitSAMConfirmModal',
      component: ExitSamModal,
      cssClass: `${this.accessibilityService.getTextZoomClass()} mes-modal-alert`,
      backdropDismiss: false,
      showBackdrop: true,
    });
    await modal.present();
    const { data }: OverlayEventDetail = await modal.onDidDismiss<ExitSAMModalEvent>();
    console.log(data.event);
    if (data.event === ExitSAMModalEvent.EXIT) {
      await this.disableSAMAndExit();
    }
  }

  async disableSAMAndExit() {
    //disable single app mode
    await this.deviceProvider.disableSingleAppMode();
    try {
      // Go to teams
      await AppLauncher.openUrl({ url: 'msteams://teams.microsoft.com' });
      // Go to settings
      // await AppLauncher.openUrl({ url: 'App-prefs://'});
    } catch (e) {
      console.log(e);
    }
  }
}
