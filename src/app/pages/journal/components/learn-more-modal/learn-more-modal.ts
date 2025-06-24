import { Component, OnInit } from '@angular/core';
import { UsefulLink } from '@dvsa/mes-config-schema/remote-config';
import { ModalController } from '@ionic/angular';
import { OpenLinkProvider } from '@providers/open-link/open-link';
import { UrlProvider } from '@providers/url/url';

@Component({
  selector: 'learn-more-modal',
  templateUrl: './learn-more-modal.html',
  styleUrls: ['./learn-more-modal.scss'],
})
export class LearnMoreModal implements OnInit {
  usefulLinks: UsefulLink[] = [];
  recallLink: UsefulLink;

  constructor(
    public modalController: ModalController,
    public openLinkProvider: OpenLinkProvider,
    private urlProvider: UrlProvider
  ) {}

  /**
   * Initializes the component by fetching useful links.
   * sets recallLink to the last index of useful links (currently the Citroën recall link)
   */
  ngOnInit() {
    this.usefulLinks = this.urlProvider.getUsefulLinks();
    this.recallLink = this.usefulLinks[this.usefulLinks.length - 1];
  }

  /**
   * Opens the open link modal & alerts user they are leaving the application
   */
  async openRecallLink() {
    await this.closeModal().then(() => {
      this.openLinkProvider.openLinkModal(this.recallLink);
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
