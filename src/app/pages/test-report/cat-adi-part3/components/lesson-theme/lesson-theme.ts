import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { LessonTheme } from '@dvsa/mes-test-schema/categories/ADI3';
import { IonCard, IonCardContent, IonCardHeader, IonCol, IonGrid, IonRow } from '@ionic/angular';
import { CharacterCountService } from '@providers/character-count/character-count.service';
import { CharacterCountDirective } from '../../../../../../directives/character-count.directive';
import { EmojiBlockDirective } from '../../../../../../directives/emoji-block.directive';
import { PasteSanitiserDirective } from '../../../../../../directives/paste-sanitiser';
import { AssessmentAnswerComponent } from '../assessment-answer/assessment-answer';

@Component({
  selector: 'lesson-theme',
  templateUrl: 'lesson-theme.html',
  imports: [
    IonCard,
    IonCardHeader,
    IonCardContent,
    FormsModule,
    ReactiveFormsModule,
    IonGrid,
    IonRow,
    IonCol,
    AssessmentAnswerComponent,
    CharacterCountDirective,
    EmojiBlockDirective,
    PasteSanitiserDirective,
    NgClass,
  ],
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
  charsRemaining: number = null;
  characterLimit = 950;
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
