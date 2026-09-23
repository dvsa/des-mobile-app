import { Injectable } from '@angular/core';
import { AppLauncher, OpenURLResult } from '@capacitor/app-launcher';
import { ExitSamErrorModal } from '@components/common/exit-sam/exit-sam-error-modal/exit-sam-error-modal';
import {
  ExitSAMConfirmButtonClicked,
  ExitSAMErrorMessages,
  ExitSAMUserReturned,
  ExitSamError,
} from '@components/common/test-flow-header/exit-sam.actions';
import { ModalController, Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { LinkModalComponent, LinkModalEvent } from '@pages/useful-links/components/link-modal/link-modal.component';
import { DeviceProvider } from '@providers/device/device';
import { UrlProvider } from '@providers/url/url';
import { StoreModel } from '@shared/models/store.model';
import { PersistTests } from '@store/tests/tests.actions';
import { SetHasExitedApp } from '@store/tests/user-exited-app/user-exited-app.actions';
import { Subscription } from 'rxjs';

export enum ExitSAMMethodUsed {
  BUTTON = 'button',
  BANNER = 'banner',
  VIN_CHECK = 'vin-check',
}

export enum ExitSAMFlowResult {
  RESUME_SUBSCRIPTION = 'resume-subscription',
  LEAVE_SUBSCRIPTION = 'leave-subscription',
  NONE = 'none',
}

@Injectable()
export class ExitSAMProvider {
  constructor(
    public platform: Platform,
    public modalController: ModalController,
    public deviceProvider: DeviceProvider,
    public store$: Store<StoreModel>,
    private urlProvider: UrlProvider
  ) {}

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

  /**
   * Handles the failure to disable Single App Mode (SAM) by opening an error modal and dispatching an error action.
   * @param firstMessage
   * @param secondMessage
   */
  async handleDisableSAMFailure(
    firstMessage = 'Web browser cannot be opened.',
    secondMessage = 'Please follow the standard operating procedures.'
  ) {
    await this.openExitSamErrorModal(firstMessage, secondMessage);
    this.store$.dispatch(ExitSamError(ExitSAMErrorMessages.DISABLE_SAM));
  }

  async disableSAMAndExit(method: ExitSAMMethodUsed): Promise<ExitSAMFlowResult> {
    // Retained for the existing exit API and future method-specific analytics.
    void method;
    this.store$.dispatch(PersistTests());
    this.store$.dispatch(ExitSAMConfirmButtonClicked());

    try {
      const didDisable = await this.deviceProvider.disableSingleAppMode();

      if (!didDisable) {
        await this.handleDisableSAMFailure(
          'Microsoft Teams cannot be opened.',
          'Please follow the standard operating procedures.'
        );
        return ExitSAMFlowResult.NONE;
      }

      const teamsURL = 'msteams://teams.microsoft.com';
      const canOpenURLResult = (await AppLauncher.canOpenUrl({ url: teamsURL })).value;

      if (!canOpenURLResult) {
        await this.handleTeamsNotFound();
        return ExitSAMFlowResult.LEAVE_SUBSCRIPTION;
      }

      const openURLResult = await AppLauncher.openUrl({ url: teamsURL });

      if (!openURLResult.completed) {
        await this.handleTeamsOpenFailure(openURLResult);
        return ExitSAMFlowResult.LEAVE_SUBSCRIPTION;
      }

      return ExitSAMFlowResult.RESUME_SUBSCRIPTION;
    } catch (error) {
      await this.openExitSamErrorModal(
        'Microsoft Teams cannot be opened.',
        'Please follow the standard operating procedures.'
      );
      this.store$.dispatch(ExitSamError('Error', error));
      return ExitSAMFlowResult.NONE;
    }
  }

  async disableSAMAndExitForRecalls(method: ExitSAMMethodUsed): Promise<void> {
    // Retained for the existing exit API and future method-specific analytics.
    void method;
    this.store$.dispatch(ExitSAMConfirmButtonClicked());

    try {
      const recallLink = this.urlProvider.getUsefulLinks().find((link) => link.id === 'citroen-recall');
      const modal = await this.modalController.create({
        component: LinkModalComponent,
        componentProps: {
          link: recallLink,
          disableSAM: true,
        },
        cssClass: 'mes-modal-alert text-zoom-regular',
      });

      await modal.present();
      const { data } = await modal.onDidDismiss();

      if (data?.event === LinkModalEvent.CONTINUE) {
        this.store$.dispatch(SetHasExitedApp());
      }
    } catch (error) {
      this.store$.dispatch(ExitSamError('Error', error));
    }
  }

  private async handleTeamsNotFound(): Promise<void> {
    await this.openExitSamErrorModal(
      'Microsoft Teams cannot be opened but DES is now unlocked.',
      'You can manually open other apps on your iPad.'
    );
    this.store$.dispatch(ExitSamError(ExitSAMErrorMessages.TEAMS_NOT_FOUND));
  }

  private async handleTeamsOpenFailure(openURLResult: OpenURLResult): Promise<void> {
    await this.openExitSamErrorModal(
      'Microsoft Teams cannot be opened but DES is now unlocked.',
      'You can manually open other apps on your iPad.'
    );
    this.store$.dispatch(ExitSamError(ExitSAMErrorMessages.COULD_NOT_EXIT_TO_TEAMS, openURLResult));
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

    this.setupReturnToAppSubscription();
  }

  /**
   * Sets up a subscription to the platform resume event.
   * When the app is resumed, dispatches an action indicating the user has returned,
   * re-enables single app mode, and destroys the resume subscription.
   */
  setupEscapeSAMResumeSubscription() {
    this.setupReturnToAppSubscription();
  }

  /**
   * Sets up a subscription to listen for when the user returns to the app.
   * @private
   */
  private setupReturnToAppSubscription() {
    if (!this.returnToAppSubscription) {
      //If there isn't one already, set up a subscription to listen for the user returns
      this.returnToAppSubscription = this.platform.resume.subscribe(this.resumeSubscriptionFunction);
    }
  }

  /**
   * Function to be called when the app is resumed.
   * It dispatches an action indicating the user has returned.
   */
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
