import { Component, EventEmitter, Output } from '@angular/core';
import { IonButton, IonText } from '@ionic/angular';

@Component({
  selector: 'modal-return-button',
  templateUrl: './modal-return-button.html',
  styleUrls: ['./modal-return-button.scss'],
  imports: [IonButton, IonText],
})
export class ModalReturnButtonComponent {
  @Output()
  onClick = new EventEmitter<void>();

  onReturnClicked() {
    this.onClick.emit();
  }
}
