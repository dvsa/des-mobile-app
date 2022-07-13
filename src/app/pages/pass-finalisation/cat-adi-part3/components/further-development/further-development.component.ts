import {
  Component, EventEmitter, Input, OnChanges, Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'further-development',
  templateUrl: './further-development.component.html',
  styleUrls: ['./further-development.component.scss'],
})
export class FurtherDevelopmentComponent implements OnChanges {

  formControl: FormControl;
  noAdviceCharsRemaining: number = null;

  @Input()
  formGroup: FormGroup;

  @Input()
  furtherDevelopment: boolean;

  @Output()
  furtherDevelopmentChange = new EventEmitter<boolean>();

  @Output()
  adviceReason = new EventEmitter<string>();

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl('', [Validators.required]);
      this.formGroup.addControl('furtherDevelopment', this.formControl);
    }

    this.formControl.patchValue(this.furtherDevelopment);
    this.formControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    console.log(this.formGroup.controls['furtherDevelopment'].value);
    console.log(this.furtherDevelopment);
    console.log('::::::: ', this.formGroup.controls['furtherDevelopment'].value === false);
  }

  furtherDevelopmentChanged(furtherDevelopment: boolean) {
    if (this.formControl.valid) {
      this.furtherDevelopmentChange.emit(furtherDevelopment);
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
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

}
