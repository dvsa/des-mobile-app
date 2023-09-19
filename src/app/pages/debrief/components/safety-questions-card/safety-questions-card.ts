import { Component, Input } from '@angular/core';
import { QuestionResult, SafetyQuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { CompetencyOutcome } from '@shared/models/competency-outcome';

@Component({
  selector: 'safety-questions-card',
  templateUrl: 'safety-questions-card.html',
  styleUrls: ['safety-questions-card.scss'],
})
export class SafetyQuestionsCardComponent {

  @Input()
  data: SafetyQuestionResult[];

  questionHasFault = (result: QuestionResult): boolean => result.outcome !== CompetencyOutcome.P;
}
