import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'tell-me-question-outcome',
  templateUrl: 'tell-me-question-outcome.html',
})
export class TellMeQuestionOutcomeComponent implements OnChanges {

  @Input()
  tellMeQuestionOutcome: string;

  @Input()
  formGroup: FormGroup;

  @Input()
  tellMeQuestionSelected: boolean;

  @Output()
  tellMeQuestionOutcomeChange = new EventEmitter<string>();

  formControl: FormControl;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl('', [Validators.required]);
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
