import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { QuestionOutcome, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { IonCol, IonGrid, IonRow } from '@ionic/angular';

@Component({
  selector: 'safety-and-balance-data-row',
  templateUrl: 'safety-and-balance-data-row.html',
  styleUrls: ['safety-and-balance-data-row.scss'],
  imports: [IonRow, NgClass, IonCol, IonGrid],
})
export class SafetyAndBalanceDataRowComponent {
  @Input()
  label: string;

  @Input()
  data: QuestionResult[];

  @Input()
  shouldHaveSeperator = true;

  public shouldShowFault(outcome: QuestionOutcome): boolean {
    return outcome === 'DF';
  }
}
