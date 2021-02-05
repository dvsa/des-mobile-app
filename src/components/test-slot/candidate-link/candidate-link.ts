import { Component, Input } from '@angular/core';
import { Name } from '@dvsa/mes-journal-schema';
import { ModalController } from '@ionic/angular';
import { AppComponent } from '../../../app/app.component';
import { CandidateDetailsPage } from '../../../app/pages/candidate-details/candidate-details.page';

@Component({
  selector: 'candidate-link',
  templateUrl: 'candidate-link.html',
  styleUrls: ['candidate-link.scss'],
})
export class CandidateLinkComponent {
  @Input()
  slot: any;

  @Input()
  slotChanged: boolean;

  @Input()
  name: Name;

  @Input()
  testComplete: boolean;

  @Input()
  isPortrait: boolean;

  constructor(public modalController: ModalController, private app: AppComponent) {
  }

  async openCandidateDetailsModal() {

    // Modals are at the same level as the ion-nav so are not getting the zoom level class,
    // this needs to be passed in the create options.
    const zoomClass = `modal-fullscreen ${this.app.getTextZoomClass()}`;
    const profileModal = await this.modalController.create({
      component: CandidateDetailsPage,
      cssClass: zoomClass,
      componentProps: {
        slot: this.slot,
        slotChanged: this.slotChanged,
      },
    });
    await profileModal.present();
  }
}
