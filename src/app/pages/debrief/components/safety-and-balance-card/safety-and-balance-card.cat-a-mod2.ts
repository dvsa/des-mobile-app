import { Component, OnInit } from '@angular/core';
import { StoreModel } from '@shared/models/store.model';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getTestData } from '@store/tests/test-data/cat-a-mod2/test-data.cat-a-mod2.reducer';
import {
  getSafetyAndBalanceQuestions,
} from '@store/tests/test-data/cat-a-mod2/test-data.cat-a-mod2.selector';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { map } from 'rxjs/operators';

@Component({
  selector: 'safety-and-balance-card-cat-a-mod2',
  templateUrl: 'safety-and-balance-card.cat-a-mod2.html',
  styleUrls: ['safety-and-balance-card.cat-a-mod2.scss'],
})
export class SafetyAndBalanceCardCatAMod2Component implements OnInit {

  safetyAndBalanceQuestions$: Observable<QuestionResult[]>;
  constructor(private store$: Store<StoreModel>) { }

  ngOnInit(): void {
    this.safetyAndBalanceQuestions$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
      select(getTestData),
      select(getSafetyAndBalanceQuestions),
      map((questions) => [...questions.safetyQuestions, ...questions.balanceQuestions]),
      map((checks) => checks.filter((c) => c.code !== undefined)),
    );
  }

  questionHasFault = (result: QuestionResult): boolean => result.outcome !== CompetencyOutcome.P;
}
