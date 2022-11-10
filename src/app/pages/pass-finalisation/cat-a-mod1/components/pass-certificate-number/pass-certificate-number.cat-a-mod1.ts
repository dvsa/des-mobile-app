import {
  Component, Input, OnChanges, Output, EventEmitter,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  getByteCount,
  getPassCertificateAMOD1Validator,
} from '@shared/constants/field-validators/field-validators';
import { AppComponent } from '@app/app.component';
import { PASS_CERTIFICATE_NUMBER_CTRL } from './pass-certificate-number.cat-a-mod1.constants';

@Component({
  selector: 'pass-certificate-number-cat-a-mod1',
  templateUrl: 'pass-certificate-number.cat-a-mod1.html',
})
export class PassCertificateNumberCatAMod1Component implements OnChanges {

  @Input()
  passCertificateNumberInput: string;

  @Input()
  form: FormGroup;

  @Output()
  passCertificateNumberChange = new EventEmitter<string>();

  formControl: FormControl;

  static readonly fieldName: string = PASS_CERTIFICATE_NUMBER_CTRL;

  readonly passCertificateAMOD1Validator = getPassCertificateAMOD1Validator();

  constructor(
    public appComponent: AppComponent,
  ) {
  }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null, [
        Validators.pattern(this.passCertificateAMOD1Validator.pattern),
        Validators.required,
      ]);
      this.form.addControl(PassCertificateNumberCatAMod1Component.fieldName, this.formControl);
    }
    this.formControl.patchValue(this.passCertificateNumberInput);
    this.formControl.updateValueAndValidity();
  }

  passCertificateNumberChanged(passCertificateNumber: string): void {
    const actualLength: number = getByteCount(passCertificateNumber);
    const permittedLength: number = this.passCertificateAMOD1Validator.maxByteLength;
    const validFormat: boolean = this.passCertificateAMOD1Validator.pattern.test(passCertificateNumber);

    if (actualLength > permittedLength) {
      this.formControl.setErrors({ actualLength, permittedLength, value: passCertificateNumber });
    } else if (!validFormat) {
      this.formControl.setErrors({ invalidFormat: passCertificateNumber });
    }

    this.formControl.updateValueAndValidity();
    this.passCertificateNumberChange.emit(passCertificateNumber?.toUpperCase());
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
