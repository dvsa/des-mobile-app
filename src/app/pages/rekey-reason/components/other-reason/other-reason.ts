import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CharacterCountService } from '@providers/character-count/character-count.service';

@Component({
  selector: 'other-reason',
  templateUrl: 'other-reason.html',
  standalone: false,
})
export class OtherReasonComponent implements OnChanges {
  static readonly checkBoxCtrl: string = 'otherSelected';
  static readonly fieldName: string = 'reason';
  private checkBoxFormControl: UntypedFormControl;
  private formControl: UntypedFormControl;
  public charsRemaining: number = null;
  public otherReasonMaxLength = 200;

  @Input()
  selected: boolean;

  @Input()
  reason: string;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  selectedChange = new EventEmitter<boolean>();

  @Output()
  reasonChange = new EventEmitter<string>();

  constructor(public characterCountService: CharacterCountService) {}

  ngOnChanges(): void {
    if (!this.checkBoxFormControl) {
      this.checkBoxFormControl = new UntypedFormControl(null);
      this.formGroup.addControl(OtherReasonComponent.checkBoxCtrl, this.checkBoxFormControl);
    }

    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null);
      this.formGroup.addControl(OtherReasonComponent.fieldName, this.formControl);
    }

    if (this.selected) {
      this.formGroup
        .get(OtherReasonComponent.fieldName)
        .setValidators([Validators.required, this.charactersExceededValidator()]);
    } else {
      this.formGroup.get(OtherReasonComponent.fieldName).clearValidators();
    }

    this.checkBoxFormControl.patchValue(!!this.selected);
    this.formControl.patchValue(this.reason);
    this.formGroup.get(OtherReasonComponent.fieldName).updateValueAndValidity();
  }

  charactersExceededValidator(): ValidatorFn {
    return (): ValidationErrors | null => {
      return this.characterCountService.charactersExceeded(this.charsRemaining) ? { charactersExceeded: true } : null;
    };
  }

  selectedValueChanged(selected: boolean): void {
    if (!selected) {
      this.formGroup.get(OtherReasonComponent.fieldName).reset();
    }
    this.selectedChange.emit(selected);
  }

  reasonTextChanged(reason: string): void {
    this.reasonChange.emit(reason);
  }

  characterCountChanged(charactersRemaining: number): void {
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

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
