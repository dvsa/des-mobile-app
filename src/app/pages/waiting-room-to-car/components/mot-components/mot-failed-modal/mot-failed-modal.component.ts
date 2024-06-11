import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  FieldValidators,
  getRegistrationNumberValidator,
  nonAlphaNumericValues,
} from '@shared/constants/field-validators/field-validators';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { isEmpty } from 'lodash-es';
import { ModalEvent } from '@pages/journal/components/journal-force-check-modal/journal-force-check-modal.constants';

@Component({
  selector: 'mot-failed-modal',
  templateUrl: './mot-failed-modal.component.html',
  styleUrls: ['./mot-failed-modal.component.scss'],
})
export class MotFailedModal implements OnInit {

  readonly registrationNumberValidator: FieldValidators = getRegistrationNumberValidator();

  @Input()
  originalRegistration: string;

  formControl: UntypedFormControl;
  form: UntypedFormGroup;
  vehicleRegistration: string;
  ifMatches: boolean = true;

  constructor(
    public modalCtrl: ModalController,
  ) {
  }

  ngOnInit() {
    this.form = new UntypedFormGroup({});
    this.formControl = new UntypedFormControl(null, [Validators.required]);
    this.form.addControl('vehicleRegistration', this.formControl);
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  vehicleRegistrationChanged(event: any): void {
    if (
      typeof event.target.value === 'string'
      && !this.registrationNumberValidator.pattern.test(event.target.value)
    ) {
      event.target.value = event.target.value?.replace(nonAlphaNumericValues, '');

      if (isEmpty(event.target.value)) {
        this.formControl.setErrors({ invalidValue: event.target.value });
      }
    }
    this.vehicleRegistration = event.target.value?.toUpperCase();
  }

  async onConfirm() {
    if (this.formControl.value.toUpperCase() === this.originalRegistration.toUpperCase()) {
      await this.modalCtrl.dismiss(this.formControl.value.toUpperCase());
    } else {
      this.ifMatches = false;
    }
  }
  onCancel = async (): Promise<void> => {
    await this.modalCtrl.dismiss(ModalEvent.CANCEL);
  };
}
