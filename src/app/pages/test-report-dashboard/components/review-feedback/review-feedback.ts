import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'review-feedback',
  templateUrl: 'review-feedback.html',
  styleUrls: ['review-feedback.scss'],
})
export class ReviewFeedback {

  @Input()
  form: FormGroup;

  @Input()
  feedback: string;

  @Output()
  feedbackChange = new EventEmitter<string>();

  formControl: FormControl;
  feedbackCharsRemaining: number = null;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null);
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
    if (charactersRemaining <= -1) {
      this.form.controls.feedback.patchValue(this.form.controls.feedback.value.slice(0, -1));
    }
  }

  getCharacterCountText() {
    const characterString = Math.abs(this.feedbackCharsRemaining) === 1 ? 'character' : 'characters';
    const endString = 'remaining';
    if (this.feedbackCharsRemaining <= 0) {
      return 'You have 0 characters remaining';
    }
    return `You have ${Math.abs(this.feedbackCharsRemaining)} ${characterString} ${endString}`;
  }

  charactersExceeded(): boolean {
    return this.feedbackCharsRemaining < 0;
  }

}
