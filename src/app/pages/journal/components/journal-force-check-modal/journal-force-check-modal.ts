import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CandidateDetailsPage } from '@pages/candidate-details/candidate-details.page';
import { CANDIDATE_DETAILS_PAGE, JOURNAL_FORCE_CHECK_MODAL } from '@pages/page-names.constants';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { ModalEvent } from './journal-force-check-modal.constants';

@Component({
  selector: 'journal-force-check-modal',
  templateUrl: './journal-force-check-modal.html',
  styleUrls: ['./journal-force-check-modal.scss'],
})
export class JournalForceCheckModal {

  @Input()
  slot: TestSlot;

  @Input()
  slotChanged: boolean;

  @Input()
  isTeamJournal: boolean;

  @Input()
  textZoomClass: string;

  constructor(
    private modalController: ModalController,
  ) { }

  onCancel = async (): Promise<void> => {
    await this.modalController.dismiss(ModalEvent.CANCEL);
  };

  async openCandidateDetailsModal() {
    // Modals are at the same level as the ion-nav so are not getting the zoom level class,
    // this needs to be passed in the create options.
    const zoomClass = `modal-fullscreen ${this.textZoomClass}`;
    const profileModal = await this.modalController.create({
      component: CandidateDetailsPage,
      id: CANDIDATE_DETAILS_PAGE,
      cssClass: zoomClass,
      componentProps: {
        slot: this.slot,
        slotChanged: this.slotChanged,
        isTeamJournal: this.isTeamJournal,
      },
    });
    await profileModal.present();
    const dismiss = await profileModal.onWillDismiss();
    if (dismiss) await this.modalController.dismiss(ModalEvent.CANCEL, null, JOURNAL_FORCE_CHECK_MODAL);
  }
}
