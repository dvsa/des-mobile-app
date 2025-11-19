import { Injectable } from '@angular/core';
import { ExitSamErrorModal } from '@components/common/exit-sam/exit-sam-error-modal/exit-sam-error-modal';
import {
  ExitSAMConfirmButtonClicked,
  ExitSAMErrorMessages,
  ExitSAMUserReturned,
  ExitSamError,
} from '@components/common/test-flow-header/exit-sam.actions';
import { ExitSAMMethodUsed } from '@components/common/test-flow-header/test-flow-header.component';
import { ModalController, Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { LinkModalComponent, LinkModalEvent } from '@pages/useful-links/components/link-modal/link-modal.component';
import { DeviceProvider } from '@providers/device/device';
import { UrlProvider } from '@providers/url/url';
import { StoreModel } from '@shared/models/store.model';
import { SetHasExitedApp } from '@store/tests/user-exited-app/user-exited-app.actions';
import { Subscription } from 'rxjs';

@Injectable()
export class ExitSAMProvider {
  constructor(
    public platform: Platform,
    public modalController: ModalController,
    public deviceProvider: DeviceProvider,
    public store$: Store<StoreModel>,
    private urlProvider: UrlProvider
  ) {}

  public leaveAppSubscription: Subscription = null;
  public returnToAppSubscription: Subscription = null;

  /**
   * Opens the exit SAM error modal.
   *
   * @param firstMessage
   * @param secondMessage
   */
  async openExitSamErrorModal(firstMessage: string, secondMessage: string) {
    const desUnlockedModal = await this.modalController.create({
      component: ExitSamErrorModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
      componentProps: {
        modalTitle: 'Unavailable',
        firstMessage: firstMessage,
        secondMessage: secondMessage,
      },
    });
    await desUnlockedModal.present();
  }

  async handleDisableSAMFailure() {
    await this.openExitSamErrorModal(
      'Web browser cannot be opened.',
      'Please follow the standard operating procedures.'
    );
    this.store$.dispatch(ExitSamError(ExitSAMErrorMessages.DISABLE_SAM));
  }

  /**
   * Disables Single App Mode (SAM) and exits the application.
   * @param method - The method used to exit SAM (button or banner).
   */
  async disableSAMAndExitForRecalls(method: ExitSAMMethodUsed) {
    this.store$.dispatch(ExitSAMConfirmButtonClicked());

    try {
      const usefulLinks = this.urlProvider.getUsefulLinks();

      const recallLinks = usefulLinks.find((link) => link.id === 'citroen-recall');

      const modal = await this.modalController.create({
        component: LinkModalComponent,
        componentProps: {
          link: recallLinks,
          disableSAM: true,
        },
        cssClass: 'mes-modal-alert text-zoom-regular',
      });

      await modal.present();

      const { data } = await modal.onDidDismiss();
      if (data?.event === LinkModalEvent.CONTINUE) {
        this.store$.dispatch(SetHasExitedApp());
      }

      return;
    } catch (e) {
      // Handle any errors that occurred during the process
      this.store$.dispatch(ExitSamError('Error', e));
    }
  }

  /**
   * Attempts to disable Single App Mode (SAM) by calling the device provider's method.
   * If successful, sets up a subscription to listen for when the user returns to the app.
   */
  async attemptToDisableSAMForEscape() {
    // Attempt to disable single app mode
    const didDisable = await this.deviceProvider.disableSingleAppMode();

    // If disabling single app mode failed, handle the failure
    if (!didDisable) {
      await this.handleDisableSAMFailure();
      return;
    }

    if (!this.returnToAppSubscription) {
      //If there isn't one already, we want to set up a subscription to listen for the user returns
      this.returnToAppSubscription = this.platform.resume.subscribe(this.resumeSubscriptionFunction);
    }
  }

  /**
   * Sets up a subscription to the platform resume event.
   * When the app is resumed, dispatches an action indicating the user has returned,
   * re-enables single app mode, and destroys the resume subscription.
   */
  setupEscapeSAMResumeSubscription() {
    if (!this.returnToAppSubscription) {
      //If there isn't one already, we want to set up a subscription to listen for the user returns
      this.returnToAppSubscription = this.platform.resume.subscribe(this.resumeSubscriptionFunction);
    }
  }

  resumeSubscriptionFunction = async () => {
    this.store$.dispatch(ExitSAMUserReturned());
    // Re-enable single app mode to lock the user back in when they come back
    await this.reEnableSingleAppMode();
    // Destroy the subscription to prevent memory leaks and locking the user in every time they return to the app
    this.destroyReturnToAppSubscription();
  };

  /**
   * Re-enables single app mode to lock the user back in when they come back.
   * Dispatches an error action if enabling single app mode fails.
   *
   * @returns {Promise<void>}
   */
  async reEnableSingleAppMode(): Promise<void> {
    try {
      // Re-enable single app mode to lock the user back in when they come back
      const didEnable = await this.deviceProvider.enableSingleAppMode();

      if (!didEnable) {
        this.store$.dispatch(ExitSamError('Could not enable single app mode', didEnable));
      }
    } catch (e) {
      this.store$.dispatch(ExitSamError('Enable single app mode error', e));
    }
  }

  /**
   * Destroys the subscription to the platform resume event.
   */
  destroyReturnToAppSubscription() {
    if (this.returnToAppSubscription) {
      this.returnToAppSubscription.unsubscribe();
      this.returnToAppSubscription = null;
    }
  }
}
