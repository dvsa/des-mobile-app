import {
  Component,
  OnChanges,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  ProvisionalLicenseReceived,
  ProvisionalLicenseNotReceived,
} from
  '@store/tests/pass-completion/pass-completion.actions';

enum ValidLicenceProvidedValues {
  YES = 'yes',
  NO = 'no',
}

@Component({
  selector: 'license-provided',
  templateUrl: './license-provided.html',
  styleUrls: ['./license-provided.scss'],
})

export class LicenseProvidedComponent implements OnChanges {

  @Input()
  license: boolean;

  @Output()
  licenseReceived = new EventEmitter<typeof ProvisionalLicenseReceived>();

  @Input()
  licenseReceivedLabel: string;

  @Output()
  licenseNotReceived = new EventEmitter<typeof ProvisionalLicenseNotReceived>();

  @Input()
  form: FormGroup;

  formControl: FormControl;
  static readonly fieldName: string = 'provisionalLicenseProvidedCtrl';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl('', [Validators.required]);
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
