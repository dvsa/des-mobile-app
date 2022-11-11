import {
  Component, Input, OnChanges, Output, EventEmitter,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import {
  PassCertificateValidationProvider,
} from '@providers/pass-certificate-validation/pass-certificate-validation';
import {
  PASS_CERTIFICATE_LENGTH,
} from '@providers/pass-certificate-validation/pass-certificate-validation.constants';
import { AppComponent } from '@app/app.component';
import { PASS_CERTIFICATE_NUMBER_CTRL } from './pass-certificate-number.constants';

@Component({
  selector: 'pass-certificate-number',
  templateUrl: './pass-certificate-number.html',
  styleUrls: ['./pass-certificate-number.scss'],
})
export class PassCertificateNumberComponent implements OnChanges {

  constructor(
    private passCertficateValidationProvider: PassCertificateValidationProvider,
    public appComponent: AppComponent,
  ) {
  }

  @Input()
  passCertificateNumberInput: string;

  @Input()
  form: UntypedFormGroup;

  @Output()
  passCertificateNumberChange = new EventEmitter<string>();

  formControl: UntypedFormControl;
  static readonly fieldName: string = PASS_CERTIFICATE_NUMBER_CTRL;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null, [
        Validators.maxLength(PASS_CERTIFICATE_LENGTH),
        Validators.minLength(PASS_CERTIFICATE_LENGTH),
        Validators.required,
        this.validatePassCertificate]);
      this.form.addControl(PassCertificateNumberComponent.fieldName, this.formControl);
    }
    this.formControl.patchValue(this.passCertificateNumberInput);
  }

  validatePassCertificate = (c: UntypedFormControl) => {
    return this.passCertficateValidationProvider.isPassCertificateValid(c.value) ? null
      : {
        validatePassCertificate: {
          valid: false,
        },
      };
  };

  passCertificateNumberChanged(passCertificateNumber: string): void {
    this.passCertificateNumberChange.emit(passCertificateNumber?.toUpperCase());
  }

  isInvalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
