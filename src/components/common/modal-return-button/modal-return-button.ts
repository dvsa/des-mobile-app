import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'modal-return-button',
  templateUrl: './modal-return-button.html',
  styleUrls: ['./modal-return-button.scss'],
})
export class ModalReturnButtonComponent {
  @Output()
  onClick = new EventEmitter<void>();

  onReturnClicked() {
    this.onClick.emit();
  }
}
