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

  @Input()
  reasonGiven?: string;

  @Output()
  furtherDevelopmentChange = new EventEmitter<boolean>();

  @Output()
  adviceReason = new EventEmitter<string>();

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl('', [Validators.required]);
      this.formGroup.addControl('furtherDevelopment', this.formControl);
      this.formGroup.controls.reasonGiven = new FormControl('', Validators.required);
    }
    if (this.formGroup.controls.furtherDevelopment.value === 'true') {
      this.formGroup.removeControl('reasonGiven');
    } else {
      this.formGroup.controls.reasonGiven = new FormControl('', Validators.required);
    }
    if (this.furtherDevelopment === true || this.furtherDevelopment === false) {
      this.formControl.patchValue(String(this.furtherDevelopment));
    }
    if (this.reasonGiven) {
      this.formGroup.controls.reasonGiven.patchValue(this.reasonGiven);
    }
  }

  furtherDevelopmentChanged(furtherDevelopment: string) {
    if (this.formControl.valid) {
      this.furtherDevelopmentChange.emit(furtherDevelopment === 'true');
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
