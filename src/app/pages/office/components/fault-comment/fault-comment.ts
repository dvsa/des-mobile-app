import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { CharacterCountService } from '@providers/character-count/character-count.service';
import { OutcomeBehaviourMapProvider, VisibilityType } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { FaultSummary } from '@shared/models/fault-marking.model';

export enum ValidFaultTypes {
  DRIVING = 'driving',
  SERIOUS = 'serious',
  DANGEROUS = 'dangerous',
}

@Component({
    selector: 'fault-comment',
    templateUrl: 'fault-comment.html',
    styleUrls: ['fault-comment.scss'],
    standalone: false
})
export class FaultCommentComponent implements OnChanges {
  faultCommentMaxLength = 950;

  @Input()
  outcome: string;

  @Input()
  parentForm: UntypedFormGroup;

  @Input()
  faultComment: FaultSummary;

  @Input()
  faultType: string;

  @Input()
  faultCount: number;

  @Input()
  shouldRender: boolean;

  @Input()
  maxFaultCount: number;

  @Input()
  isDelegatedTest?: boolean = false;

  @Input()
  testCategory?: TestCategory;

  @Input()
  badgeLabel: string;

  @Output()
  faultCommentChange = new EventEmitter<FaultSummary>();

  charsRemaining: number = null;
  static readonly fieldName: string = 'faultComment';

  constructor(
    private outcomeBehaviourProvider: OutcomeBehaviourMapProvider,
    protected accessibilityService: AccessibilityService,
    public characterCountService: CharacterCountService
  ) {}

  ngOnChanges(): void {
    // mes 2393 - need to remove validations if < 16 faults as comments can
    // only be entered if 16 or more
    if (this.isFieldNotVisible || this.shouldClearDrivingFaultValidators()) {
      this.parentForm.get(this.formControlName).clearValidators();
    } else {
      this.parentForm
        .get(this.formControlName)
        .setValidators([Validators.required, this.charactersExceededValidator()]);
    }
    this.parentForm.get(this.formControlName).patchValue(this.faultComment.comment);
  }

  charactersExceededValidator(): ValidatorFn {
    return (): ValidationErrors | null => {
      return this.characterCountService.charactersExceeded(this.charsRemaining) ? { charactersExceeded: true } : null;
    };
  }

  shouldClearDrivingFaultValidators(): boolean {
    if (this.faultType !== ValidFaultTypes.DRIVING) {
      return false;
    }

    if (!this.shouldRender) {
      return true;
    }

    if (this.faultCount && this.maxFaultCount && this.faultCount <= this.maxFaultCount) {
      return true;
    }
  }

  faultCommentChanged(newComment: string): void {
    const { comment, ...commentedCompetencyWithoutComment } = this.faultComment;
    const commentedCompetency: FaultSummary = {
      comment: newComment,
      ...commentedCompetencyWithoutComment,
    };
    this.faultCommentChange.emit(commentedCompetency);
  }

  characterCountChanged(charactersRemaining: number) {
    this.charsRemaining = charactersRemaining;
    this.parentForm.get(this.formControlName).updateValueAndValidity();
  }

  get invalid(): boolean {
    return !this.parentForm.get(this.formControlName).valid && this.parentForm.get(this.formControlName).dirty;
  }

  get formControlName() {
    return `faultComment-${this.faultComment.source}-${this.faultType}-${this.faultComment.competencyIdentifier}`;
  }

  get isFieldNotVisible(): boolean {
    const fieldVisibility = this.outcomeBehaviourProvider.getVisibilityType(
      this.outcome,
      FaultCommentComponent.fieldName
    );

    return fieldVisibility === VisibilityType.NotVisible || this.isDelegatedTest;
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
