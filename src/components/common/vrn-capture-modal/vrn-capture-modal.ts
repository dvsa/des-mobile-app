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
import { Store, select } from '@ngrx/store';
import {
  FieldValidators,
  getRegistrationNumberValidator,
  nonAlphaNumericValues,
} from '@shared/constants/field-validators/field-validators';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getVehicleDetails } from '@store/tests/vehicle-details/vehicle-details.reducer';
import { getRegistrationNumber } from '@store/tests/vehicle-details/vehicle-details.selector';
import { Observable, Subscription, merge } from 'rxjs';
import { map } from 'rxjs/operators';

interface ComponentState {
  vehicleRegistration$: Observable<string>;
}

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
  componentState: ComponentState;
  merged$: Observable<string>;
  subscription: Subscription;
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
    const currentTest$ = this.store$.pipe(select(getTests), select(getCurrentTest));

    this.componentState = {
      vehicleRegistration$: currentTest$.pipe(select(getVehicleDetails), select(getRegistrationNumber)),
    };

    const { vehicleRegistration$ } = this.componentState;

    this.merged$ = merge(vehicleRegistration$.pipe(map((regNum) => (this.vehicleRegistrationNumber = regNum))));

    this.subscription = this.merged$?.subscribe();
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
