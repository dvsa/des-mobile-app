import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { FaultSummary } from '@shared/models/fault-marking.model';
import {
  OutcomeBehaviourMapProvider,
  VisibilityType,
} from '@providers/outcome-behaviour-map/outcome-behaviour-map';

enum ValidFaultTypes {
  DRIVING = 'driving',
  SERIOUS = 'serious',
  DANGEROUS = 'dangerous',
}

@Component({
  selector: 'fault-comment',
  templateUrl: 'fault-comment.html',
  styleUrls: ['fault-comment.scss'],
})

export class FaultCommentComponent implements OnChanges {

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

  faultCommentCharsRemaining: number = null;
  static readonly fieldName: string = 'faultComment';
  constructor(private outcomeBehaviourProvider: OutcomeBehaviourMapProvider) { }

  ngOnChanges(): void {
    // mes 2393 - need to remove validations if < 16 faults as comments can
    // only be entered if 16 or more
    if (this.isFieldNotVisible || this.shouldClearDrivingFaultValidators()) {
      this.parentForm.get(this.formControlName).clearValidators();
    } else {
      this.parentForm.get(this.formControlName).setValidators([Validators.required, Validators.maxLength(950)]);
    }
    this.parentForm.get(this.formControlName).patchValue(this.faultComment.comment);
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
    this.faultCommentCharsRemaining = charactersRemaining;
  }

  getCharacterCountText() {
    const characterString = Math.abs(this.faultCommentCharsRemaining) === 1 ? 'character' : 'characters';
    const endString = this.faultCommentCharsRemaining < 0 ? 'too many' : 'remaining';
    return `You have ${Math.abs(this.faultCommentCharsRemaining)} ${characterString} ${endString}`;
  }

  charactersExceeded(): boolean {
    return this.faultCommentCharsRemaining < 0;
  }

  get invalid(): boolean {
    return !this.parentForm.get(this.formControlName).valid && this.parentForm.get(this.formControlName).dirty;
  }

  get formControlName() {
    return `faultComment-${this.faultComment.source}-${this.faultType}-${this.faultComment.competencyIdentifier}`;
  }

  get isFieldNotVisible(): boolean {
    const fieldVisibility = this.outcomeBehaviourProvider.getVisibilityType(
      this.outcome, FaultCommentComponent.fieldName,
    );

    return fieldVisibility === VisibilityType.NotVisible || this.isDelegatedTest;
  }

}
