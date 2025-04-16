import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CharacterCountService } from '@providers/character-count/character-count.service';
import { OutcomeBehaviourMapProvider, VisibilityType } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { CANDIDATE_DESCRIPTION_CONTROL, CANDIDATE_DESCRIPTION_MAX_LENGTH } from './candidate-description.constants';

@Component({
    selector: 'candidate-description',
    templateUrl: 'candidate-description.html',
    standalone: false
})
export class CandidateDescriptionComponent implements OnChanges {
  @Input()
  trueLikenessToPhoto: boolean;

  @Input()
  display: boolean;

  @Input()
  outcome: string;

  @Input()
  candidateDescription: string;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  candidateDescriptionChange = new EventEmitter<string>();

  formControl: UntypedFormControl;
  charsRemaining: number = null;
  protected readonly CANDIDATE_DESCRIPTION_MAX_LENGTH = CANDIDATE_DESCRIPTION_MAX_LENGTH;

  constructor(
    public outcomeBehaviourProvider: OutcomeBehaviourMapProvider,
    public characterCountService: CharacterCountService
  ) {}

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null);
      this.formGroup.addControl(CANDIDATE_DESCRIPTION_CONTROL, this.formControl);
    }
    const visibilityType = this.outcomeBehaviourProvider.getVisibilityType(this.outcome, CANDIDATE_DESCRIPTION_CONTROL);

    if (visibilityType === VisibilityType.NotVisible) {
      this.formGroup.get(CANDIDATE_DESCRIPTION_CONTROL).clearValidators();
    } else if (this.trueLikenessToPhoto) {
      this.formGroup.get(CANDIDATE_DESCRIPTION_CONTROL).setValidators([this.charactersExceededValidator()]);
    } else {
      this.formGroup
        .get(CANDIDATE_DESCRIPTION_CONTROL)
        .setValidators([Validators.required, this.charactersExceededValidator()]);
    }
    this.formControl.patchValue(this.candidateDescription);
  }

  charactersExceededValidator(): ValidatorFn {
    return (): ValidationErrors | null => {
      return this.characterCountService.charactersExceeded(this.charsRemaining) ? { charactersExceeded: true } : null;
    };
  }

  candidateDescriptionChanged(candidateDescription: string): void {
    this.candidateDescriptionChange.emit(candidateDescription);
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

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  /**
   * Request whether the character count has been exceeded
   */
  charactersExceeded(): boolean {
    return this.characterCountService.charactersExceeded(this.charsRemaining);
  }
}
