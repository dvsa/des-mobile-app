import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { ExitSAMMethodUsed } from '@components/common/test-flow-header/test-flow-header.component';
import { IonicModule, ModalController } from '@ionic/angular';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { DeviceProvider } from '@providers/device/device';

@Component({
  selector: 'exit-sam-button',
  templateUrl: './exit-sam-button.html',
  styleUrls: ['./exit-sam-button.scss'],
  standalone: true,
  imports: [IonicModule, ComponentsModule],
})
export class ExitSamButton {
  constructor(
    public deviceProvider: DeviceProvider,
    public modalController: ModalController,
    public accessibilityService: AccessibilityService
  ) {}

  @Input()
  isButtonActive = false;

  @Input()
  pageTitle: string;

  @Output()
  escapeSamButtonClicked = new EventEmitter<boolean>();

  @Output()
  samEscaped = new EventEmitter<ExitSAMMethodUsed>();

  timeToHold = 1000;
  holdTimeout: NodeJS.Timeout;

  /**
   * Handler for touch start event. Initiates a timeout to trigger escapeSAM.
   */
  onTouchStart() {
    if (this.isButtonActive) {
      this.holdTimeout = setTimeout(() => {
        this.escapeSAM();
      }, this.timeToHold);
    }
  }

  /**
   * Handler for touch end event. Clears the hold timeout.
   */
  onTouchEnd() {
    clearTimeout(this.holdTimeout);
  }

  /**
   * Handler for click event. Activates the button and emits escapeSamButtonClicked event.
   */
  onClick() {
    this.isButtonActive = true;
    this.escapeSamButtonClicked.emit(this.isButtonActive);
  }

  /**
   * Triggers the escape SAM action, deactivates the button, and emits samEscaped event.
   */
  escapeSAM() {
    this.isButtonActive = false;
    this.escapeSamButtonClicked.emit(this.isButtonActive);
    this.samEscaped.emit(ExitSAMMethodUsed.BUTTON);
  }
}
