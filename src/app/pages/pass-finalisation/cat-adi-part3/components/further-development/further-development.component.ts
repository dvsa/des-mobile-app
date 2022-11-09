import {
  Component, EventEmitter, Input, OnChanges, Output,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { OutcomeBehaviourMapProvider, VisibilityType } from '@providers/outcome-behaviour-map/outcome-behaviour-map';

@Component({
  selector: 'further-development',
  templateUrl: './further-development.component.html',
})
export class FurtherDevelopmentComponent implements OnChanges {

  formControl: UntypedFormControl;
  static readonly fieldName: string = 'furtherDevelopment';

  @Input()
  formGroup: UntypedFormGroup;

  @Input()
  display: boolean;

  @Input()
  outcome: string;

  @Input()
  furtherDevelopment: boolean;

  @Output()
  furtherDevelopmentChange = new EventEmitter<boolean>();

  constructor(private outcomeBehaviourProvider: OutcomeBehaviourMapProvider) {}

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl('', [Validators.required]);
      this.formGroup.addControl(FurtherDevelopmentComponent.fieldName, this.formControl);
      this.formGroup.updateValueAndValidity({
        onlySelf: true,
        emitEvent: false,
      });
    }

    const visibilityType = this.outcomeBehaviourProvider.getVisibilityType(
      this.outcome,
      FurtherDevelopmentComponent.fieldName,
    );

    if (visibilityType === VisibilityType.NotVisible) {
      this.formGroup.get(FurtherDevelopmentComponent.fieldName).clearValidators();
    } else {
      this.formGroup.get(FurtherDevelopmentComponent.fieldName).setValidators([Validators.required]);
    }

    this.formGroup.get(FurtherDevelopmentComponent.fieldName).updateValueAndValidity();

    if (this.furtherDevelopment === true || this.furtherDevelopment === false) {
      this.formControl.patchValue(String(this.furtherDevelopment));
    }
  }

  furtherDevelopmentChanged(furtherDevelopment: string) {
    if (this.formControl.valid) {
      this.furtherDevelopmentChange.emit(furtherDevelopment === 'true');
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
