import { Component, Input } from '@angular/core';
import { Name, TestSlot } from '@dvsa/mes-journal-schema';
import { ModalController } from '@ionic/angular';
import { CandidateDetailsPage } from '@pages/candidate-details/candidate-details.page';
import { AppComponent } from '@app/app.component';

@Component({
  selector: 'candidate-link',
  templateUrl: 'candidate-link.html',
  styleUrls: ['candidate-link.scss'],
})
export class CandidateLinkComponent {
  @Input()
  slot: TestSlot;

  @Input()
  slotChanged: boolean;

  @Input()
  isPracticeMode: boolean;

  @Input()
  name: Name;

  @Input()
  isTeamJournal: boolean = false;

  @Input()
  applicationId: number;

  @Input()
  testComplete: boolean;

  @Input()
  isPortrait: boolean;

  constructor(
    public modalController: ModalController,
    public app: AppComponent,
  ) {
  }

  async openCandidateDetailsModal(): Promise<void> {
    if (await this.modalController.getTop()) {
      // stop double clicks spawning multiple modals;
      return;
    }

    // Modals are at the same level as the ion-nav so are not getting the zoom level class,
    // this needs to be passed in the create options.
    const zoomClass = `modal-fullscreen ${this.app.getTextZoomClass()}`;
    const profileModal = await this.modalController.create({
      component: CandidateDetailsPage,
      cssClass: zoomClass,
      componentProps: {
        isPracticeMode: this.isPracticeMode,
        slot: this.slot,
        slotChanged: this.slotChanged,
        isTeamJournal: this.isTeamJournal,
      },
    });
    await profileModal.present();
  }
}
