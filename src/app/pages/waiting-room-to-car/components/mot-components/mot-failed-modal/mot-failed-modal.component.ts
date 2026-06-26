import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { InvalidMotModalValidationError } from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import {
  FieldValidators,
  getRegistrationNumberValidator,
  nonAlphaNumericValues,
} from '@shared/constants/field-validators/field-validators';
import { StoreModel } from '@shared/models/store.model';
import { isEmpty } from 'lodash-es';

export enum ModalEvent {
  CANCEL = 'cancel',
  CONFIRM = 'confirm',
}

@Component({
  selector: 'mot-failed-modal',
  templateUrl: './mot-failed-modal.component.html',
  styleUrls: ['./mot-failed-modal.component.scss'],
  standalone: false,
})
export class MotFailedModal implements OnInit {
  readonly registrationNumberValidator: FieldValidators = getRegistrationNumberValidator();

  @Input()
  originalRegistration: string;

  formControl: UntypedFormControl;
  form: UntypedFormGroup;
  vehicleRegistration: string;
  ifMatches = true;

  constructor(
    public store$: Store<StoreModel>,
    public modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.form = new UntypedFormGroup({});
    this.formControl = new UntypedFormControl(null, [Validators.required]);
    this.form.addControl('vehicleRegistration', this.formControl);
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  /**
   * Checks input against pattern and sanitises the value if it does not match, then sets the vehicleRegistration property to the upper case version of the value
   * @param value
   */
  vehicleRegistrationChanged(value: string): void {
    const needsSanitising = typeof value === 'string' && !this.registrationNumberValidator.pattern.test(value);
    const sanitisedValue = needsSanitising ? value?.replace(nonAlphaNumericValues, '') : value;

    if (needsSanitising && isEmpty(sanitisedValue)) {
      this.formControl.setErrors({ invalidValue: sanitisedValue });
    }
    this.vehicleRegistration = sanitisedValue?.toUpperCase();
  }

  async onConfirm() {
    if (this.formControl.value.toUpperCase() === this.originalRegistration.toUpperCase()) {
      await this.modalCtrl.dismiss(this.formControl.value.toUpperCase());
    } else {
      this.store$.dispatch(InvalidMotModalValidationError());
      this.ifMatches = false;
    }
  }
  onCancel = async (): Promise<void> => {
    await this.modalCtrl.dismiss(ModalEvent.CANCEL);
  };
}
