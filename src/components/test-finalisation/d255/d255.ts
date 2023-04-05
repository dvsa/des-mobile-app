import {
  Component, EventEmitter, Input, OnChanges, Output,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { OutcomeBehaviourMapProvider, VisibilityType } from '@providers/outcome-behaviour-map/outcome-behaviour-map';

@Component({
  selector: 'd255',
  templateUrl: './d255.html',
})
export class D255Component implements OnChanges {
  static readonly fieldName: string = 'd255';
  @Input()
  display: boolean;
  @Input()
  outcome: string;
  @Input()
  d255: boolean;
  @Input()
  eyesightTestFailed: boolean = false;
  @Input()
  formGroup: UntypedFormGroup;
  @Output()
  d255Change = new EventEmitter<boolean>();
  formControl: UntypedFormControl;

  constructor(private outcomeBehaviourProvider: OutcomeBehaviourMapProvider) {
  }

  get invalid(): boolean {
    return this.formControl.invalid && this.formControl.dirty;
  }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null);
      this.formGroup.addControl(D255Component.fieldName, this.formControl);
    }
    const visibilityType = this.outcomeBehaviourProvider.getVisibilityType(this.outcome, D255Component.fieldName);
    if (visibilityType === VisibilityType.NotVisible) {
      this.formGroup.get(D255Component.fieldName).clearValidators();
    } else {
      this.formGroup.get(D255Component.fieldName).setValidators([Validators.required]);
    }

    this.formControl.patchValue(this.getD255OrDefault());
    if (this.eyesightTestFailed) this.formGroup.get(D255Component.fieldName).disable();
  }

  d255Changed(d255FormId: string): void {
    if (this.formControl.valid) {
      this.d255Change.emit(d255FormId === 'd255-yes');
    }
  }

  getD255OrDefault(): string | boolean {
    if (this.d255 !== null) {
      return this.d255;
    }

    // set default to false unless eyesight test failed
    this.d255 = !!this.eyesightTestFailed;
    this.d255Change.emit(this.d255);
    return this.d255;
  }

}
