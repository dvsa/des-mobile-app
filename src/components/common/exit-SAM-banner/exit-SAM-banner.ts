import * as console from 'node:console';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppLauncher } from '@capacitor/app-launcher';
import {
  ExitSAMConfirmationModal,
  ExitSAMModalEvent,
} from '@components/common/exit-SAM-confirmation-modal/exit-SAM-confirmation-modal';
import { ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { DeviceProvider } from '@providers/device/device';
import { Observable } from 'rxjs';

@Component({
  selector: 'exit-SAM-banner',
  templateUrl: 'exit-SAM-banner.html',
  styleUrls: ['exit-SAM-banner.scss'],
})
export class ExitSAMBannerComponent {
  @Input()
  practiceJournal = false;

  public displayMsg$: Observable<string>;

  constructor(
    public router: Router,
    public deviceProvider: DeviceProvider,
    public modalController: ModalController,
    public accessibilityService: AccessibilityService
  ) {}

  async callConfirmModal() {
    const modal: HTMLIonModalElement = await this.modalController.create({
      id: 'exitSamModal',
      component: ExitSAMConfirmationModal,
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
    console.log('leaving SAM');
    await this.deviceProvider.disableSingleAppMode();
    try {
      // Go to teams
      await AppLauncher.openUrl({ url: 'msteams://teams.microsoft.com' });
      // Go to settings
      // await AppLauncher.openUrl({ url: 'App-prefs://'});
    } catch (e) {}
  }
}
