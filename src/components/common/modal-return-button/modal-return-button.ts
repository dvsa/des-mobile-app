import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'modal-return-button',
  templateUrl: 'modal-return-button.html',
})
export class ModalReturnButtonComponent {
  @Output()
  onClick = new EventEmitter<void>();

  onReturnClicked() {
    this.onClick.emit();
  }
}
