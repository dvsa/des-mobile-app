import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
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
  formGroup: UntypedFormGroup;

  @Output()
  cbtNumberChange = new EventEmitter<string>();

  formControl: UntypedFormControl;
  static readonly fieldName: string = 'cbtNumber';
  readonly dl196cbtCertNumberValidator = getDL196CBTCertificateNumberValidator();

  constructor(public accessibilityService: AccessibilityService) {}

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null, [
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
