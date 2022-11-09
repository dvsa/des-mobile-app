import { Component, OnInit } from '@angular/core';
import {
  AbstractControl, UntypedFormControl, UntypedFormGroup, Validators,
} from '@angular/forms';
import {
  FieldValidators,
  getRegistrationNumberValidator,
  nonAlphaNumericValues,
} from '@shared/constants/field-validators/field-validators';
import { ModalController, NavParams } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getVehicleDetails } from '@store/tests/vehicle-details/vehicle-details.reducer';
import { getRegistrationNumber } from '@store/tests/vehicle-details/vehicle-details.selector';
import { map } from 'rxjs/operators';
import { merge, Observable, Subscription } from 'rxjs';
import { AppComponent } from '@app/app.component';

interface ComponentState {
  vehicleRegistration$: Observable<string>;
}

@Component({
  selector: 'vrn-capture-modal',
  templateUrl: './vrn-capture-modal.html',
  styleUrls: ['./vrn-capture-modal.scss'],
})
export class VRNCaptureModal implements OnInit {

  componentState: ComponentState;
  merged$: Observable<string>;
  subscription: Subscription;
  vehicleRegistrationNumber: string;
  formGroup: UntypedFormGroup;
  vehicleRegistrationFormControlName: string = 'vehicleRegistration';
  formInvalid: boolean = false;
  textZoom: string = this.navParams.get('textZoom');

  readonly registrationNumberValidator: FieldValidators = getRegistrationNumberValidator();

  constructor(
    public modalController: ModalController,
    private store$: Store<StoreModel>,
    public appComponent: AppComponent,
    public navParams: NavParams,
  ) {
    this.formGroup = new UntypedFormGroup({});
    this.formGroup.addControl(
      this.vehicleRegistrationFormControlName, new UntypedFormControl(
        null, [
          Validators.required,
          Validators.pattern('^[A-Z0-9]{1,7}$'),
          Validators.maxLength(parseInt(getRegistrationNumberValidator().maxLength, 10)),
        ],
      ),
    );
  }

  ngOnInit(): void {
    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.componentState = {
      vehicleRegistration$: currentTest$.pipe(
        select(getVehicleDetails),
        select(getRegistrationNumber),
      ),
    };

    const {
      vehicleRegistration$,
    } = this.componentState;

    this.merged$ = merge(
      vehicleRegistration$.pipe(map((regNum) => this.vehicleRegistrationNumber = regNum)),
    );

    this.subscription = this.merged$?.subscribe();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  inputChange(input: any) {
    if (typeof input === 'string') {
      input = input.toUpperCase().replace(nonAlphaNumericValues, '');
      this.vehicleRegistrationNumber = input;
      this.vehicleRegistrationFormControl.patchValue(input, {
        emitEvent: false,
        emitViewToModelChange: false,
      });
    }
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
