import { Component, computed } from '@angular/core';
import { AddOrRemoveLangCyDirective } from '@directives/add-or-remove-lang-cy.directive';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { IonCol, IonRow } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { StoreModel } from '@shared/models/store.model';
import { getTestData } from '@store/tests/test-data/cat-a-mod2/test-data.cat-a-mod2.reducer';
import { getSafetyAndBalanceQuestions } from '@store/tests/test-data/cat-a-mod2/test-data.cat-a-mod2.selector';
import { selectCurrentTest } from '@store/tests/tests.selector';

@Component({
  selector: 'safety-and-balance-cat-a-mod2',
  templateUrl: 'safety-and-balance.cat-a-mod2.html',
  styleUrls: ['safety-and-balance.cat-a-mod2.scss'],
  imports: [IonRow, IonCol, AddOrRemoveLangCyDirective, TranslatePipe],
})
export class SafetyAndBalanceCardCatAMod2Component {
  private currentTest = this.store$.selectSignal(selectCurrentTest);
  safetyAndBalanceQuestions = computed(() => {
    const questions = getSafetyAndBalanceQuestions(getTestData(this.currentTest()));
    return [...questions.safetyQuestions, ...questions.balanceQuestions].filter(
      (question) => question.code !== undefined
    );
  });

  constructor(private store$: Store<StoreModel>) {}

  questionHasFault = (result: QuestionResult): boolean => result.outcome !== CompetencyOutcome.P;
}
