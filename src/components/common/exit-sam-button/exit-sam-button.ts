import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { DeviceProvider } from '@providers/device/device';

@Component({
  selector: 'exit-sam-button',
  templateUrl: './exit-sam-button.html',
  styleUrls: ['./exit-sam-button.scss'],
})
export class ExitSamButton {
  constructor(
    public deviceProvider: DeviceProvider,
    public modalController: ModalController,
    public accessibilityService: AccessibilityService
  ) {}

  @Input()
  isButtonActive = false;

  @Output()
  escapeSamButtonClicked = new EventEmitter<boolean>();

  @Output()
  samEscaped = new EventEmitter<void>();

  timeToHold = 1000;
  isPressed = false;
  timeout: NodeJS.Timeout;

  onTouchStart() {
    this.isPressed = true;

    if (this.isButtonActive) {
      this.timeout = setTimeout(async () => {
        if (this.isPressed) {
          this.escapeSAM();
        }
      }, this.timeToHold);
    }
  }

  onTouchEnd() {
    this.isPressed = false;
    clearTimeout(this.timeout);
  }

  onClick() {
    this.isButtonActive = true;
    this.escapeSamButtonClicked.emit(this.isButtonActive);
  }

  escapeSAM() {
    this.isButtonActive = false;
    this.escapeSamButtonClicked.emit(this.isButtonActive);
    this.samEscaped.emit();
  }
}
