import { Component, Input, OnInit } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { CategoryCode, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { CompetencyOutcome } from '@shared/models/competency-outcome';

@Component({
  selector: 'vehicle-checks-card',
  templateUrl: 'vehicle-checks-card.html',
})
export class VehicleChecksCardComponent implements OnInit {

  @Input()
  category: CategoryCode;

  @Input()
  tellMeShowMeQuestions: QuestionResult[];

  questionHasFault = (result: QuestionResult): boolean => result.outcome !== CompetencyOutcome.P;

  isHomeTest(): boolean {
    switch (this.category) {
      case TestCategory.F:
      case TestCategory.G:
      case TestCategory.H:
      case TestCategory.K: return true;
      default: return false;
    }
  }

  ngOnInit(): void {
    this.tellMeShowMeQuestions = this.tellMeShowMeQuestions.filter((result: QuestionResult) => {
      // eslint-disable-next-line no-prototype-builtins
      return result.hasOwnProperty('outcome');
    });
  }
}
