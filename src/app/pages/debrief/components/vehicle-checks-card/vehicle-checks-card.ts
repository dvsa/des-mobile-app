import { Component, Input, OnInit } from '@angular/core';
import { CategoryCode, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonRow, IonText } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { AddOrRemoveLangCyDirective } from '../../../../../directives/add-or-remove-lang-cy.directive';

@Component({
  selector: 'vehicle-checks-card',
  templateUrl: 'vehicle-checks-card.html',
  styleUrls: ['vehicle-checks-card.scss'],
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonText,
    AddOrRemoveLangCyDirective,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    TranslatePipe,
  ],
})
export class VehicleChecksCardComponent implements OnInit {
  @Input()
  category: CategoryCode;

  @Input()
  tellMeShowMeQuestions: QuestionResult[] = [];

  ngOnInit(): void {
    this.tellMeShowMeQuestions = this.tellMeShowMeQuestions.filter((result: QuestionResult) => 'outcome' in result);
  }

  questionHasFault = (result: QuestionResult): boolean => result.outcome !== CompetencyOutcome.P;

  isHomeTest(): boolean {
    switch (this.category) {
      case TestCategory.F:
      case TestCategory.G:
      case TestCategory.H:
      case TestCategory.K:
        return true;
      default:
        return false;
    }
  }
}
