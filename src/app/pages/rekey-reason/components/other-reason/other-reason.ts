import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'other-reason',
  templateUrl: 'other-reason.html',
})
export class OtherReasonComponent implements OnChanges {

  static readonly checkBoxCtrl: string = 'otherSelected';
  static readonly fieldName: string = 'reason';
  private checkBoxFormControl: FormControl;
  private formControl: FormControl;
  public reasonDescriptionCharsRemaining: number = null;

  @Input()
  selected: boolean;

  @Input()
  reason: string;

  @Input()
  formGroup: FormGroup;

  @Output()
  selectedChange = new EventEmitter<boolean>();

  @Output()
  reasonChange = new EventEmitter<string>();

  ngOnChanges(): void {
    if (!this.checkBoxFormControl) {
      this.checkBoxFormControl = new FormControl(null);
      this.formGroup.addControl(OtherReasonComponent.checkBoxCtrl, this.checkBoxFormControl);
    }

    if (!this.formControl) {
      this.formControl = new FormControl(null);
      this.formGroup.addControl(OtherReasonComponent.fieldName, this.formControl);
    }

    if (this.selected) {
      this.formGroup.get(OtherReasonComponent.fieldName).setValidators([
        Validators.required,
        Validators.maxLength(200),
      ]);
    } else {
      this.formGroup.get(OtherReasonComponent.fieldName).clearValidators();
    }

    this.checkBoxFormControl.patchValue(!!this.selected);
    this.formControl.patchValue(this.reason);
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
    this.reasonDescriptionCharsRemaining = charactersRemaining;
  }

  getCharacterCountText(): string {
    const characterString = Math.abs(this.reasonDescriptionCharsRemaining) === 1 ? 'character' : 'characters';
    const endString = this.reasonDescriptionCharsRemaining < 0 ? 'too many' : 'remaining';
    return `You have ${Math.abs(this.reasonDescriptionCharsRemaining)} ${characterString} ${endString}`;
  }

  charactersExceeded(): boolean {
    return this.reasonDescriptionCharsRemaining < 0;
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}
