import {
  Component, EventEmitter, Input, OnChanges, Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OutcomeBehaviourMapProvider, VisibilityType } from '@providers/outcome-behaviour-map/outcome-behaviour-map';

@Component({
  selector: 'reason-given',
  templateUrl: './reason-given.component.html',
  styleUrls: ['./reason-given.component.scss'],
})
export class ReasonGivenComponent implements OnChanges {

  @Input()
  furtherDevelopment: boolean;

  @Input()
  display: boolean;

  @Input()
  outcome: string;

  @Input()
  formGroup: FormGroup;

  @Input()
  reasonGivenText: string;

  @Output()
  adviceReason = new EventEmitter<string>();

  noAdviceCharsRemaining: number = null;
  private formControl: FormControl = null;
  static readonly fieldName: string = 'reasonGiven';

  constructor(private outcomeBehaviourProvider: OutcomeBehaviourMapProvider) { }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null);
      this.formGroup.addControl('reasonGiven', this.formControl);
    }

    const visibilityType = this.outcomeBehaviourProvider.getVisibilityType(
      this.outcome,
      ReasonGivenComponent.fieldName,
    );

    if (visibilityType === VisibilityType.NotVisible || this.furtherDevelopment) {
      this.formGroup.get(ReasonGivenComponent.fieldName).clearValidators();
    } else if (this.furtherDevelopment === false) {
      this.formGroup.get(ReasonGivenComponent.fieldName).setValidators([Validators.required]);
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
