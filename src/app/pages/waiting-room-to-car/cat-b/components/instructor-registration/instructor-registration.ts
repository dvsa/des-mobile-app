import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import {
  FieldValidators,
  getInstructorRegistrationNumberValidator,
  leadingZero,
  nonNumericValues,
} from '@shared/constants/field-validators/field-validators';

@Component({
  selector: 'instructor-registration',
  templateUrl: './instructor-registration.html',
})
export class InstructorRegistrationComponent implements OnChanges {
  @Input()
  instructorRegistration: number;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  instructorRegistrationChange = new EventEmitter<number>();

  formControl: UntypedFormControl;

  readonly instructorRegistrationNumberValidator: FieldValidators = getInstructorRegistrationNumberValidator();

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null);
      this.formGroup.addControl('instructorRegistration', this.formControl);
    }
    this.formControl.patchValue(this.instructorRegistration);
  }

  instructorRegistrationChanged(value: string): void {
    if (typeof value === 'string' && !this.instructorRegistrationNumberValidator.pattern.test(value)) {
      value = value.replace(leadingZero, '').replace(nonNumericValues, '');
    }
    this.instructorRegistrationChange.emit(Number(value) || undefined);
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
