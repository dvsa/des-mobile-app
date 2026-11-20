import { Component, computed, inject } from '@angular/core';
import { AddOrRemoveLangCyDirective } from '@directives/add-or-remove-lang-cy.directive';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonRow, IonText } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { StoreModel } from '@shared/models/store.model';
import { getTestData } from '@store/tests/test-data/cat-a-mod2/test-data.cat-a-mod2.reducer';
import { getSafetyAndBalanceQuestions } from '@store/tests/test-data/cat-a-mod2/test-data.cat-a-mod2.selector';
import { selectCurrentTest } from '@store/tests/tests.selector';

@Component({
  selector: 'safety-and-balance-card-cat-a-mod2',
  templateUrl: 'safety-and-balance-card.cat-a-mod2.html',
  styleUrls: ['safety-and-balance-card.cat-a-mod2.scss'],
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
export class SafetyAndBalanceCardCatAMod2Component {
  private store$ = inject<Store<StoreModel>>(Store);
  private currentTest = this.store$.selectSignal(selectCurrentTest);

  safetyAndBalanceQuestions = computed<QuestionResult[]>(() => {
    const test = this.currentTest();
    if (!test) return [];
    const questions = getSafetyAndBalanceQuestions(getTestData(test as never) as never);
    return [...questions.safetyQuestions, ...questions.balanceQuestions].filter(
      (question) => question.code !== undefined
    );
  });

  questionHasFault = (result: QuestionResult): boolean => result.outcome !== CompetencyOutcome.P;
}
