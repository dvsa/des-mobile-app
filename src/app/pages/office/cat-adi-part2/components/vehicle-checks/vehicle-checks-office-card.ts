import { Component, Input } from '@angular/core';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { CompetencyOutcome } from '@shared/models/competency-outcome';

@Component({
  selector: 'vehicle-checks-office-card-cat-adi2',
  templateUrl: 'vehicle-checks-office-card.html',
})
export class VehicleChecksOfficeCardCatADI2Component {
  @Input()
  display: boolean;

  @Input()
  checks: QuestionResult[];

  ngOnInit(): void {
    this.checks = this.checks.filter((result: QuestionResult) => 'outcome' in result);
  }

  questionHasFault = (result: QuestionResult): boolean => result.outcome !== CompetencyOutcome.P;
}
