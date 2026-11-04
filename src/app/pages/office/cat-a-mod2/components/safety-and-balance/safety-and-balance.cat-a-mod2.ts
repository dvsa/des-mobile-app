import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AddOrRemoveLangCyDirective } from '@directives/add-or-remove-lang-cy.directive';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { IonCol, IonRow } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { StoreModel } from '@shared/models/store.model';
import { getTestData } from '@store/tests/test-data/cat-a-mod2/test-data.cat-a-mod2.reducer';
import { getSafetyAndBalanceQuestions } from '@store/tests/test-data/cat-a-mod2/test-data.cat-a-mod2.selector';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'safety-and-balance-cat-a-mod2',
  templateUrl: 'safety-and-balance.cat-a-mod2.html',
  styleUrls: ['safety-and-balance.cat-a-mod2.scss'],
  imports: [IonRow, IonCol, AddOrRemoveLangCyDirective, AsyncPipe, TranslatePipe],
})
export class SafetyAndBalanceCardCatAMod2Component implements OnInit {
  safetyAndBalanceQuestions$: Observable<QuestionResult[]>;

  constructor(private store$: Store<StoreModel>) {}

  ngOnInit(): void {
    this.safetyAndBalanceQuestions$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
      select(getTestData),
      select(getSafetyAndBalanceQuestions),
      map((questions) => [...questions.safetyQuestions, ...questions.balanceQuestions]),
      map((checks) => checks.filter((c) => c.code !== undefined))
    );
  }

  questionHasFault = (result: QuestionResult): boolean => result.outcome !== CompetencyOutcome.P;
}
