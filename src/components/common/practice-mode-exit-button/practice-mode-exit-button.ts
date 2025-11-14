import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { DeviceProvider } from '@providers/device/device';

@Component({
  selector: 'practice-mode-exit-button',
  templateUrl: './practice-mode-exit-button.html',
  styleUrls: ['./practice-mode-exit-button.scss'],
  imports: [IonicModule],
})
export class PracticeModeExitButton {
  constructor(
    public deviceProvider: DeviceProvider,
    public modalController: ModalController,
    public accessibilityService: AccessibilityService
  ) {}

  @Input()
  pageTitle: string;

  @Output()
  exitPracticeMode = new EventEmitter<void>();
  //
  // @Output()
  // samEscaped = new EventEmitter<ExitSAMMethodUsed>();
  //
  toggleExit = false;
  // holdTimeout: NodeJS.Timeout;

  // /**
  //  * Handler for touch start event. Initiates a timeout to trigger escapeSAM.
  //  */
  // onTouchStart() {
  //   if (this.isButtonActive) {
  //     this.holdTimeout = setTimeout(() => {
  //       this.escapeSAM();
  //     }, this.timeToHold);
  //   }
  // }
  //
  // /**
  //  * Handler for touch end event. Clears the hold timeout.
  //  */
  // onTouchEnd() {
  //   clearTimeout(this.holdTimeout);
  // }
  //
  // /**
  //  * Handler for click event. Activates the button and emits escapeSamButtonClicked event.
  //  */
  /**
   * Trigger emitter to open exit practice mode options
   */
  onClick() {
    this.exitPracticeMode.emit();
  }
  //
  // /**
  //  * Triggers the escape SAM action, deactivates the button, and emits samEscaped event.
  //  */
  // escapeSAM() {
  //   this.isButtonActive = false;
  //   this.escapeSamButtonClicked.emit(this.isButtonActive);
  //   this.samEscaped.emit(ExitSAMMethodUsed.BUTTON);
  // }
}
