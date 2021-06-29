import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  OutcomeBehaviourMapProvider,
  VisibilityType,
} from '@providers/outcome-behaviour-map/outcome-behaviour-map';

enum ValidWitnessedValues {
  YES = 'Yes',
  NO = 'No',
}

@Component({
  selector: 'debrief-witnessed',
  templateUrl: 'debrief-witnessed.html',
})
export class DebriefWitnessedComponent implements OnChanges {
  @Input()
  display: boolean;

  @Input()
  outcome: string;

  @Input()
  debriefWitnessed: boolean;

  @Input()
  formGroup: FormGroup;

  @Output()
  debriefWitnessedChange = new EventEmitter<boolean>();

  @Input()
  isDelegated: boolean = false;

  private formControl: FormControl;
  static readonly fieldName: string = 'debriefWitnessed';
  constructor(private outcomeBehaviourProvider: OutcomeBehaviourMapProvider) { }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null);
      this.formGroup.addControl(DebriefWitnessedComponent.fieldName, this.formControl);
    }
    const visibilityType = this.outcomeBehaviourProvider.getVisibilityType(this.outcome,
      DebriefWitnessedComponent.fieldName);

    if (visibilityType === VisibilityType.NotVisible) {
      this.formGroup.get(DebriefWitnessedComponent.fieldName).clearValidators();
    } else {
      this.formGroup.get(DebriefWitnessedComponent.fieldName).setValidators([Validators.required]);
    }
    if (this.debriefWitnessed !== null) {
      this.formControl.patchValue(this.debriefWitnessed
        ? ValidWitnessedValues.YES : ValidWitnessedValues.NO);
    } else {
      this.formControl.patchValue(null);
    }
  }

  debriefWitnessedChanged(debriefWitnessedFormValue: string): void {
    if (this.formControl.valid) {
      this.debriefWitnessedChange.emit(
        debriefWitnessedFormValue === ValidWitnessedValues.YES,
      );
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}
