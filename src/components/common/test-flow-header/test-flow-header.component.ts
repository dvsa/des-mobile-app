import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { ExitSamBanner } from '@components/common/exit-sam/exit-sam-banner/exit-sam-banner';
import { ExitSamButton } from '@components/common/exit-sam/exit-sam-button/exit-sam-button';
import { RefreshButtonComponent } from '@components/common/refresh-button/refresh-button.component';
import { ExitSAMCancelButtonClicked } from '@components/common/test-flow-header/exit-sam.actions';
import { DirectivesModule } from '@directives/directives.module';
import { IonicModule, ModalController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { DeviceProvider } from '@providers/device/device';
import { ExitSAMProvider } from '@providers/exitSAM/exitSAM';
import { StoreModel } from '@shared/models/store.model';

export enum ExitSAMMethodUsed {
  BUTTON = 'button',
  BANNER = 'banner',
  VIN_CHECK = 'vin-check',
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
    RefreshButtonComponent,
  ],
})
export class TestFlowHeaderComponent {
  @Input() isPracticeMode = false;
  @Input() shouldIncludeLanguageDirectiveOnTitle = false;
  @Input() defaultBackButtonHref: string = null;
  @Input() shouldShowRefreshButton = false;
  @Input() shouldShowGenericEndTest = false;
  @Input() shouldShowEndTestLink = true;
  @Input() shouldShowBackButton = true;
  @Input() isDelegatedRekey = false;
  @Input() shouldAuthenticateOnTestEnd = true;
  @Input() shouldShowCloseButton = false;
  @Input() shouldShowEscapeFromSamButton = false;
  @Input() isExitSAMActivated = false;
  @Input() fixHeight = false;

  @Input() pageName: string;
  @Input() testCategory: string;
  @Input() refreshLastSyncTime: string;

  @Output()
  endTestButtonClicked = new EventEmitter<void>();
  @Output()
  onCloseButtonClicked = new EventEmitter<void>();
  @Output()
  refreshButtonClicked = new EventEmitter<void>();
  @Output()
  onExitSAMActivatedChanged = new EventEmitter<boolean>();
  @Output()
  backButtonClicked = new EventEmitter<void>();

  /**
   * Constructor for the PageHeaderComponent.
   * @param deviceProvider - Service for device-related operations.
   * @param platform - Ionic platform service.
   * @param modalController - Controller for managing modals.
   * @param store$ - NgRx store for state management.
   * @param exitSAMProvider
   */
  constructor(
    public deviceProvider: DeviceProvider,
    public platform: Platform,
    public modalController: ModalController,
    public store$: Store<StoreModel>,
    public exitSAMProvider: ExitSAMProvider
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

  onBackClicked() {
    this.backButtonClicked.emit();
  }

  /**
   * Disables Single App Mode (SAM) and exits the application.
   * @param method - The method used to exit SAM (button or banner).
   */
  async disableSAMAndExit(method: ExitSAMMethodUsed, isPracticeMode: boolean) {
    await this.exitSAMProvider.disableSAMAndExit(method, isPracticeMode);
  }
}
