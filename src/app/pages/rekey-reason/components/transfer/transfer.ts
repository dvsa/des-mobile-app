import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'transfer',
  templateUrl: 'transfer.html',
})
export class TransferComponent implements OnChanges {

  static readonly checkBoxCtrl: string = 'transferSelected';
  static readonly fieldName: string = 'staffNumber';
  private checkBoxFormControl: FormControl;
  private formControl: FormControl;

  @Input()
  selected: boolean;

  @Input()
  staffNumber: number;

  @Input()
  isStaffNumberInvalid: boolean;

  @Input()
  formGroup: FormGroup;

  @Output()
  selectedChange = new EventEmitter<boolean>();

  @Output()
  staffNumberChange = new EventEmitter<number>();

  ngOnChanges(): void {
    if (!this.checkBoxFormControl) {
      this.checkBoxFormControl = new FormControl(null);
      this.formGroup.addControl(TransferComponent.checkBoxCtrl, this.checkBoxFormControl);
    }

    if (!this.formControl) {
      this.formControl = new FormControl(null);
      this.formGroup.addControl(TransferComponent.fieldName, this.formControl);
    }

    if (this.selected) {
      this.formGroup.get(TransferComponent.fieldName).setValidators([Validators.required]);
    } else {
      this.formGroup.get(TransferComponent.fieldName).clearValidators();
    }

    this.checkBoxFormControl.patchValue(!!this.selected);
    this.formControl.patchValue(this.staffNumber);
  }

  selectedValueChanged(selected: boolean): void {
    if (!selected) {
      this.formGroup.get(TransferComponent.fieldName).reset();
    }
    this.selectedChange.emit(selected);
  }

  staffNumberValueChanged(staffNumber: string): void {
    this.staffNumberChange.emit(parseInt(staffNumber, 10) ? parseInt(staffNumber, 10) : null);
  }

  get invalid(): boolean {
    return (!this.formControl.valid || this.isStaffNumberInvalid) && this.formControl.dirty;
  }

  get empty(): boolean {
    return !this.formControl.value && this.formControl.dirty;
  }

}
