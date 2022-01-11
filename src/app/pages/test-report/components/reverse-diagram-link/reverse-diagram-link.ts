import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { AppComponent } from '@app/app.component';
import { ReverseDiagramPage } from '@pages/test-report/components/reverse-diagram-modal/reverse-diagram-modal';
import {
  ReverseDiagramClosed,
  ReverseDiagramOpened,
} from '../reverse-diagram-modal/reverse-diagram-modal.actions';

@Component({
  selector: 'reverse-diagram-link',
  templateUrl: 'reverse-diagram-link.html',
  styleUrls: ['reverse-diagram-link.scss'],
})
export class ReverseDiagramLinkComponent {

  constructor(
    public modalController: ModalController,
    private app: AppComponent,
    private store$: Store<StoreModel>,
  ) {}

  async openReverseDiagramModal(): Promise<void> {
    this.store$.dispatch(ReverseDiagramOpened());

    const reverseDiagramModal = await this.modalController.create({
      component: ReverseDiagramPage,
      componentProps: { onClose: async () => this.modalController.dismiss() },
      cssClass: `modal-fullscreen ${this.app.getTextZoomClass()}`,
    });
    await reverseDiagramModal.present();
    const didDismiss = await reverseDiagramModal.onDidDismiss();

    if (didDismiss) {
      this.closeReverseDiagramModal();
    }
  }

  closeReverseDiagramModal(): void {
    this.store$.dispatch(ReverseDiagramClosed());
  }
}
