import { AsyncPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppLauncher, OpenURLResult } from '@capacitor/app-launcher';
import { ComponentsModule } from '@components/common/common-components.module';
import { ExitSamBanner } from '@components/common/exit-sam/exit-sam-banner/exit-sam-banner';
import { ExitSamButton } from '@components/common/exit-sam/exit-sam-button/exit-sam-button';
import { ExitSamErrorModal } from '@components/common/exit-sam/exit-sam-error-modal/exit-sam-error-modal';
import { RefreshButtonComponent } from '@components/common/refresh-button/refresh-button.component';
import {
  ExitSAMCancelButtonClicked,
  ExitSAMErrorMessages,
  ExitSAMUserReturned,
  ExitSamActivated,
  ExitSamError,
} from '@components/common/test-flow-header/exit-sam.actions';
import { DirectivesModule } from '@directives/directives.module';
import { IonicModule, ModalController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { DeviceProvider } from '@providers/device/device';
import { StoreModel } from '@shared/models/store.model';
import { Subscription } from 'rxjs';

export enum ExitSAMMethodUsed {
  BUTTON = 'button',
  BANNER = 'banner',
}

@Component({
  selector: 'test-flow-header',
  templateUrl: './test-flow-header.component.html',
  styleUrls: ['./test-flow-header.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    ComponentsModule,
    NgIf,
    ExitSamBanner,
    ExitSamButton,
    DirectivesModule,
    AsyncPipe,
    RefreshButtonComponent,
  ],
})
export class TestFlowHeaderComponent {
  @Input() isPracticeMode = false;
  @Input() shouldIncludeLanguageDirectiveOnTitle = false;
  @Input() defaultBackButtonHref: string;
  @Input() shouldShowRefreshButton = false;
  @Input() shouldShowGenericEndTest = false;
  @Input() shouldShowEndTestLink = true;
  @Input() shouldShowBackButton = true;
  @Input() isDelegatedRekey = false;
  @Input() shouldAuthenticateOnTestEnd = true;
  @Input() shouldShowCloseButton = false;
  @Input() shouldShowEscapeFromSamButton = true;
  @Input() isExitSAMActivated = false;

  @Input() pageName: string;
  @Input() testCategory: string;
  @Input() refreshLastSyncTime: string;

  @Output()
  endTestButtonClicked = new EventEmitter<void>();
  @Output()
  onCloseButtonClicked = new EventEmitter<void>();
  @Output()
  exitSamUsed = new EventEmitter<void>();
  @Output()
  refreshButtonClicked = new EventEmitter<void>();
  @Output()
  onExitSAMActivatedChanged = new EventEmitter<boolean>();

  resumeSubscription: Subscription;

  /**
   * Constructor for the PageHeaderComponent.
   * @param deviceProvider - Service for device-related operations.
   * @param platform - Ionic platform service.
   * @param modalController - Controller for managing modals.
   * @param store$ - NgRx store for state management.
   */
  constructor(
    public deviceProvider: DeviceProvider,
    public platform: Platform,
    public modalController: ModalController,
    public store$: Store<StoreModel>
  ) {}

  /**
   * Sets up the subscription to the platform resume event.
   */
  setupSubscription() {
    this.resumeSubscription = this.platform.resume.subscribe(async () => {
      this.store$.dispatch(ExitSAMUserReturned());
      if (this.shouldShowEscapeFromSamButton) {
        try {
          // Re-enable single app mode to lock the user back in when they come back
          const didEnable = await this.deviceProvider.enableSingleAppMode();

          if (!didEnable) {
            this.store$.dispatch(ExitSamError('Could not enable single app mode', didEnable));
          }
        } catch (e) {
          this.store$.dispatch(ExitSamError('Enable single app mode error', e));
        }
        // Destroy the subscription to prevent memory leaks
        this.destroySubscription();
      }
    });
  }

  /**
   * Destroys the subscription to the platform resume event.
   */
  destroySubscription() {
    if (this.resumeSubscription) {
      this.resumeSubscription.unsubscribe();
      this.resumeSubscription = null;
    }
  }

  /**
   * Handles the end test button click event.
   */
  onEndTestClicked() {
    this.endTestButtonClicked.emit();
  }

  /**
   * Handles the close button click event.
   */
  onCloseClicked() {
    this.onCloseButtonClicked.emit();
  }

  /**
   * Changes the Exit SAM activation status.
   * @param newValue - New activation status.
   */
  changeExitSAMValue(newValue: boolean) {
    this.isExitSAMActivated = newValue;
    this.onExitSAMActivatedChanged.emit(newValue);
  }

  cancelButtonClicked() {
    this.store$.dispatch(ExitSAMCancelButtonClicked());
    this.changeExitSAMValue(false);
  }

  /**
   * Opens the DES unlocked modal.
   */
  async openDESUnlockedModal() {
    const desUnlockedModal = await this.modalController.create({
      component: ExitSamErrorModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
      componentProps: {
        modalTitle: 'Unavailable',
        firstMessage: 'Microsoft Teams cannot be opened but DES is now unlocked.',
        secondMessage: 'You can manually open other apps on your iPad.',
      },
    });
    await desUnlockedModal.present();
  }

  /**
   * Opens the DES did not unlock modal.
   */
  async openDESDidNotUnlockModal() {
    const desUnlockedModal = await this.modalController.create({
      component: ExitSamErrorModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
      componentProps: {
        modalTitle: 'Unavailable',
        firstMessage: 'Microsoft Teams cannot be opened.',
        secondMessage: 'Please follow the standard operating procedures.',
      },
    });
    await desUnlockedModal.present();
  }

  async openPracticeModeModal() {
    const practiceModal = await this.modalController.create({
      component: ExitSamErrorModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
      componentProps: {
        modalTitle: 'You are in practice mode',
        firstMessage: 'Opening Microsoft Teams is unavailable in practice mode.',
      },
    });
    await practiceModal.present();
  }

  async handleDisableSAMFailure() {
    console.log('Could not disable single app mode log');
    await this.openDESDidNotUnlockModal();
    this.store$.dispatch(ExitSamError(ExitSAMErrorMessages.DISABLE_SAM));
  }

  async handleTeamsNotFound() {
    console.log('Could not find teams log');
    await this.openDESUnlockedModal();
    this.store$.dispatch(ExitSamError(ExitSAMErrorMessages.TEAMS_NOT_FOUND));
  }

  async handleTeamsOpenFailure(openURLResult: OpenURLResult) {
    console.log('Could not exit to teams log');
    await this.openDESUnlockedModal();
    this.store$.dispatch(ExitSamError(ExitSAMErrorMessages.TEAMS_OPEN, openURLResult));
  }

  /**
   * Disables Single App Mode (SAM) and exits the application.
   * @param method - The method used to exit SAM (button or banner).
   */
  async disableSAMAndExit(method: ExitSAMMethodUsed) {
    // Dispatch the ExitSamActivated action with the provided method
    this.store$.dispatch(ExitSamActivated(method));
    // Emit the exitSamUsed event
    this.exitSamUsed.emit();

    // Check if the application is in practice mode
    if (this.isPracticeMode) {
      console.log('Practice mode log');
      // Open the practice mode modal
      await this.openPracticeModeModal();
      return;
    }

    try {
      console.log('Attempting to disable single app mode');
      // Attempt to disable single app mode
      const didDisable = await this.deviceProvider.disableSingleAppMode();
      console.log('Disable single app mode result', didDisable);

      // If disabling single app mode failed, handle the failure
      if (!didDisable) {
        console.log('Could not disable single app mode log');
        await this.handleDisableSAMFailure();
        return;
      }

      // Define the Microsoft Teams URL
      const teamsURL = 'msteams://teams.microsoft.com';
      // Check if the URL can be opened
      const canOpenURLResult = (await AppLauncher.canOpenUrl({ url: teamsURL })).value;
      console.log('Can open URL result', canOpenURLResult);

      // If the URL cannot be opened, handle the failure
      if (!canOpenURLResult) {
        console.log('Could not find teams log');
        await this.handleTeamsNotFound();
        return;
      }

      console.log('here', await AppLauncher.openUrl({ url: teamsURL }));
      // Attempt to open the URL
      const openURLResult = await AppLauncher.openUrl({ url: teamsURL });
      console.log('Open URL result', openURLResult);

      // If the URL was opened successfully, set up the subscription
      if (openURLResult.completed) {
        console.log('Teams opened successfully');
        this.setupSubscription();
      } else {
        // If opening the URL failed, handle the failure
        console.log('Could not exit to teams log');
        await this.handleTeamsOpenFailure(openURLResult);
      }
    } catch (e) {
      // Handle any errors that occurred during the process
      console.log('Error', e);
      await this.openDESDidNotUnlockModal();
      this.store$.dispatch(ExitSamError('Error', e));
    }
  }
}
