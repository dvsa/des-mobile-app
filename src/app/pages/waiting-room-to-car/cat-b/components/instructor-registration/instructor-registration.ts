import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
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

  instructorRegistrationChanged(event: any): void {
    if (
      typeof event.target.value === 'string'
        && !this.instructorRegistrationNumberValidator.pattern.test(event.target.value)
    ) {
      event.target.value = event.target.value
        .replace(leadingZero, '')
        .replace(nonNumericValues, '');
    }
    this.instructorRegistrationChange.emit(Number(event.target.value) || undefined);
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
