import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'receipt-declaration',
  templateUrl: 'receipt-declaration.html',
  styleUrls: ['receipt-declaration.scss'],
})
export class ReceiptDeclarationComponent implements OnChanges {

  @Input()
  selected: boolean;

  @Input()
  formGroup: UntypedFormGroup;

  @Input()
  certificateNumber: string;

  @Output()
  receiptDeclarationChange = new EventEmitter();

  formControl: UntypedFormControl;
  static readonly fieldName: string = 'receiptCheckbox';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl('', [Validators.requiredTrue]);

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
