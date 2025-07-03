import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { OpenLinkProvider } from '@providers/open-link/open-link';
import { UrlProvider } from '@providers/url/url';
import { StoreModel } from '@shared/models/store.model';
import { RecallLinkSelected, RecallModalClosed } from '@store/general/safety-recall/safety-recall.actions';

@Component({
  selector: 'learn-more-modal',
  templateUrl: './learn-more-modal.html',
  styleUrls: ['./learn-more-modal.scss'],
  imports: [IonicModule],
})
export class LearnMoreModal {
  constructor(
    public modalController: ModalController,
    public openLinkProvider: OpenLinkProvider,
    private urlProvider: UrlProvider,
    private store$: Store<StoreModel>
  ) {}

  /**
   * Opens the open link modal & alerts user they are leaving the application
   */
  async openRecallLink() {
    this.store$.dispatch(RecallLinkSelected());
    const usefulLinks = this.urlProvider.getUsefulLinks();

    await this.closeModal().then(() => {
      this.openLinkProvider.openLinkModal(usefulLinks.find((link) => link.id === 'citroen-recall'));
    });
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
