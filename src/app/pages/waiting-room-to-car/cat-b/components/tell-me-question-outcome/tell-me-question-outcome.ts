import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'tell-me-question-outcome',
  templateUrl: 'tell-me-question-outcome.html',
})
export class TellMeQuestionOutcomeComponent implements OnChanges {

  @Input()
  tellMeQuestionOutcome: string;

  @Input()
  formGroup: UntypedFormGroup;

  @Input()
  tellMeQuestionSelected: boolean;

  @Output()
  tellMeQuestionOutcomeChange = new EventEmitter<string>();

  formControl: UntypedFormControl;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl('', [Validators.required]);
      this.formGroup.addControl('tellMeQuestionOutcome', this.formControl);
    }
    this.formControl.patchValue(this.tellMeQuestionOutcome);
  }

  tellMeQuestionOutcomeChanged(questionOutcome: string): void {
    if (this.formControl.valid) {
      this.tellMeQuestionOutcomeChange.emit(questionOutcome);
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}
