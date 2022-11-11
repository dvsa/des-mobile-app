import {
  Component, EventEmitter, Input, OnChanges, Output,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'valid-certificate',
  templateUrl: 'valid-certificate.html',
})
export class ValidCertificateComponent implements OnChanges {
  @Input()
  validCertificate: boolean;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  validCertificateChange = new EventEmitter<boolean>();

  private formControl: UntypedFormControl;
  private formField: string = 'validCertificate';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null, [Validators.requiredTrue]);
      this.formGroup.addControl(this.formField, this.formControl);
    }

    if (this.validCertificate === true || this.validCertificate === false) {
      this.formControl.patchValue(this.validCertificate);
    }
  }

  validCertificateChanged(validCertificate:string): void {
    if (this.formControl.valid) {
      this.validCertificateChange.emit(validCertificate === 'valid-certificate-yes');
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
