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

  /**
   * Trigger emitter to open exit practice mode options
   */
  onClick() {
    this.exitPracticeMode.emit();
  }
}
