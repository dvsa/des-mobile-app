import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { IonCol, IonRow } from '@ionic/angular';
import { CharacterCountService } from '@providers/character-count/character-count.service';
import { OutcomeBehaviourMapProvider, VisibilityType } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { CharacterCountDirective } from '../../../../../../directives/character-count.directive';
import { EmojiBlockDirective } from '../../../../../../directives/emoji-block.directive';
import { PasteSanitiserDirective } from '../../../../../../directives/paste-sanitiser';

@Component({
  selector: 'reason-given',
  templateUrl: './reason-given.component.html',
  styleUrls: ['./reason-given.component.scss'],
  imports: [
    IonRow,
    FormsModule,
    ReactiveFormsModule,
    IonCol,
    CharacterCountDirective,
    EmojiBlockDirective,
    PasteSanitiserDirective,
    NgClass,
  ],
})
export class ReasonGivenComponent implements OnChanges {
  @Input()
  furtherDevelopment: boolean;

  @Input()
  display: boolean;

  @Input()
  outcome: string;

  @Input()
  formGroup: UntypedFormGroup;

  @Input()
  reasonGivenText: string;

  @Output()
  adviceReason = new EventEmitter<string>();

  charsRemaining: number = null;
  noAdviceMaxLength = 950;
  formControl: UntypedFormControl = null;
  static readonly fieldName: string = 'reasonGiven';

  constructor(
    private outcomeBehaviourProvider: OutcomeBehaviourMapProvider,
    public characterCountService: CharacterCountService
  ) {}

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null);
      this.formGroup.addControl('reasonGiven', this.formControl);
    }

    const visibilityType = this.outcomeBehaviourProvider.getVisibilityType(
      this.outcome,
      ReasonGivenComponent.fieldName
    );

    if (visibilityType === VisibilityType.NotVisible || this.furtherDevelopment) {
      this.formGroup.get(ReasonGivenComponent.fieldName).clearValidators();
    } else if (this.furtherDevelopment === false) {
      this.formGroup
        .get(ReasonGivenComponent.fieldName)
        .setValidators([Validators.required, this.charactersExceededValidator()]);
    }

    this.formControl.updateValueAndValidity();
    this.formControl.patchValue(this.reasonGivenText);
  }

  charactersExceededValidator(): ValidatorFn {
    return (): ValidationErrors | null => {
      return this.characterCountService.charactersExceeded(this.charsRemaining) ? { charactersExceeded: true } : null;
    };
  }

  characterCountChanged(charactersRemaining: number) {
    this.charsRemaining = charactersRemaining;
    this.formControl.updateValueAndValidity();
  }

  adviceReasonChange(text: string) {
    this.adviceReason.emit(text);
  }

  get invalid(): boolean {
    return this.formControl.invalid && this.formControl.dirty;
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
