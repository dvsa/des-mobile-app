import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'alternative-mot-evidence-details',
  templateUrl: 'alternative-mot-evidence-details.html',
})
export class AlternativeMotEvidenceDetails {
  private static maxCallStackHandler = {
    onlySelf: true,
    emitEvent: false,
  };

  @Input()
  alternativeMotEvidenceProvided: boolean = false;

  @Input()
  alternativeMotEvidenceDetails: string;

  @Input()
  formGroup: FormGroup;

  @Output()
  alternativeMotEvidenceDetailsChange = new EventEmitter<string>();

  private formControl: FormControl = null;
  static readonly fieldName: string = 'alternativeMotEvidenceDetails';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null);
      this.formGroup.addControl(AlternativeMotEvidenceDetails.fieldName, this.formControl);
    }

    // remove `Validators.required` if not displayed
    this.formControl.setValidators(this.alternativeMotEvidenceProvided
      ? Validators.compose([Validators.required])
      : null);

    this.formControl.updateValueAndValidity();
    this.formControl.patchValue(this.alternativeMotEvidenceDetails, AlternativeMotEvidenceDetails.maxCallStackHandler);
  }

  alternativeMotEvidenceDetailsChanged(details: string): void {
    if (this.formControl.valid) {
      this.alternativeMotEvidenceDetailsChange.emit(details);
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
