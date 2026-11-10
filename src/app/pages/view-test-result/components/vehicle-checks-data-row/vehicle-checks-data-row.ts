import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { QuestionOutcome, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { IonCol, IonRow } from '@ionic/angular';

@Component({
  selector: 'vehicle-checks-data-row',
  templateUrl: 'vehicle-checks-data-row.html',
  styleUrls: ['vehicle-checks-data-row.scss'],
  imports: [IonRow, NgClass, IonCol],
})
export class VehicleChecksDataRowComponent {
  @Input()
  label: string;

  @Input()
  data: QuestionResult[];

  @Input()
  shouldHaveSeperator = true;

  @Input()
  shouldDisplayIncorrect = false;

  isEmptyVehicleChecks = (data: QuestionResult[] = []) => data.every((question) => question.outcome === undefined);

  public shouldShowFault(outcome: QuestionOutcome): boolean {
    return outcome === 'DF';
  }
}
