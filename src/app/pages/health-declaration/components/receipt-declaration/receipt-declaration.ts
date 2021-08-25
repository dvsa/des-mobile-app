import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'receipt-declaration',
  templateUrl: 'receipt-declaration.html',
  styleUrls: ['receipt-declaration.scss'],
})
export class ReceiptDeclarationComponent implements OnChanges {

  @Input()
  selected: string;

  @Input()
  formGroup: FormGroup;

  @Input()
  certificateNumber: string;

  @Output()
  receiptDeclarationChange = new EventEmitter();

  formControl: FormControl;
  static readonly fieldName: string = 'receiptCheckbox';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl('', [Validators.requiredTrue]);

      this.formGroup.addControl(ReceiptDeclarationComponent.fieldName, this.formControl);
    }
    this.formControl.patchValue(this.selected);
  }

  receiptDeclarationChanged(): void {
    this.receiptDeclarationChange.emit();
  }

  isInvalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}
