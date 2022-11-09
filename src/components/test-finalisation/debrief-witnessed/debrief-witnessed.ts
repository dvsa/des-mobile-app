import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import {
  OutcomeBehaviourMapProvider,
  VisibilityType,
} from '@providers/outcome-behaviour-map/outcome-behaviour-map';

@Component({
  selector: 'debrief-witnessed',
  templateUrl: './debrief-witnessed.html',
  styleUrls: ['./debrief-witnessed.scss'],
})
export class DebriefWitnessedComponent implements OnChanges {
  @Input()
  display: boolean;

  @Input()
  outcome: string;

  @Input()
  debriefWitnessed: boolean;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  debriefWitnessedChange = new EventEmitter<boolean>();

  @Input()
  isDelegated: boolean = false;

  private formControl: UntypedFormControl;
  static readonly fieldName: string = 'debriefWitnessed';
  constructor(private outcomeBehaviourProvider: OutcomeBehaviourMapProvider) { }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl('', [Validators.required]);
      this.formGroup.addControl(DebriefWitnessedComponent.fieldName, this.formControl);
      this.formGroup.updateValueAndValidity({
        onlySelf: true,
        emitEvent: false,
      });
    }

    const visibilityType = this.outcomeBehaviourProvider.getVisibilityType(this.outcome,
      DebriefWitnessedComponent.fieldName);

    if (visibilityType === VisibilityType.NotVisible) {
      this.formGroup.get(DebriefWitnessedComponent.fieldName).clearValidators();
    } else {
      this.formGroup.get(DebriefWitnessedComponent.fieldName).setValidators([Validators.required]);
    }
    if (this.debriefWitnessed !== null) {
      this.formControl.patchValue(this.debriefWitnessed);
    } else {
      this.formControl.patchValue(null);
    }
  }

  debriefWitnessedChanged(debriefWitnessedFormValue: string): void {
    if (this.formControl.valid) {
      this.debriefWitnessedChange.emit(debriefWitnessedFormValue === 'debrief-witnessed-yes');
    }
  }

  get invalid(): boolean {
    return this.formControl.invalid && this.formControl.dirty;
  }

}
