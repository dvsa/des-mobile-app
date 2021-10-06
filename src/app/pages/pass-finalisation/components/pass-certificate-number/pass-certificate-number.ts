import {
  Component, Input, OnChanges, Output, EventEmitter,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  PassCertificateValidationProvider,
} from '@providers/pass-certificate-validation/pass-certificate-validation';
import {
  PASS_CERTIFICATE_LENGTH,
} from '@providers/pass-certificate-validation/pass-certificate-validation.constants';
import { PASS_CERTIFICATE_NUMBER_CTRL } from './pass-certificate-number.constants';

@Component({
  selector: 'pass-certificate-number',
  templateUrl: './pass-certificate-number.html',
  styleUrls: ['./pass-certificate-number.scss'],
})
export class PassCertificateNumberComponent implements OnChanges {

  constructor(private passCertficateValidationProvider: PassCertificateValidationProvider) {
  }

  @Input()
  passCertificateNumberInput: string;

  @Input()
  form: FormGroup;

  @Output()
  passCertificateNumberChange = new EventEmitter<string>();

  formControl: FormControl;
  static readonly fieldName: string = PASS_CERTIFICATE_NUMBER_CTRL;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null, [
        Validators.maxLength(PASS_CERTIFICATE_LENGTH),
        Validators.minLength(PASS_CERTIFICATE_LENGTH),
        Validators.required,
        this.validatePassCertificate]);
      this.form.addControl(PassCertificateNumberComponent.fieldName, this.formControl);
    }
    this.formControl.patchValue(this.passCertificateNumberInput);
  }

  validatePassCertificate = (c: FormControl) => {
    return this.passCertficateValidationProvider.isPassCertificateValid(c.value) ? null
      : {
        validatePassCertificate: {
          valid: false,
        },
      };
  };

  passCertificateNumberChanged(passCertificateNumber: string): void {
    this.passCertificateNumberChange.emit(passCertificateNumber);
  }

  isInvalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
