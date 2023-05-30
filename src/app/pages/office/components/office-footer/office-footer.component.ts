import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';

@Component({
  selector: 'office-footer',
  templateUrl: './office-footer.component.html',
  styleUrls: ['./office-footer.component.scss'],
})
export class OfficeFooterComponent {

  @Input()
  isRekey: boolean;
  @Input()
  isValidStartDateTime: boolean;
  @Input()
  isDelegated: boolean = false;

  @Output()
  saveClicked = new EventEmitter<void>();
  @Output()
  submitClicked = new EventEmitter<boolean>();
  @Output()
  continueClicked = new EventEmitter<void>();

  saveClick() {
    this.saveClicked.emit();
  }

  submitClick() {
    this.submitClicked.emit(this.isDelegated);
  }

  continueClick() {
    this.continueClicked.emit();
  }
}
