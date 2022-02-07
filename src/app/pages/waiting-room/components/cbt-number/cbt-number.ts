import {
  Component, Input, EventEmitter, Output, OnChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { getDL196CBTCertificateNumberValidator } from '@shared/constants/field-validators/field-validators';

@Component({
  selector: 'cbt-number',
  templateUrl: 'cbt-number.html',
  styleUrls: ['cbt-number.scss'],
})
export class CBTNumberComponent implements OnChanges {

  @Input()
  cbtNumber: string;

  @Input()
  formGroup: FormGroup;

  @Output()
  cbtNumberChange = new EventEmitter<string>();

  formControl: FormControl;
  static readonly fieldName: string = 'cbtNumber';
  readonly dl196cbtCertNumberValidator = getDL196CBTCertificateNumberValidator();

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null, [
        Validators.maxLength(+this.dl196cbtCertNumberValidator.maxLength),
        Validators.minLength(+this.dl196cbtCertNumberValidator.maxLength),
        Validators.pattern(this.dl196cbtCertNumberValidator.pattern),
      ]);
      this.formGroup.addControl(CBTNumberComponent.fieldName, this.formControl);
    }
    this.formControl.patchValue(this.cbtNumber);
  }

  cbtNumberChanged(cbtNumber: string): void {
    this.cbtNumberChange.emit(cbtNumber);
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
