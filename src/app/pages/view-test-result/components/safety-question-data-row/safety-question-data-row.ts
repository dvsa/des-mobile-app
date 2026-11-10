import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { QuestionOutcome, SafetyQuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { IonCol, IonGrid, IonRow } from '@ionic/angular';
import { CompetencyOutcome } from '@shared/models/competency-outcome';

@Component({
  selector: 'safety-question-data-row',
  templateUrl: 'safety-question-data-row.html',
  styleUrls: ['safety-question-data-row.scss'],
  imports: [IonRow, NgClass, IonCol, IonGrid],
})
export class SafetyDataRowComponent {
  @Input()
  label: string;

  @Input()
  data: SafetyQuestionResult[];

  @Input()
  shouldHaveSeperator = true;

  public shouldShowFault(outcome: QuestionOutcome): boolean {
    return outcome === CompetencyOutcome.DF || outcome === undefined;
  }
}
