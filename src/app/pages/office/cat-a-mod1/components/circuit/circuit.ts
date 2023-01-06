import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

import { Circuit } from '@dvsa/mes-test-schema/categories/AM1';
import {
  OutcomeBehaviourMapProvider,
  VisibilityType,
} from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { CircuitType } from '@shared/models/circuit-type';

@Component({
  selector: 'circuit',
  templateUrl: 'circuit.html',
})
export class CircuitComponent implements OnChanges {
  @Input()
  display: boolean;

  @Input()
  outcome: string;

  @Input()
  circuit: Circuit;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  circuitChange = new EventEmitter<Circuit>();

  formControl: UntypedFormControl;
  formField: string = 'circuit';
  constructor(public outcomeBehaviourProvider: OutcomeBehaviourMapProvider) { }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(CircuitType.Left);
      this.formGroup.addControl(this.formField, this.formControl);
    }
    const visibilityType = this.outcomeBehaviourProvider.getVisibilityType(this.outcome, this.formField);

    if (visibilityType === VisibilityType.NotVisible) {
      this.formGroup.get(this.formField).clearValidators();
    } else {
      this.formGroup.get(this.formField).setValidators([Validators.required]);
    }
    this.formControl.patchValue(this.circuit);
  }

  circuitChanged(circuit: Circuit): void {
    if (this.formControl.valid) {
      this.circuitChange.emit(circuit);
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}
