import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { LearnMoreModal } from '@pages/journal/components/learn-more-modal/learn-more-modal';
import { LEARN_MORE_MODAL } from '@pages/page-names.constants';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';

@Component({
  selector: 'vehicle-recalls-banner',
  templateUrl: 'vehicle-recalls-banner.html',
  styleUrls: ['vehicle-recalls-banner.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class VehicleRecallsBanner {
  constructor(
    public modalController: ModalController,
    private accessibilityService: AccessibilityService
  ) {}

  async openLearnMoreModal() {
    const zoomClass = `mes-modal-alert ${this.accessibilityService.getTextZoomClass()}`;
    const learnMoreModal = await this.modalController.create({
      component: LearnMoreModal,
      id: LEARN_MORE_MODAL,
      cssClass: zoomClass,
    });
    await learnMoreModal.present();
  }
}
