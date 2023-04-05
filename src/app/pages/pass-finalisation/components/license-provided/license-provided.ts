import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

enum ValidLicenceProvidedValues {
  YES = 'yes',
  NO = 'no',
}

@Component({
  selector: 'license-provided',
  templateUrl: './license-provided.html',
})
export class LicenseProvidedComponent implements OnChanges {

  static readonly fieldName: string = 'provisionalLicenseProvidedCtrl';
  @Input()
  license: boolean;
  @Output()
  licenseReceived = new EventEmitter<void>();
  @Input()
  licenseReceivedLabel: string;
  @Output()
  licenseNotReceived = new EventEmitter<void>();
  @Input()
  form: UntypedFormGroup;
  formControl: UntypedFormControl;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl('', [Validators.required]);
      this.form.addControl(LicenseProvidedComponent.fieldName, this.formControl);
    }

    if (this.license !== null) {
      this.formControl.patchValue(this.license ? ValidLicenceProvidedValues.YES : ValidLicenceProvidedValues.NO);
    } else {
      this.formControl.patchValue(null);
    }
  }

  isInvalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  provisionalLicenseReceived(): void {
    this.licenseReceived.emit();
  }

  provisionalLicenseNotReceived(): void {
    this.licenseNotReceived.emit();
  }
}
