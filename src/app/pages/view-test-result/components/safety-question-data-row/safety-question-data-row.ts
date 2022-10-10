import { Component, Input } from '@angular/core';
import { QuestionOutcome, SafetyQuestionResult } from '@dvsa/mes-test-schema/categories/common';

@Component({
  selector: 'safety-question-data-row',
  templateUrl: 'safety-question-data-row.html',
  styleUrls: ['safety-question-data-row.scss'],
})
export class SafetyDataRowComponent {

  @Input()
  label: string;

  @Input()
  data: SafetyQuestionResult[];

  @Input()
  shouldHaveSeperator: boolean = true;

  @Input()
  isDebrief: boolean = false;

  public shouldShowFault(outcome: QuestionOutcome): boolean {
    return outcome === 'DF';
  }
}
