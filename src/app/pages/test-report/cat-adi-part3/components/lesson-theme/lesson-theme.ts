import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { LessonTheme } from '@dvsa/mes-test-schema/categories/ADI3';

@Component({
  selector: 'lesson-theme',
  templateUrl: 'lesson-theme.html',
})
export class LessonThemeComponent implements OnChanges {
  @Input()
  lessonThemes: LessonTheme[] = [];

  @Input()
  otherReason: string;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  lessonThemeChange = new EventEmitter<{ lessonTheme: LessonTheme; added: boolean }>();

  @Output()
  otherReasoningChange = new EventEmitter<string>();

  formControl: UntypedFormControl;
  feedbackCharsRemaining: number;
  characterLimit = 1000;
  static readonly fieldName: string = 'otherReason';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null, [this.charactersExceededValidator()]);
      this.formGroup.addControl(LessonThemeComponent.fieldName, this.formControl);
    }
    this.formControl.patchValue(this.otherReason);
  }

  charactersExceededValidator(): ValidatorFn {
    return (): ValidationErrors | null => {
      return this.charactersExceeded() ? { charactersExceeded: true } : null;
    };
  }

  lessonThemeChanged = (lessonTheme: string): void => {
    const added = !this.lessonThemes.includes(lessonTheme as LessonTheme);
    this.lessonThemeChange.emit({ lessonTheme: lessonTheme as LessonTheme, added });
  };

  otherReasoningChanged = (otherReason: string): void => {
    this.otherReasoningChange.emit(otherReason);
  };

  defineComparator = (key: string) => (this.lessonThemes?.includes(key as LessonTheme) ? key : '');

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  characterCountChanged(charactersRemaining: number) {
    this.feedbackCharsRemaining = charactersRemaining;
    this.formControl.updateValueAndValidity();
  }

  getCharacterCountText() {
    const characterString = Math.abs(this.feedbackCharsRemaining) === 1 ? 'character' : 'characters';
    return `You have ${Math.abs(this.feedbackCharsRemaining)} ${characterString} remaining`;
  }

  charactersExceeded(): boolean {
    return this.feedbackCharsRemaining < 0;
  }
}
