import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { EmojiBlockDirective } from '@directives/emoji-block.directive';
import { PasteSanitiserDirective } from '@directives/paste-sanitiser';
import { IonButton, IonCard, IonCol, IonInput, IonRow, IonText, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import {
  FieldValidators,
  getRegistrationNumberValidator,
  nonAlphaNumericValues,
} from '@shared/constants/field-validators/field-validators';
import { StoreModel } from '@shared/models/store.model';
import { selectCurrentTest } from '@store/tests/tests.selector';
import { getVehicleDetails } from '@store/tests/vehicle-details/vehicle-details.reducer';
import { getRegistrationNumber } from '@store/tests/vehicle-details/vehicle-details.selector';
@Component({
  selector: 'vrn-capture-modal',
  templateUrl: './vrn-capture-modal.html',
  styleUrls: ['./vrn-capture-modal.scss'],
  imports: [
    IonCard,
    FormsModule,
    ReactiveFormsModule,
    IonRow,
    IonCol,
    IonText,
    IonInput,
    EmojiBlockDirective,
    PasteSanitiserDirective,
    IonButton,
  ],
})
export class VRNCaptureModal implements OnInit {
  @Input()
  public textZoom: string;
  private readonly currentTest = this.store$.selectSignal(selectCurrentTest);
  vehicleRegistrationNumber: string;
  formGroup: UntypedFormGroup;
  vehicleRegistrationFormControlName = 'vehicleRegistration';
  formInvalid = false;

  readonly registrationNumberValidator: FieldValidators = getRegistrationNumberValidator();

  constructor(
    public modalController: ModalController,
    private store$: Store<StoreModel>
  ) {
    this.formGroup = new UntypedFormGroup({});
    this.formGroup.addControl(
      this.vehicleRegistrationFormControlName,
      new UntypedFormControl(null, [
        Validators.required,
        Validators.pattern('^[A-Z0-9]{1,7}$'),
        Validators.maxLength(Number.parseInt(getRegistrationNumberValidator().maxLength, 10)),
      ])
    );
  }

  ngOnInit(): void {
    this.vehicleRegistrationNumber = getRegistrationNumber(getVehicleDetails(this.currentTest()));
  }

  inputChange(input: string) {
    const sanitisedInput = input.toUpperCase().replace(nonAlphaNumericValues, '');
    this.vehicleRegistrationNumber = sanitisedInput;
    this.vehicleRegistrationFormControl.patchValue(sanitisedInput, {
      emitEvent: false,
      emitViewToModelChange: false,
    });
    this.formInvalid = this.vehicleRegistrationFormControl.dirty && this.vehicleRegistrationFormControl.invalid;
  }

  async validateThenDismiss() {
    if (this.registrationNumberValidator.pattern.test(this.vehicleRegistrationNumber)) {
      await this.modalController.dismiss({ vehicleRegNumber: this.vehicleRegistrationNumber });
    }
  }

  get vehicleRegistrationFormControl(): AbstractControl {
    return this.formGroup.get('vehicleRegistration');
  }
}
