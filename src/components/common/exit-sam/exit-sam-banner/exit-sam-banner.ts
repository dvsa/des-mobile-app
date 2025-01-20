import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule, ModalController } from '@ionic/angular';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { DeviceProvider } from '@providers/device/device';

@Component({
  selector: 'exit-sam-banner',
  templateUrl: './exit-sam-banner.html',
  styleUrls: ['./exit-sam-banner.scss'],
  standalone: true,
  imports: [IonicModule, ComponentsModule, NgIf],
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

  @Input()
  showSpacingBanner = true;

  @Input()
  pageTitle: string;

  timeToHold = 1000;
  holdTimeout: NodeJS.Timeout;

  onTouchStart() {
    this.holdTimeout = setTimeout(() => {
      this.escapeSAM();
    }, this.timeToHold);
  }

  onTouchEnd() {
    clearTimeout(this.holdTimeout);
  }

  cancelButtonClicked() {
    this.cancelClicked.emit();
  }

  escapeSAM() {
    this.escapeSamBannerClicked.emit(false);
    this.samEscaped.emit();
  }
}
