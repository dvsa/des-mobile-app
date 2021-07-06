import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  OutcomeBehaviourMapProvider,
  VisibilityType,
} from '@providers/outcome-behaviour-map/outcome-behaviour-map';

export enum ValidD255Values {
  YES = 'Yes',
  NO = 'No',
}

@Component({
  selector: 'd255',
  templateUrl: './d255.html',
  styleUrls: ['./d255.scss'],
})
export class D255Component implements OnChanges {
  @Input()
  display: boolean;

  @Input()
  outcome: string;

  @Input()
  d255: boolean;

  @Input()
  eyesightTestFailed: boolean = false;

  @Input()
  formGroup: FormGroup;

  @Output()
  d255Change = new EventEmitter<boolean>();

  formControl: FormControl;
  static readonly fieldName: string = 'd255';

  constructor(private outcomeBehaviourProvider: OutcomeBehaviourMapProvider) { }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null);
      this.formGroup.addControl(D255Component.fieldName, this.formControl);
    }
    const visibilityType = this.outcomeBehaviourProvider.getVisibilityType(this.outcome, D255Component.fieldName);
    if (visibilityType === VisibilityType.NotVisible) {
      this.formGroup.get(D255Component.fieldName).clearValidators();
    } else {
      this.formGroup.get(D255Component.fieldName).setValidators([Validators.required]);
    }

    this.formControl.patchValue(this.getD255OrDefault());
  }

  d255Changed(d255FormValue: boolean): void {
    if (this.formControl.valid) {
      this.d255Change.emit(d255FormValue);
    }
  }

  getD255OrDefault(): string | boolean {
    if (this.d255 !== null) {
      return this.d255;
    }
    if (this.outcomeBehaviourProvider.hasDefault(this.outcome, D255Component.fieldName)) {
      const defaultValue = this.outcomeBehaviourProvider.getDefault(this.outcome, D255Component.fieldName);
      this.d255Changed(defaultValue === ValidD255Values.YES);
      return defaultValue;
    }
    // set default to false unless eyesight test failed
    this.d255 = !!this.eyesightTestFailed;
    return this.d255;
  }

  get invalid(): boolean {
    return this.formControl.invalid && this.formControl.dirty;
  }

}
