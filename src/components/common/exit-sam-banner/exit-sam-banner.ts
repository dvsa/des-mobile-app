import { Component, EventEmitter, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { DeviceProvider } from '@providers/device/device';

@Component({
  selector: 'exit-sam-banner',
  templateUrl: './exit-sam-banner.html',
  styleUrls: ['./exit-sam-banner.scss'],
})
export class ExitSamBanner {
  constructor(
    public deviceProvider: DeviceProvider,
    public modalController: ModalController,
    public accessibilityService: AccessibilityService
  ) {}

  @Output()
  escapeSamBannerClicked = new EventEmitter<boolean>();

  @Output()
  cancelClicked = new EventEmitter<void>();

  @Output()
  samEscaped = new EventEmitter<void>();

  timeToHold = 1000;
  isPressed = false;

  onTouchStart() {
    this.isPressed = true;

    setTimeout(async () => {
      if (this.isPressed) {
        this.escapeSAM();
      }
    }, this.timeToHold);
  }

  onTouchEnd() {
    this.isPressed = false;
  }

  cancelButtonClicked() {
    this.cancelClicked.emit();
  }

  escapeSAM() {
    this.escapeSamBannerClicked.emit(false);
    this.samEscaped.emit();
  }
}
