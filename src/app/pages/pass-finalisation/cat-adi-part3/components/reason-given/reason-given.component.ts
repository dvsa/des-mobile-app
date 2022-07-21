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

  noAdviceCharsRemaining: number = null;
  formControl: FormControl;

  @Input()
  controlRemovalCondition: boolean;

  @Input()
  formGroup: FormGroup;

  @Input()
  reasonGivenText: string;

  @Output()
  adviceReason = new EventEmitter<string>();

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl('', [Validators.required]);
      this.formGroup.addControl('reasonGiven', this.formControl);

      if (this.reasonGivenText) {
        this.formGroup.controls.reasonGiven.patchValue(this.reasonGivenText);
      }
      if (this.controlRemovalCondition) {
        this.formGroup.removeControl('reasonGiven');
      } else if (!this.formGroup.controls.reasonGiven) {
        this.formGroup.addControl('reasonGiven', this.formControl);
      }
    }
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
