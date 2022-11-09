import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

import { Identification } from '@dvsa/mes-test-schema/categories/common';
import {
  OutcomeBehaviourMapProvider,
  VisibilityType,
} from '@providers/outcome-behaviour-map/outcome-behaviour-map';

@Component({
  selector: 'identification',
  templateUrl: 'identification.html',
})
export class IdentificationComponent implements OnChanges {
  @Input()
  display: boolean;

  @Input()
  outcome: string;

  @Input()
  identification: Identification;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  identificationChange = new EventEmitter<Identification>();

  private formControl: UntypedFormControl;
  private formField: string = 'identification';
  constructor(private outcomeBehaviourProvider: OutcomeBehaviourMapProvider) { }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl('Licence');
      this.formGroup.addControl(this.formField, this.formControl);
    }
    const visibilityType = this.outcomeBehaviourProvider.getVisibilityType(this.outcome, this.formField);

    if (visibilityType === VisibilityType.NotVisible) {
      this.formGroup.get(this.formField).clearValidators();
    } else {
      this.formGroup.get(this.formField).setValidators([Validators.required]);
    }
    this.formControl.patchValue(this.identification);
  }

  identificationChanged(identification: Identification): void {
    if (this.formControl.valid) {
      this.identificationChange.emit(identification);
    }
  }

}
