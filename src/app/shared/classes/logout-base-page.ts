import { Injector } from '@angular/core';
import { LogoutModal, LogoutModalEvent } from '@components/common/logout-modal/logout-modal';
import { ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { BasePageComponent } from './base-page';

export abstract class LogoutBasePageComponent extends BasePageComponent {
  protected modalController = this.injector.get(ModalController);
  protected accessibilityService = this.injector.get(AccessibilityService);

  protected constructor(injector: Injector) {
    super(injector);
  }

  async openLogoutModal() {
    const modal: HTMLIonModalElement = await this.modalController.create({
      id: 'logOutModal',
      component: LogoutModal,
      cssClass: `${this.accessibilityService.getTextZoomClass()} mes-modal-alert`,
      backdropDismiss: false,
      showBackdrop: true,
    });
    await modal.present();
    const { data }: OverlayEventDetail = await modal.onDidDismiss<LogoutModalEvent>();
    console.log(data.event);
    if (data.event === LogoutModalEvent.LOGOUT) {
      await this.logout();
    }
  }
}
