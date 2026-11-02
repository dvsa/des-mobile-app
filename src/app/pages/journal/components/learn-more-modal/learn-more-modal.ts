import { Component, Input } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonText,
  ModalController,
} from '@ionic/angular';
import { Store } from '@ngrx/store';
import { OpenLinkProvider } from '@providers/open-link/open-link';
import { UrlProvider } from '@providers/url/url';
import { StoreModel } from '@shared/models/store.model';
import { RecallLinkSelected, RecallModalClosed } from '@store/general/safety-recall/safety-recall.actions';

export const RecallLinkIds = {
  citroen: 'citroen-recall',
  ds: 'ds-recall',
  vauxhall: 'vauxhall-recall',
} as const;

export type RecallLinkId = (typeof RecallLinkIds)[keyof typeof RecallLinkIds];

@Component({
  selector: 'learn-more-modal',
  templateUrl: './learn-more-modal.html',
  styleUrls: ['./learn-more-modal.scss'],
  imports: [IonCol, IonIcon, IonGrid, IonRow, IonCardHeader, IonCard, IonText, IonCardContent, IonButton],
  standalone: true,
})
export class LearnMoreModal {
  readonly recallLinkIds = RecallLinkIds;

  @Input()
  disableSAM = false;

  constructor(
    public modalController: ModalController,
    public openLinkProvider: OpenLinkProvider,
    private urlProvider: UrlProvider,
    private store$: Store<StoreModel>
  ) {}

  /**
   * Opens the open link modal & alerts user they are leaving the application
   */
  async openRecallLink(linkId: RecallLinkId) {
    this.store$.dispatch(RecallLinkSelected());
    const usefulLinks = this.urlProvider.getUsefulLinks();

    await this.closeModal();
    await this.openLinkProvider.openLinkModal(
      usefulLinks.find((link) => link.id === linkId),
      this.disableSAM
    );
  }

  /**
   * Closes the modal.
   */
  closeModal = async (): Promise<void> => {
    this.store$.dispatch(RecallModalClosed());
    // Dismiss the modal when the close button is clicked
    await this.modalController.dismiss();
  };
}
