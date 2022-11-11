import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { merge, Observable, Subscription } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import {
  getFullLicenceHeld,
  getVehicleChecksCatC,
  hasFullLicenceHeldBeenSelected,
} from '@store/tests/test-data/cat-c/vehicle-checks/vehicle-checks.cat-c.selector';
import { getTestData } from '@store/tests/test-data/cat-c/test-data.cat-c.reducer';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { StoreModel } from '@shared/models/store.model';
import { vehicleChecksQuestionsByLicenceHeld } from '@shared/helpers/vehicle-checks-questions-by-category';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { wrtcDestroy$ } from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';

enum VehicleChecksCompletedResult {
  COMPLETED = 'Completed',
  NOT_COMPLETED = 'Not completed',
}

interface ComponentState {
  fullLicenceHeld$: Observable<boolean>;
  fullLicenceHeldSelection$: Observable<string>;
  drivingFaultsNumberOptions$: Observable<number[]>;
}

@Component({
  selector: 'vehicle-checks-completed',
  templateUrl: 'vehicle-checks-completed.html',
  styleUrls: ['vehicle-checks-completed.scss'],
})
export class VehicleChecksToggleComponent implements OnChanges {

  formControl: UntypedFormControl;
  componentState: ComponentState;
  drivingFaultNumberFormControl: UntypedFormControl;
  subscription: Subscription;
  merged$: Observable<boolean>;
  drivingFaultsNumberOptions: number[] = [];

  @Input()
  vehicleChecksCompleted: boolean;

  @Input()
  testCategory: TestCategory | CategoryCode;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  vehicleChecksCompletedOutcomeChange = new EventEmitter<boolean>();

  @Output()
  vehicleChecksDrivingFaultsNumberChange = new EventEmitter<number>();

  constructor(private store$: Store<StoreModel>) {}

  ngOnInit() {
    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.componentState = {
      fullLicenceHeld$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatC),
        select(getFullLicenceHeld),
      ),
      fullLicenceHeldSelection$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatC),
        select(getFullLicenceHeld),
        map((licenceHeld: boolean) => hasFullLicenceHeldBeenSelected(licenceHeld)),
      ),
      drivingFaultsNumberOptions$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatC),
        select(getFullLicenceHeld),
        map((licenceHeld) => Array(vehicleChecksQuestionsByLicenceHeld(licenceHeld) + 1).fill(null).map((v, i) => i)),
      ),
    };

    const { fullLicenceHeld$ } = this.componentState;

    const merged$ = merge(
      fullLicenceHeld$.pipe(
        tap(() => {
          // when fullLicenceHeld changes, then set the fault count dropdown back to a null in it's default state
          this.drivingFaultNumberFormControl.markAsPristine({ onlySelf: true });
          this.drivingFaultNumberFormControl.patchValue(null);
        }),
      ),
    );

    this.subscription = merged$.pipe(takeUntil(wrtcDestroy$)).subscribe();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl('', [Validators.required]);
      this.formGroup.addControl('vehicleChecksToggleCtrl', this.formControl);
    }
    if (!this.drivingFaultNumberFormControl) {
      this.drivingFaultNumberFormControl = new UntypedFormControl(null, [Validators.required]);
      this.formGroup.addControl('vehicleChecksDrivingFaultsNumber', this.drivingFaultNumberFormControl);
    }
    this.formControl.patchValue(this.vehicleChecksCompleted);
  }

  vehicleChecksToggleResultChanged(result: string): void {
    if (this.formControl.valid) {
      this.vehicleChecksCompletedOutcomeChange.emit(result === VehicleChecksCompletedResult.COMPLETED);
    }
  }

  vehicleChecksDrivingFaultsNumberChanged(number: number) {
    this.vehicleChecksDrivingFaultsNumberChange.emit(number);
  }

  get invalidDropdown(): boolean {
    return !this.drivingFaultNumberFormControl.valid && this.drivingFaultNumberFormControl.dirty;
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  get interfaceOptions() {
    return {
      cssClass: 'mes-select vehicle-checks-question-select',
      backdropDismiss: false,
    };
  }
}
