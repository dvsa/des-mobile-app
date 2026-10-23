import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {
  FieldValidators,
  getTrainerRegistrationNumberValidator,
} from '@shared/constants/field-validators/field-validators';

@Component({
  selector: 'trainer-registration-number-cat-adi-part2',
  templateUrl: 'trainer-registration-number.cat-adi-part2.html',
  standalone: false,
})
export class TrainerRegistrationNumberCatAdiPart2Component implements OnChanges {
  @Input()
  trainerRegistration: number;

  @Input()
  formGroup: UntypedFormGroup;

  @Input()
  trainerLabel = `Trainer's PRN (optional)`;

  @Output()
  trainerRegistrationChange = new EventEmitter<number>();

  formControl: UntypedFormControl;
  static readonly fieldName: string = 'trainerRegistrationCtrl';

  readonly trainerRegistrationNumberValidator: FieldValidators = getTrainerRegistrationNumberValidator();

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null, [
        Validators.maxLength(Number(this.trainerRegistrationNumberValidator.maxLength)),
      ]);
      this.formGroup.addControl(TrainerRegistrationNumberCatAdiPart2Component.fieldName, this.formControl);
    }

    this.formControl.patchValue(
      this.trainerRegistration !== null && this.trainerRegistration !== undefined
        ? String(this.trainerRegistration)
        : ''
    );
    this.formControl.updateValueAndValidity();
    this.formGroup.get(TrainerRegistrationNumberCatAdiPart2Component.fieldName)?.updateValueAndValidity();
  }

  trainerRegistrationChanged(trainerNumber: string): void {
    console.log('quick swap', trainerNumber);
    this.trainerRegistrationChange.emit(trainerNumber ? Number(trainerNumber) : null);
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  protected readonly Number = Number;
}
