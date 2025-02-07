import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'refresh-button',
  templateUrl: './refresh-button.component.html',
  styleUrls: ['./refresh-button.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class RefreshButtonComponent {
  @Input()
  isDisabled = false;
  @Input()
  lastSyncTime: string;
  @Output()
  refreshButtonClicked = new EventEmitter<void>();

  refreshClicked() {
    this.refreshButtonClicked.emit();
  }
}
