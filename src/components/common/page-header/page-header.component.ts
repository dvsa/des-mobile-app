import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppLauncher, CanOpenURLResult, OpenURLResult } from '@capacitor/app-launcher';
import { ComponentsModule } from '@components/common/common-components.module';
import { ExitSamDESLockedModal } from '@components/common/exit-sam/exit-sam-DES-locked-modal/exit-sam-DES-locked-modal';
import { ExitSamDESUnlockedModal } from '@components/common/exit-sam/exit-sam-DES-unlocked-modal/exit-sam-DES-unlocked-modal';
import { ExitSamBanner } from '@components/common/exit-sam/exit-sam-banner/exit-sam-banner';
import { ExitSamButton } from '@components/common/exit-sam/exit-sam-button/exit-sam-button';
import { ExitSamPracticeModeModal } from '@components/common/exit-sam/exit-sam-practice-mode-modal/exit-sam-practice-mode-modal';
import { ExitSamError } from '@components/common/page-header/exit-sam.actions';
import { DirectivesModule } from '@directives/directives.module';
import { IonicModule, ModalController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { DeviceProvider } from '@providers/device/device';
import { StoreModel } from '@shared/models/store.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'des-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  standalone: true,
  imports: [IonicModule, ComponentsModule, NgIf, ExitSamBanner, ExitSamButton, DirectivesModule],
})
export class PageHeaderComponent {
  @Input()
  isPracticeMode = false;
  @Input()
  defaultBackButtonHref: string;
  @Input()
  shouldShowGenericEndTest = false;
  @Input()
  shouldShowEndTestLink = true;
  @Input()
  shouldShowBackButton = true;
  @Input()
  isDelegatedRekey = false;
  @Input()
  shouldAuthenticateOnTestEnd = true;
  @Input()
  shouldShowCloseButton = false;
  @Input()
  shouldShowEscapeFromSamButton = true;
  @Input()
  isExitSAMActivated = false;
  @Input()
  pageName: string;
  @Input()
  testCategory: string;

  @Output()
  endTestButtonClicked = new EventEmitter<void>();
  @Output()
  onCloseButtonClicked = new EventEmitter<void>();
  @Output()
  exitSamUsed = new EventEmitter<void>();
  @Output()
  onExitSAMActivatedChanged = new EventEmitter<boolean>();

  resumeSubscription: Subscription;

  constructor(
    public deviceProvider: DeviceProvider,
    public platform: Platform,
    public modalController: ModalController,
    public store$: Store<StoreModel>
  ) {}

  setupSubscription() {
    this.resumeSubscription = this.platform.resume.subscribe(async () => {
      if (this.shouldShowEscapeFromSamButton) {
        try {
          //Re-enable single app mode to lock the user back in when they come back
          await this.deviceProvider.enableSingleAppMode().then((didEnable) => {
            if (!didEnable) {
              this.store$.dispatch(ExitSamError('Could not enable single app mode', didEnable));
            }
            //Destroy the subscription to prevent memory leaks
            this.destroySubscription();
          });
        } catch (e) {
          this.store$.dispatch(ExitSamError('Enable single app mode error', e));
        }
      }
    });
  }

  destroySubscription() {
    if (this.resumeSubscription) {
      this.resumeSubscription.unsubscribe();
      this.resumeSubscription = null;
    }
  }

  onEndTestClicked() {
    this.endTestButtonClicked.emit();
  }

  onCloseClicked() {
    this.onCloseButtonClicked.emit();
  }

  changeExitSAMValue(newValue: boolean) {
    this.isExitSAMActivated = newValue;
    this.onExitSAMActivatedChanged.emit(newValue);
  }

  async openDESUnlockedModal() {
    const desUnlockedModal = await this.modalController.create({
      component: ExitSamDESUnlockedModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
    });
    await desUnlockedModal.present();
  }

  async openDESDidNotUnlockModal() {
    const desUnlockedModal = await this.modalController.create({
      component: ExitSamDESLockedModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
    });
    await desUnlockedModal.present();
  }

  /**
   * Disables Single App Mode (SAM) and exits the application.
   *
   * This method handles the process of disabling SAM and exiting the application.
   * It emits an event indicating that SAM has been used, and based on the mode (practice or regular),
   * it either opens a practice mode modal or attempts to disable SAM and open Microsoft Teams.
   *
   * @returns {Promise<void>}
   */
  async disableSAMAndExit() {
    // Emit event indicating SAM has been used
    this.exitSamUsed.emit();

    if (this.isPracticeMode) {
      // If in practice mode, open the practice mode modal
      const practiceModal = await this.modalController.create({
        component: ExitSamPracticeModeModal,
        cssClass: 'mes-modal-alert text-zoom-regular',
      });
      await practiceModal.present();
    } else {
      try {
        // Attempt to disable single app mode
        await this.deviceProvider.disableSingleAppMode().then(async (didDisable) => {
          if (didDisable) {
            try {
              const teamsURL = 'msteams://teams.microsoft.com';
              // Check if Microsoft Teams can be opened
              AppLauncher.canOpenUrl({ url: teamsURL }).then(async (canOpenURLResult: CanOpenURLResult) => {
                if (canOpenURLResult.value) {
                  try {
                    // Attempt to open Microsoft Teams
                    AppLauncher.openUrl({ url: teamsURL }).then(async (openURLResult: OpenURLResult) => {
                      if (!openURLResult.completed) {
                        // Dispatch error if unable to exit to Teams and open the unlocked modal
                        this.store$.dispatch(ExitSamError('Could not exit to teams', openURLResult));
                        await this.openDESUnlockedModal();
                      } else {
                        // Setup subscription to listen for when the user returns if successful
                        this.setupSubscription();
                      }
                    });
                  } catch (e) {
                    // Handle error and open the unlocked modal
                    await this.openDESUnlockedModal();
                    this.store$.dispatch(ExitSamError('Finding teams error catch', e));
                  }
                } else {
                  // Handle case where Teams cannot be found and open the unlocked modal
                  await this.openDESUnlockedModal();
                  this.store$.dispatch(ExitSamError('Could not find teams'));
                }
              });
            } catch (e) {
              // Handle error and open the unlocked modal
              await this.openDESUnlockedModal();
              this.store$.dispatch(ExitSamError('Exit to teams error catch', e));
            }
          } else {
            // Handle case where SAM could not be disabled and open the locked modal
            await this.openDESDidNotUnlockModal();
            this.store$.dispatch(ExitSamError('Could not disable single app mode'));
          }
        });
      } catch (e) {
        // Handle error and open the locked modal
        await this.openDESDidNotUnlockModal();
        this.store$.dispatch(ExitSamError('Disable single app mode error catch', e));
      }
    }
  }
}
