import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { vehicleChecksQuestionsByCategory } from '@shared/helpers/vehicle-checks-questions-by-category';

enum VehicleChecksCompletedResult {
  COMPLETED = 'Completed',
  NOT_COMPLETED = 'Not completed',
}

@Component({
  selector: 'vehicle-checks-completed',
  templateUrl: 'vehicle-checks-completed.html',
})
export class VehicleChecksToggleComponent implements OnChanges {

  formControl: FormControl;
  drivingFaultNumberFormControl: FormControl;

  @Input()
  vehicleChecksCompleted: boolean;

  @Input()
  testCategory: TestCategory;

  @Input()
  formGroup: FormGroup;

  @Output()
  vehicleChecksCompletedOutcomeChange = new EventEmitter<boolean>();

  @Output()
  vehicleChecksDrivingFaultsNumberChange = new EventEmitter<number>();

  drivingFaultsNumberOptions: number[];

  ngOnInit(): void {
    this.drivingFaultsNumberOptions = Array(
      vehicleChecksQuestionsByCategory(this.testCategory) + 1,
    ).fill(null).map((v, i) => i);
  }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl('', [Validators.required]);
      this.formGroup.addControl('vehicleChecksToggleCtrl', this.formControl);
    }
    if (!this.drivingFaultNumberFormControl) {
      this.drivingFaultNumberFormControl = new FormControl();
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

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
