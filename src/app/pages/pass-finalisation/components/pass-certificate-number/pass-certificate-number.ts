import {
  Component, EventEmitter, Input, OnChanges, Output,
} from '@angular/core';
import {
  UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators,
} from '@angular/forms';
import { PassCertificateValidationProvider } from '@providers/pass-certificate-validation/pass-certificate-validation';
import { PASS_CERTIFICATE_LENGTH } from '@providers/pass-certificate-validation/pass-certificate-validation.constants';
import { AppComponent } from '@app/app.component';
import { PASS_CERTIFICATE_NUMBER_CTRL } from './pass-certificate-number.constants';

@Component({
  selector: 'pass-certificate-number',
  templateUrl: './pass-certificate-number.html',
  styleUrls: ['./pass-certificate-number.scss'],
})
export class PassCertificateNumberComponent implements OnChanges {

  static readonly fieldName: string = PASS_CERTIFICATE_NUMBER_CTRL;
  @Input()
  passCertificateNumberInput: string;

  @Input()
  pastPassCerts: string[] = [];

  @Input()
  form: UntypedFormGroup;

  @Input()
  isPracticeMode: boolean = false;

  @Output()
  passCertificateNumberChange = new EventEmitter<string>();

  errors: { duplicate: string; invalid: string; } = {
    duplicate: 'Enter an unused certificate number (8 characters)',
    invalid: 'Enter a valid certificate number (8 characters)',
  };

  formControl: UntypedFormControl;

  constructor(
    private passCertficateValidationProvider: PassCertificateValidationProvider,
    public appComponent: AppComponent,
  ) {
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null, [
        Validators.maxLength(PASS_CERTIFICATE_LENGTH),
        Validators.minLength(PASS_CERTIFICATE_LENGTH),
        Validators.required,
        this.validatePassCertificate,
      ]);
      this.form.addControl(PassCertificateNumberComponent.fieldName, this.formControl);
    }
    this.formControl.patchValue(this.passCertificateNumberInput);
  }

  validatePassCertificate = (c: UntypedFormControl): ValidationErrors | null => {
    // check validity of input
    if (!this.passCertficateValidationProvider.isPassCertificateValid(c.value)) {
      return {
        valid: false,
      };
    }

    // whilst not in practice mode
    if (!this.isPracticeMode) {
      // check if user has already inputted pass cert
      const hasPassCertBeenUsed = this.pastPassCerts.includes(c.value?.toUpperCase());
      if (hasPassCertBeenUsed) {
        return {
          valid: true,
          duplicate: true,
        };
      }
    }
    // valid pass cert and not a duplicate
    return null;
  };

  passCertificateNumberChanged(passCertificateNumber: string): void {
    this.passCertificateNumberChange.emit(passCertificateNumber?.toUpperCase());
  }
}
