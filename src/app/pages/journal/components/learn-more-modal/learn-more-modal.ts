import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OpenLinkProvider } from '@providers/open-link/open-link';
import { UrlProvider } from '@providers/url/url';

@Component({
  selector: 'learn-more-modal',
  templateUrl: './learn-more-modal.html',
  styleUrls: ['./learn-more-modal.scss'],
})
export class LearnMoreModal {
  constructor(
    public modalController: ModalController,
    public openLinkProvider: OpenLinkProvider,
    private urlProvider: UrlProvider
  ) {}

  /**
   * Opens the open link modal & alerts user they are leaving the application
   */
  async openRecallLink() {
    const usefulLinks = this.urlProvider.getUsefulLinks();

    await this.closeModal().then(() => {
      this.openLinkProvider.openLinkModal(usefulLinks.find((link) => link.id === 'citroen-recall'));
    });
  }

  /**
   * Closes the modal.
   */
  closeModal = async (): Promise<void> => {
    // Dismiss the modal when the close button is clicked
    await this.modalController.dismiss();
  };
}
