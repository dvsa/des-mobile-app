import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import {
  FieldValidators,
  getInstructorRegistrationNumberValidator,
  leadingZero,
  nonNumericValues,
} from '@shared/constants/field-validators/field-validators';
import { maskPredicate } from '@shared/helpers/formatters';

@Component({
  selector: 'instructor-registration',
  templateUrl: './instructor-registration.html',
  styleUrls: ['./instructor-registration.scss'],
  standalone: false,
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

  getMaskPredicate = (): MaskitoElementPredicate => maskPredicate;

  readonly digitsOnlyMask: MaskitoOptions = {
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
  };

  /**
   * Cleanses the value of the instructor registration number input and emits the change event
   * @param value
   */
  instructorRegistrationChanged(value: string): void {
    const cleansedValue =
      typeof value === 'string' && !this.instructorRegistrationNumberValidator.pattern.test(value)
        ? value.replace(leadingZero, '').replace(nonNumericValues, '')
        : value;
    this.instructorRegistrationChange.emit(Number(cleansedValue) || undefined);
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
