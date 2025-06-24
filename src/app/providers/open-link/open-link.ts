import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UsefulLink } from '@dvsa/mes-config-schema/remote-config';
import { Store } from '@ngrx/store';
import { UsefulLinkSelected } from '@pages/useful-links/useful-links.actions';
import { LinkModalComponent } from '@pages/useful-links/components/link-modal/link-modal.component';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';

@Injectable({
  providedIn: 'root',
})
export class OpenLinkProvider {
  constructor(
    private modalController: ModalController,
    private accessibilityService: AccessibilityService,
    private store$: Store,
  ) {}

  // /**
  //  * Opens the link modal
  //  * Dispatches the action to set the selected link, it determines this by appending the word Selected to the action name
  //  * @param link
  //  */
  async openLinkModal(link: UsefulLink): Promise<void> {
    const displayText = link.displayText.replace(/ /g, '_');
    this.store$.dispatch(UsefulLinkSelected(displayText));
    const modal: HTMLIonModalElement = await this.modalController.create({
      id: 'linkModal',
      component: LinkModalComponent,
      componentProps: { link },
      cssClass: `${this.accessibilityService.getTextZoomClass()} mes-modal-alert`,
      backdropDismiss: false,
      showBackdrop: true,
    });
    await modal.present();
  }
}
