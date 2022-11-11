import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import {
  FieldValidators,
  getTrainerRegistrationNumberValidator,
  leadingZero,
  nonNumericValues,
} from '@shared/constants/field-validators/field-validators';

@Component({
  selector: 'trainer-registration-number-cat-adi-part2',
  templateUrl: 'trainer-registration-number.cat-adi-part2.html',
})
export class TrainerRegistrationNumberCatAdiPart2Component implements OnChanges {

  @Input()
  trainerRegistration: number;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  trainerRegistrationChange = new EventEmitter<number>();

  formControl: UntypedFormControl;

  readonly trainerRegistrationNumberValidator: FieldValidators = getTrainerRegistrationNumberValidator();

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null);
      this.formGroup.addControl('trainerRegistration', this.formControl);
    }
    this.formControl.patchValue(this.trainerRegistration);
  }

  trainerRegistrationChanged(event: any): void {
    if (
      typeof event.target.value === 'string'
        && !this.trainerRegistrationNumberValidator.pattern.test(event.target.value)
    ) {
      event.target.value = event.target.value
        .replace(leadingZero, '')
        .replace(nonNumericValues, '');
    }
    this.trainerRegistrationChange.emit(Number(event.target.value) || undefined);
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
