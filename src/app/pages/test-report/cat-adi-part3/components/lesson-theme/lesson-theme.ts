import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { LessonTheme } from '@dvsa/mes-test-schema/categories/ADI3';
import { CharacterCountService } from '@providers/character-count/character-count.service';

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
  charsRemaining: number;
  characterLimit = 1000;
  static readonly fieldName: string = 'otherReason';

  constructor(public characterCountService: CharacterCountService) {}

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null, [this.charactersExceededValidator()]);
      this.formGroup.addControl(LessonThemeComponent.fieldName, this.formControl);
    }
    this.formControl.patchValue(this.otherReason);
  }

  charactersExceededValidator(): ValidatorFn {
    return (): ValidationErrors | null => {
      return this.characterCountService.charactersExceeded(this.charsRemaining) ? { charactersExceeded: true } : null;
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
    this.charsRemaining = charactersRemaining;
    this.formControl.updateValueAndValidity();
  }

  /**
   * Request appropriate character count text based upon how many characters are remaining
   */
  getCharacterCountText(): string {
    return this.characterCountService.getCharacterCountText(this.charsRemaining);
  }

  /**
   * Request whether the character count has been exceeded
   */
  charactersExceeded(): boolean {
    return this.characterCountService.charactersExceeded(this.charsRemaining);
  }
}
