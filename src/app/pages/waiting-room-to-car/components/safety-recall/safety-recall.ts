import { Component } from '@angular/core';
import { IonButton, IonCol, IonRow, IonText, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { LearnMoreModal } from '@pages/journal/components/learn-more-modal/learn-more-modal';
import { LEARN_MORE_MODAL } from '@pages/page-names.constants';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { StoreModel } from '@shared/models/store.model';
import { CheckVINPressed } from '@store/general/safety-recall/safety-recall.actions';

@Component({
  selector: 'safety-recall',
  templateUrl: './safety-recall.html',
  styleUrls: ['./safety-recall.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonText, IonButton],
})
export class SafetyRecallComponent {
  constructor(
    public modalController: ModalController,
    private accessibilityService: AccessibilityService,
    private store$: Store<StoreModel>
  ) {}

  async checkRecall(): Promise<void> {
    this.store$.dispatch(CheckVINPressed());
    const zoomClass = `mes-modal-alert ${this.accessibilityService.getTextZoomClass()}`;
    const learnMoreModal = await this.modalController.create({
      component: LearnMoreModal,
      componentProps: { disableSAM: true },
      id: LEARN_MORE_MODAL,
      cssClass: zoomClass,
    });
    await learnMoreModal.present();
  }
}
