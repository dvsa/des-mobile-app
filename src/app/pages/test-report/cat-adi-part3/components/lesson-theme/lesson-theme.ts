import {
  Component, EventEmitter, Input, OnChanges, Output,
} from '@angular/core';
import { LessonTheme } from '@dvsa/mes-test-schema/categories/ADI3';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  formGroup: FormGroup;

  @Output()
  lessonThemeChange = new EventEmitter<LessonTheme>();

  @Output()
  otherReasoningChange = new EventEmitter<string>();

  private formControl: FormControl;
  static readonly fieldName: string = 'otherReason';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null);
      this.formGroup.addControl(LessonThemeComponent.fieldName, this.formControl);
    }
    if (!this.defineComparator('other')) {
      this.formGroup.get(LessonThemeComponent.fieldName).clearValidators();
    } else {
      this.formGroup.get(LessonThemeComponent.fieldName).setValidators([
        Validators.required,
        Validators.maxLength(950),
      ]);
    }
    this.formControl.patchValue(this.otherReason);
  }

  lessonThemeChanged = (lessonTheme: string): void => {
    this.lessonThemeChange.emit(lessonTheme as LessonTheme);
  };

  otherReasoningChanged = (otherReason: string): void => {
    this.otherReasoningChange.emit(otherReason);
  };

  defineComparator = (key: string) => this.lessonThemes?.includes(key as LessonTheme) ? key : '';

  showOtherSelectedBanner = () => this.lessonThemes?.includes('other');

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}
