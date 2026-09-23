import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OpenURLResult } from '@capacitor/app-launcher';
import { Style } from '@capacitor/status-bar';
import { ComponentsModule } from '@components/common/common-components.module';
import { ExitSamBanner } from '@components/common/exit-sam/exit-sam-banner/exit-sam-banner';
import { ExitSamButton } from '@components/common/exit-sam/exit-sam-button/exit-sam-button';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { PracticeModeExitButton } from '@components/common/practice-mode-exit-button/practice-mode-exit-button';
import {
  ExitSAMCancelButtonClicked,
  ExitSAMErrorMessages,
  ExitSamError,
  ExitSamSelected,
} from '@components/common/test-flow-header/exit-sam.actions';
import { DirectivesModule } from '@directives/directives.module';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonIcon,
  IonLabel,
  IonRow,
  ModalController,
} from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { DeviceProvider } from '@providers/device/device';
import { ExitSAMFlowResult, ExitSAMMethodUsed, ExitSAMProvider } from '@providers/exitSAM/exitSAM';
import { StoreModel } from '@shared/models/store.model';

export { ExitSAMMethodUsed } from '@providers/exitSAM/exitSAM';

@Component({
  selector: 'test-flow-header',
  templateUrl: './test-flow-header.component.html',
  styleUrls: ['./test-flow-header.component.scss'],
  imports: [
    ComponentsModule,
    ExitSamBanner,
    ExitSamButton,
    DirectivesModule,
    PracticeModeExitButton,
    PracticeModeBanner,
    IonRow,
    IonCol,
    IonLabel,
    IonBackButton,
    IonButton,
    IonButtons,
    IonIcon,
  ],
  standalone: true,
})
export class TestFlowHeaderComponent {
  @Input() isPracticeMode = false;
  @Input() shouldIncludeLanguageDirectiveOnTitle = false;
  @Input() defaultBackButtonHref: string = null;
  @Input() shouldShowGenericEndTest = false;
  @Input() shouldShowEndTestLink = true;
  @Input() shouldShowBackButton = true;
  @Input() isDelegatedRekey = false;
  @Input() shouldAuthenticateOnTestEnd = true;
  @Input() shouldShowCloseButton = false;
  @Input() shouldShowEscapeFromSamButton = false;
  @Input() isExitSAMActivated = false;

  @Input() pageName: string;
  @Input() testCategory: string;

  @Output()
  endTestButtonClicked = new EventEmitter<void>();
  @Output()
  onCloseButtonClicked = new EventEmitter<void>();
  @Output()
  exitSamUsed = new EventEmitter<void>();
  @Output()
  onExitSAMActivatedChanged = new EventEmitter<boolean>();
  @Output()
  backButtonClicked = new EventEmitter<void>();
  @Output()
  setupResumeSubscription = new EventEmitter<void>();
  @Output()
  setupLeaveSubscription = new EventEmitter<void>();

  displayExitPracticeMode = false;

  /**
   * Constructor for the PageHeaderComponent.
   * @param deviceProvider - Service for device-related operations.
   * @param platform - Ionic platform service.
   * @param modalController - Controller for managing modals.
   * @param store$ - NgRx store for state management.
   * @param exitSAMProvider
   * @param accessibilityService
   */
  constructor(
    public deviceProvider: DeviceProvider,
    public platform: Platform,
    public modalController: ModalController,
    public store$: Store<StoreModel>,
    public exitSAMProvider: ExitSAMProvider,
    public accessibilityService: AccessibilityService
  ) {}

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
   * Changes the Exit SAM activation status, changing the toolbar to dark if we were in practice mode previously.
   * @param newValue - New activation status.
   */
  async changeExitSAMValue(newValue: boolean) {
    if (!this.isExitSAMActivated) this.store$.dispatch(ExitSamSelected());

    if (this.isPracticeMode) {
      await this.accessibilityService.configureStatusBar(newValue ? Style.Dark : Style.Light);
    }
    this.isExitSAMActivated = newValue;
    this.onExitSAMActivatedChanged.emit(newValue);
  }

  async cancelButtonClicked() {
    this.store$.dispatch(ExitSAMCancelButtonClicked());
    await this.changeExitSAMValue(false);
  }
  /**
   * Opens the DES unlocked modal.
   */
  async openDESUnlockedModal() {
    await this.exitSAMProvider.openExitSamErrorModal(
      'Microsoft Teams cannot be opened but DES is now unlocked.',
      'You can manually open other apps on your iPad.'
    );
  }

  /**
   * Opens the DES did not unlock modal.
   */
  async openDESDidNotUnlockModal() {
    await this.exitSAMProvider.openExitSamErrorModal(
      'Microsoft Teams cannot be opened.',
      'Please follow the standard operating procedures.'
    );
  }

  async handleDisableSAMFailure() {
    await this.exitSAMProvider.handleDisableSAMFailure(
      'Microsoft Teams cannot be opened.',
      'Please follow the standard operating procedures.'
    );
  }

  /**
   * Handles the scenario where Microsoft Teams is not found on the device.
   */
  async handleTeamsNotFound() {
    await this.openDESUnlockedModal();
    this.store$.dispatch(ExitSamError(ExitSAMErrorMessages.TEAMS_NOT_FOUND));
  }

  /**
   * Handles the scenario where Microsoft Teams fails to open.
   * @param openURLResult
   */
  async handleTeamsOpenFailure(openURLResult: OpenURLResult) {
    await this.openDESUnlockedModal();
    this.store$.dispatch(ExitSamError(ExitSAMErrorMessages.COULD_NOT_EXIT_TO_TEAMS, openURLResult));
  }

  /**
   * Disables Single App Mode (SAM) and exits the application.
   * @param method - The method used to exit SAM (button or banner).
   */
  async disableSAMAndExit(method: ExitSAMMethodUsed) {
    void method;
    const exitFlow = this.exitSAMProvider.disableSAMAndExit(method);
    // Emit the exitSamUsed event after the provider dispatches the confirmation actions.
    this.exitSamUsed.emit();

    const result = await exitFlow;

    if (result === ExitSAMFlowResult.LEAVE_SUBSCRIPTION) {
      this.setupLeaveSubscription.emit();
    } else if (result === ExitSAMFlowResult.RESUME_SUBSCRIPTION) {
      this.setupResumeSubscription.emit();
    }
  }

  /**
   * Handles the back button click event, emitting the backButtonClicked event.
   */
  onBackClicked() {
    this.backButtonClicked.emit();
  }

  /**
   * Opens the exit practice mode row
   */
  onEndPracticeModeClicked() {
    this.displayExitPracticeMode = true;
  }

  /**
   * Closes the exit practice mode row
   */
  closeExitPracticeMode() {
    this.displayExitPracticeMode = false;
  }
}
