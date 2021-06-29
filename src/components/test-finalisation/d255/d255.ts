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
  templateUrl: 'd255.html',
})
export class D255Component implements OnChanges {
  @Input()
  display: boolean;

  @Input()
  outcome: string;

  @Input()
  d255: boolean;

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

  d255Changed(d255FormValue: string): void {
    if (this.formControl.valid) {
      this.d255Change.emit(d255FormValue === ValidD255Values.YES);
    }
  }

  getD255OrDefault(): string | null {
    if (this.d255 !== null) {
      return this.d255 ? ValidD255Values.YES : ValidD255Values.NO;
    }
    if (this.outcomeBehaviourProvider.hasDefault(this.outcome, D255Component.fieldName)) {
      const defaultValue = this.outcomeBehaviourProvider.getDefault(this.outcome, D255Component.fieldName);
      this.d255Changed(defaultValue);
      return defaultValue;
    }
    return null;
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}
