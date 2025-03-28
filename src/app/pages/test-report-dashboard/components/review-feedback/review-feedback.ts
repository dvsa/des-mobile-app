import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CharacterCountService } from '@providers/character-count/character-count.service';

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
  charsRemaining: number = null;
  feedbackMaxLength = 950;

  constructor(public characterCountService: CharacterCountService) {}

  ngOnChanges(): void {
    console.log();
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null);
      this.form.addControl('feedback', this.formControl);
    }

    this.form.get('feedback').setValidators([Validators.required, this.charactersExceededValidator()]);

    this.formControl.patchValue(this.feedback);
  }

  feedbackChanged = (feedback: string) => {
    this.feedbackChange.emit(feedback);
  };

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  characterCountChanged(charactersRemaining: number) {
    this.charsRemaining = charactersRemaining;
    this.formControl.updateValueAndValidity();
  }

  charactersExceededValidator(): ValidatorFn {
    return (): ValidationErrors | null => {
      return this.characterCountService.charactersExceeded(this.charsRemaining) ? { charactersExceeded: true } : null;
    };
  }

  /**
   * Request whether the character count has been exceeded
   */
  charactersExceeded(): boolean {
    return this.characterCountService.charactersExceeded(this.charsRemaining);
  }

  /**
   * Request appropriate character count text based upon how many characters are remaining
   */
  getCharacterCountText(): string {
    return this.characterCountService.getCharacterCountText(this.charsRemaining);
  }
}
