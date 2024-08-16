import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IndependentDriving } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { OutcomeBehaviourMapProvider, VisibilityType } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { getDrivingOrRidingLabel } from '@shared/helpers/driver-type';
import { removeNonAlphaNumeric } from '@shared/helpers/formatters';

@Component({
  selector: 'independent-driving',
  templateUrl: 'independent-driving.html',
})
export class IndependentDrivingComponent implements OnChanges {
  @Input()
  display: boolean;

  @Input()
  outcome: string;

  @Input()
  category: TestCategory | null;

  @Input()
  option1: IndependentDriving;

  @Input()
  option2: IndependentDriving;

  @Input()
  option1label: string;

  @Input()
  option2label: string;

  @Input()
  independentDriving: IndependentDriving;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  independentDrivingChange = new EventEmitter<IndependentDriving>();

  showNotApplicable: boolean;
  formControl: UntypedFormControl;
  static readonly fieldName: string = 'independentDriving';
  constructor(public outcomeBehaviourProvider: OutcomeBehaviourMapProvider) {}

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null);
      this.formGroup.addControl('independentDriving', this.formControl);
    }
    this.showNotApplicable = this.outcomeBehaviourProvider.showNotApplicable(
      this.outcome,
      IndependentDrivingComponent.fieldName
    );
    const visibilityType = this.outcomeBehaviourProvider.getVisibilityType(
      this.outcome,
      IndependentDrivingComponent.fieldName
    );

    if (visibilityType === VisibilityType.NotVisible) {
      this.formGroup.get(IndependentDrivingComponent.fieldName).clearValidators();
    } else {
      this.formGroup.get(IndependentDrivingComponent.fieldName).setValidators([Validators.required]);
    }

    this.formControl.patchValue(this.independentDriving);
  }

  independentDrivingChanged(independentDriving: IndependentDriving): void {
    if (this.formControl.valid) {
      this.independentDrivingChange.emit(independentDriving);
    }
  }

  getIndependentDrivingInputId(inputLabel: string): string {
    return `independent-driving-${removeNonAlphaNumeric(inputLabel).toLowerCase()}`;
  }

  get componentTitle(): string {
    return `Independent ${getDrivingOrRidingLabel(this.category)}`;
  }

  get componentWarningMessage(): string {
    return `Select the method of independent ${getDrivingOrRidingLabel(this.category)}`;
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
