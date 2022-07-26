import {
  Component, EventEmitter, Input, OnChanges, Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'reason-given',
  templateUrl: './reason-given.component.html',
  styleUrls: ['./reason-given.component.scss'],
})
export class ReasonGivenComponent implements OnChanges {

  @Input()
  furtherDevelopment: boolean;

  @Input()
  formGroup: FormGroup;

  @Input()
  reasonGivenText: string;

  @Output()
  adviceReason = new EventEmitter<string>();

  noAdviceCharsRemaining: number = null;
  private formControl: FormControl = null;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null);
      this.formGroup.addControl('reasonGiven', this.formControl);
    }

    if (this.furtherDevelopment) {
      this.formControl.clearValidators();
    } else if (this.furtherDevelopment === false) {
      this.formControl.setValidators([Validators.required]);
    }

    this.formControl.updateValueAndValidity();
    this.formControl.patchValue(this.reasonGivenText);
  }

  characterCountChanged(charactersRemaining: number) {
    this.noAdviceCharsRemaining = charactersRemaining;
  }

  adviceReasonChange(text: string) {
    this.adviceReason.emit(text);
  }

  charactersExceeded(): boolean {
    return this.noAdviceCharsRemaining < 0;
  }

  getCharacterCountText() {
    const characterString = Math.abs(this.noAdviceCharsRemaining) === 1 ? 'character' : 'characters';
    const endString = this.noAdviceCharsRemaining < 0 ? 'too many' : 'remaining';
    return `You have ${Math.abs(this.noAdviceCharsRemaining)} ${characterString} ${endString}`;
  }

  get invalid(): boolean {
    return this.formControl.invalid && this.formControl.dirty;
  }
}
