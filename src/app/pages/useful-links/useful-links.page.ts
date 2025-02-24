import { Component, Injector, OnInit } from '@angular/core';
import { UsefulLink } from '@dvsa/mes-config-schema/remote-config';
import { ModalController } from '@ionic/angular';
import { DASHBOARD_PAGE } from '@pages/page-names.constants';
import { LinkModalComponent } from '@pages/useful-links/components/link-modal/link-modal.component';
import * as UsefulLinkActions from '@pages/useful-links/useful-links.actions';
import { UsefulLinksReturnToDashboardPressed } from '@pages/useful-links/useful-links.actions';
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
  usefulLinks: UsefulLink[] = [];

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
    this.usefulLinks = this.urlProvider.getUsefulLinks();
  }

  /**
   * Opens the link modal
   * Dispatches the action to set the selected link, it determines this by appending the word Selected to the action name
   * @param link
   */
  async openLinkModal(link: UsefulLink) {
    console.log(`${link.displayText.replace(/ /g, '')}Selected`);
    this.store$.dispatch(UsefulLinkActions[`${link.displayText.replace(/ /g, '')}Selected`]());
    const modal: HTMLIonModalElement = await this.modalController.create({
      id: 'linkModal',
      component: LinkModalComponent,
      componentProps: {
        link,
      },
      cssClass: `${this.accessibilityService.getTextZoomClass()} mes-modal-alert`,
      backdropDismiss: false,
      showBackdrop: true,
    });
    await modal.present();
  }

  /**
   * Navigate back to the dashboard.
   *
   * This method performs the following actions:
   * 1. Dispatches the `ReturnToDashboardPressed` action to the store.
   * 2. Navigates to the dashboard page and replaces the current URL.
   *
   * @returns {Promise<void>} A promise that resolves when the navigation is complete.
   */
  async goToDashboard(): Promise<void> {
    this.store$.dispatch(UsefulLinksReturnToDashboardPressed());
    await this.router.navigate([DASHBOARD_PAGE], { replaceUrl: true });
  }
}
