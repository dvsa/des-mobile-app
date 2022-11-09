import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'review-feedback',
  templateUrl: 'review-feedback.html',
  styleUrls: ['review-feedback.scss'],
})
export class ReviewFeedback {

  @Input()
  form: UntypedFormGroup;

  @Input()
  feedback: string;

  @Output()
  feedbackChange = new EventEmitter<string>();

  formControl: UntypedFormControl;
  feedbackCharsRemaining: number = null;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null);
      this.form.addControl('feedback', this.formControl);
    }

    this.form.get('feedback').setValidators([Validators.required, Validators.maxLength(950)]);

    this.formControl.patchValue(this.feedback);
  }

  feedbackChanged = (feedback: string) => {
    this.feedbackChange.emit(feedback);
  };

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  characterCountChanged(charactersRemaining: number) {
    this.feedbackCharsRemaining = charactersRemaining;
  }

  getCharacterCountText() {
    const characterString = Math.abs(this.feedbackCharsRemaining) === 1 ? 'character' : 'characters';
    return `You have ${Math.abs(this.feedbackCharsRemaining)} ${characterString} remaining`;
  }

  charactersExceeded(): boolean {
    return this.feedbackCharsRemaining < 0;
  }

}
