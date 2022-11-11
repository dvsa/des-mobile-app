import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'additional-information',
  templateUrl: 'additional-information.html',
})
export class AdditionalInformationComponent implements OnChanges {
  @Input()
  display: boolean;

  @Input()
  outcome: string;

  @Input()
  additionalInformation: string;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  additionalInformationChange = new EventEmitter<string>();

  private formControl: UntypedFormControl;
  static readonly fieldName: string = 'additionalInformation';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null);
      this.formGroup.addControl(AdditionalInformationComponent.fieldName, this.formControl);
    }
    this.formControl.patchValue(this.additionalInformation);
  }

  additionalInformationChanged(additionalInformation: string): void {
    this.additionalInformationChange.emit(additionalInformation);
  }

}
