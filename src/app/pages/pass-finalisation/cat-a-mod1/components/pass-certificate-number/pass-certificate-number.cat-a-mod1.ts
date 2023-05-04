import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { getByteCount, getPassCertificateAMOD1Validator } from '@shared/constants/field-validators/field-validators';
import { AppComponent } from '@app/app.component';
import { PASS_CERTIFICATE_NUMBER_CTRL } from './pass-certificate-number.cat-a-mod1.constants';

@Component({
  selector: 'pass-certificate-number-cat-a-mod1',
  templateUrl: 'pass-certificate-number.cat-a-mod1.html',
})
export class PassCertificateNumberCatAMod1Component implements OnChanges {

  static readonly fieldName: string = PASS_CERTIFICATE_NUMBER_CTRL;

  @Input()
  passCertificateNumberInput: string;

  @Input()
  form: UntypedFormGroup;

  @Input()
  pastPassCerts: string[] = [];

  @Input()
  isPracticeMode: boolean = false;

  @Output()
  passCertificateNumberChange = new EventEmitter<string>();

  errors = {
    duplicate: 'This certificate number has been used. Please enter a different number.',
    invalid: 'Enter a valid certificate number (7 characters)',
  };
  formControl: UntypedFormControl;
  readonly passCertificateAMOD1Validator = getPassCertificateAMOD1Validator();

  constructor(
    public appComponent: AppComponent,
  ) {
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null, [
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
      this.formControl.setErrors({
        actualLength,
        permittedLength,
        value: passCertificateNumber,
      });
    } else if (!validFormat) {
      this.formControl.setErrors({ invalidFormat: passCertificateNumber });
    } else if (validFormat && this.pastPassCerts?.includes(passCertificateNumber.toUpperCase())) {
      this.formControl.setErrors({
        duplicate: true,
        value: passCertificateNumber,
      });
    }

    this.formControl.updateValueAndValidity();
    this.passCertificateNumberChange.emit(passCertificateNumber?.toUpperCase());
  }
}
