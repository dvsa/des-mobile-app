import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { ExitSAMMethodUsed } from '@components/common/test-flow-header/test-flow-header.component';
import { IonicModule, ModalController } from '@ionic/angular';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { DeviceProvider } from '@providers/device/device';

@Component({
  selector: 'exit-sam-banner',
  templateUrl: './exit-sam-banner.html',
  styleUrls: ['./exit-sam-banner.scss'],
  imports: [IonicModule, ComponentsModule],
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
  samEscaped = new EventEmitter<ExitSAMMethodUsed>();

  @Input()
  showSpacingBanner = true;

  @Input()
  pageTitle: string;

  timeToHold = 1000;
  holdTimeout: NodeJS.Timeout;

  /**
   * Handler for touch start event. Sets a timeout to trigger escapeSAM.
   */
  onTouchStart() {
    this.holdTimeout = setTimeout(() => {
      this.escapeSAM();
    }, this.timeToHold);
  }

  /**
   * Handler for touch end event. Clears the hold timeout.
   */
  onTouchEnd() {
    clearTimeout(this.holdTimeout);
  }

  /**
   * Handler for cancel button click. Emits the cancelClicked event.
   */
  cancelButtonClicked() {
    this.cancelClicked.emit();
  }

  /**
   * Triggers the escape SAM process. Emits escapeSamBannerClicked and samEscaped events.
   */
  escapeSAM() {
    this.escapeSamBannerClicked.emit(false);
    this.samEscaped.emit(ExitSAMMethodUsed.BANNER);
  }
}
