import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
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
  samEscaped = new EventEmitter<void>();

  timeToHold = 1000;
  holdTimeout: NodeJS.Timeout;

  onTouchStart() {
    if (this.isButtonActive) {
      this.holdTimeout = setTimeout(() => {
        this.escapeSAM();
      }, this.timeToHold);
    }
  }

  onTouchEnd() {
    clearTimeout(this.holdTimeout);
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
