import { Component, Input } from '@angular/core';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { CompetencyOutcome } from '@shared/models/competency-outcome';

@Component({
  selector: 'vehicle-checks-office-card',
  templateUrl: 'vehicle-checks-office-card.html',
  styleUrls: ['vehicle-checks-office-card.scss'],
})
export class VehicleChecksOfficeCardComponent {
  @Input()
  display: boolean;

  @Input()
  checks: QuestionResult[];

  questionHasFault = (result: QuestionResult): boolean => result.outcome !== CompetencyOutcome.P;

  ngOnInit(): void {
    this.checks = this.checks.filter((result: QuestionResult) => {
      return 'outcome' in result;
    });
  }
}
