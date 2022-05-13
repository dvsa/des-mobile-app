import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PassCertificateValidationProvider } from '@providers/pass-certificate-validation/pass-certificate-validation';
import { PASS_CERTIFICATE_LENGTH } from '@providers/pass-certificate-validation/pass-certificate-validation.constants';

@Component({
  selector: 'manoeuvres-pass-cert',
  templateUrl: 'manoeuvres-pass-cert.html',
  styleUrls: ['manoeuvres-pass-cert.scss'],
})
export class ManoeuvresPassCertificateComponent implements OnChanges {

  @Input()
  manoeuvresPassCertificateNumber: string;

  @Input()
  formGroup: FormGroup;

  @Output()
  manoeuvresPassCertificateNumberChange = new EventEmitter<string>();

  formControl: FormControl;
  static readonly fieldName: string = 'manoeuvresPassCertificateNumberCtrl';

  constructor(private passCertValidationProvider: PassCertificateValidationProvider) {
  }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null, [
        Validators.maxLength(PASS_CERTIFICATE_LENGTH),
        Validators.minLength(PASS_CERTIFICATE_LENGTH),
        Validators.required,
        this.validateManoeuvresPassCertificate,
      ]);
      this.formGroup.addControl(ManoeuvresPassCertificateComponent.fieldName, this.formControl);
    }
    this.formControl.patchValue(this.manoeuvresPassCertificateNumber);
  }

  validateManoeuvresPassCertificate = (c: FormControl) => {
    return this.passCertValidationProvider.isPassCertificateValid(c.value) ? null
      : {
        validatePassCertificate: {
          valid: false,
        },
      };
  };

  manoeuvresPassCertificateNumberChanged(passCertificateNumber: string): void {
    this.manoeuvresPassCertificateNumberChange.emit(passCertificateNumber?.toUpperCase());
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
