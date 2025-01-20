import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
export class PageHeaderComponent implements OnInit, OnDestroy {
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

  ngOnInit() {
    this.resumeSubscription = this.platform.resume.subscribe(async () => {
      if (this.shouldShowEscapeFromSamButton) {
        try {
          //Re-enable single app mode to lock the user back in when they come back
          await this.deviceProvider.enableSingleAppMode().then((didEnable) => {
            if (!didEnable) {
              this.store$.dispatch(ExitSamError('Could not enable single app mode', didEnable));
            }
          });
        } catch (e) {
          this.store$.dispatch(ExitSamError('Enable single app mode error', e));
        }
      }
    });
  }

  ngOnDestroy() {
    console.log('Destroying page header');
    if (this.resumeSubscription) {
      this.resumeSubscription.unsubscribe();
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

  async disableSAMAndExit() {
    this.exitSamUsed.emit();
    if (this.isPracticeMode) {
      const practiceModal = await this.modalController.create({
        component: ExitSamPracticeModeModal,
        cssClass: 'mes-modal-alert text-zoom-regular',
      });
      await practiceModal.present();
    } else {
      try {
        //disable single app mode
        await this.deviceProvider.disableSingleAppMode().then(async (didDisable) => {
          if (didDisable) {
            try {
              AppLauncher.canOpenUrl({ url: 'msteams://teams.microsoft.com' }).then(
                async (canOpenURLResult: CanOpenURLResult) => {
                  console.log('Can open url result', canOpenURLResult);
                  if (canOpenURLResult.value) {
                    try {
                      // Go to teams
                      AppLauncher.openUrl({ url: 'msteams://teams.microsoft.com' }).then(
                        async (openURLResult: OpenURLResult) => {
                          if (!openURLResult.completed) {
                            this.store$.dispatch(ExitSamError('Could not exit to teams', openURLResult));
                            await this.openDESUnlockedModal();
                          }
                        }
                      );
                      // Go to settings
                      // await AppLauncher.openUrl({ url: 'App-prefs://' });
                    } catch (e) {
                      await this.openDESUnlockedModal();
                      this.store$.dispatch(ExitSamError('Finding teams error catch', e));
                    }
                  } else {
                    await this.openDESUnlockedModal();
                    this.store$.dispatch(ExitSamError('Could not find teams'));
                  }
                }
              );
            } catch (e) {
              await this.openDESUnlockedModal();
              this.store$.dispatch(ExitSamError('Exit to teams error catch', e));
            }
          } else {
            await this.openDESDidNotUnlockModal();
            this.store$.dispatch(ExitSamError('Could not disable single app mode'));
          }
        });
      } catch (e) {
        await this.openDESDidNotUnlockModal();
        this.store$.dispatch(ExitSamError('Disable single app mode error catch', e));
      }
    }
  }
}
