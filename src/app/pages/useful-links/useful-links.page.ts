import { Component, Injector, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LinkModalComponent } from '@pages/useful-links/components/link-modal/link-modal.component';
import * as UsefulLinkActions from '@pages/useful-links/useful-links.actions';
import { UsefulLinkNames } from '@pages/useful-links/useful-links.model';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { UrlProvider } from '@providers/url/url';
import { BasePageComponent } from '@shared/classes/base-page';

@Component({
  selector: 'useful-links',
  templateUrl: 'useful-links.page.html',
  styleUrls: ['useful-links.page.scss'],
})
export class UsefulLinksPage extends BasePageComponent implements OnInit {
  usefulLinks: Array<{ name: string; url: string; actionName: string }> = [];

  constructor(
    public accessibilityService: AccessibilityService,
    public orientationMonitorProvider: OrientationMonitorProvider,
    public modalController: ModalController,
    private urlProvider: UrlProvider,
    injector: Injector
  ) {
    super(injector);
  }
  protected readonly alert = alert;

  ngOnInit() {
    this.usefulLinks = Object.entries(this.urlProvider.getUsefulLinks()).map(([name, url]) => ({
      name: UsefulLinkNames[name],
      url,
      actionName: UsefulLinkNames[name].replace(/ /g, ''),
    }));
  }

  /**
   * Opens the link modal
   * Dispatches the action to set the selected link, it determines this by appending the word Selected to the action name
   * @param link
   * @param actionName
   */
  async openLinkModal(link: string, actionName: string) {
    this.store$.dispatch(UsefulLinkActions[`${actionName}Selected`]());
    const modal: HTMLIonModalElement = await this.modalController.create({
      id: 'linkModal',
      component: LinkModalComponent,
      componentProps: {
        link,
        actionName,
      },
      cssClass: `${this.accessibilityService.getTextZoomClass()} mes-modal-alert`,
      backdropDismiss: false,
      showBackdrop: true,
    });
    await modal.present();
  }
}
