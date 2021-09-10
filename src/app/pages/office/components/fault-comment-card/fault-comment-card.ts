import {
  Component, Input, Output, EventEmitter,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FaultSummary } from '@shared/models/fault-marking.model';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

@Component({
  selector: 'fault-comment-card',
  templateUrl: 'fault-comment-card.html',
  styleUrls: ['fault-comment-card.scss'],
})
export class FaultCommentCardComponent {
  @Input()
  outcome: string;

  @Input()
  formGroup: FormGroup;

  @Input()
  faultComments: FaultSummary[];

  @Input()
  header: string;

  @Input()
  faultType: string;

  @Input()
  shouldRender: boolean;

  @Input()
  faultCount: number;

  @Input()
  maxFaultCount: number;

  @Input()
  isDelegatedTest?: boolean = false;

  @Input()
  testCategory?: TestCategory;

  @Output()
  faultCommentsChange = new EventEmitter<FaultSummary>();

  ngOnChanges() {
    this.faultComments.forEach((value) => {
      const control = new FormControl(null);
      this.formGroup.addControl(
        `faultComment-${value.source}-${this.faultType}-${value.competencyIdentifier}`, control,
      );
    });
  }

  faultCommentChanged(faultComment: FaultSummary): void {
    this.faultCommentsChange.emit(faultComment);
  }
}
