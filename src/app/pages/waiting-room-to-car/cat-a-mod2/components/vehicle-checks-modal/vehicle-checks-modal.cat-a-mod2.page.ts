import { ModalController, NavController, NavParams } from '@ionic/angular';
import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { getUntitledCandidateName }
  from '@store/tests/journal-data/common/candidate/candidate.selector';
import { Observable, merge, Subscription } from 'rxjs';
import { UntypedFormGroup } from '@angular/forms';
import { QuestionProvider } from '@providers/question/question';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import { QuestionResult, QuestionOutcome } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import * as safetyAndBalance from
  '@store/tests/test-data/cat-a-mod2/safety-and-balance/safety-and-balance.cat-a-mod2.selector';
import {
  NUMBER_OF_BALANCE_QUESTIONS,
} from '@shared/constants/balance-questions.cat-a-mod2.constants';
import {
  NUMBER_OF_SAFETY_QUESTIONS,
} from '@shared/constants/safety-questions.cat-a-mod2.constants';
import { SafetyQuestionsScore } from '@shared/models/safety-questions-score.model';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { map } from 'rxjs/operators';
import { getTestData } from '@store/tests/test-data/cat-a-mod2/test-data.cat-a-mod2.reducer';
import {
  SafetyQuestionOutcomeChanged,
  SafetyQuestionSelected,
  BalanceQuestionSelected,
  BalanceQuestionOutcomeChanged,
} from
  '@store/tests/test-data/cat-a-mod2/safety-and-balance/safety-and-balance.cat-a-mod2.actions';
import * as vehicleChecksModalActions from './vehicle-checks-modal.cat-a-mod2.actions';

interface VehicleChecksModalState {
  candidateName$: Observable<string>;
  safetyQuestions$: Observable<QuestionResult[]>;
  balanceQuestions$: Observable<QuestionResult[]>;
  safetyAndBalanceQuestionsScore$: Observable<SafetyQuestionsScore>;
}

@Component({
  selector: 'vehicle-checks-modal-cat-a-mod2',
  templateUrl: 'vehicle-checks-modal.cat-a-mod2.page.html',
  styleUrls: ['vehicle-checks-modal.cat-a-mod2.page.scss'],
})
export class VehicleChecksCatAMod2Modal {

  pageState: VehicleChecksModalState;
  formGroup: UntypedFormGroup;
  submitClicked: boolean;

  safetyQuestions: VehicleChecksQuestion[];
  balanceQuestions: VehicleChecksQuestion[];

  readonly safetyQuestionsNumberArray: number[] = Array(NUMBER_OF_SAFETY_QUESTIONS);
  readonly balanceQuestionsNumberArray: number[] = Array(NUMBER_OF_BALANCE_QUESTIONS);

  safetyAndBalanceQuestionsScore: SafetyQuestionsScore;

  subscription: Subscription;

  constructor(
    public store$: Store<StoreModel>,
    private navController: NavController,
    private faultCountProvider: FaultCountProvider,
    public modalCtrl: ModalController,
    questionProvider: QuestionProvider,
    params: NavParams,
  ) {
    this.formGroup = new UntypedFormGroup({});
    this.submitClicked = params.get('submitClicked');
    this.safetyQuestions = questionProvider.getSafetyQuestions(TestCategory.EUAM2);
    this.balanceQuestions = questionProvider.getBalanceQuestions(TestCategory.EUAM2);
  }

  ngOnInit(): void {
    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );
    this.pageState = {
      candidateName$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getUntitledCandidateName),
      ),
      safetyQuestions$: currentTest$.pipe(
        select(getTestData),
        select(safetyAndBalance.getSafetyAndBalanceQuestions),
        select(safetyAndBalance.getSelectedSafetyQuestions),
      ),
      balanceQuestions$: currentTest$.pipe(
        select(getTestData),
        select(safetyAndBalance.getSafetyAndBalanceQuestions),
        select(safetyAndBalance.getSelectedBalanceQuestions),
      ),
      safetyAndBalanceQuestionsScore$: currentTest$.pipe(
        select(getTestData),
        select(safetyAndBalance.getSafetyAndBalanceQuestions),
        map((safetyAndBalanceQuestions) =>
          this.faultCountProvider.getSafetyAndBalanceFaultCount(TestCategory.EUAM2, safetyAndBalanceQuestions)),
      ),
    };

    const { safetyAndBalanceQuestionsScore$ } = this.pageState;

    const merged$ = merge(
      safetyAndBalanceQuestionsScore$.pipe(
        map((score) => this.safetyAndBalanceQuestionsScore = score),
      ),
    );

    this.subscription = merged$.subscribe();
  }

  ionViewDidLeave(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async onSubmit() {
    await this.modalCtrl.dismiss();
  }

  async onClose() {
    await this.modalCtrl.dismiss();
  }

  ionViewDidEnter() {
    this.store$.dispatch(vehicleChecksModalActions.VehicleChecksViewDidEnter());
  }

  safetyQuestionChanged(result: QuestionResult, index: number): void {
    this.store$.dispatch(SafetyQuestionSelected(result, index));
  }

  safetyQuestionOutcomeChanged(result: QuestionOutcome, index: number): void {
    this.store$.dispatch(SafetyQuestionOutcomeChanged(result, index));
  }

  balanceQuestionChanged(result: QuestionResult, index: number): void {
    this.store$.dispatch(BalanceQuestionSelected(result, index));
  }

  balanceQuestionOutcomeChanged(result: QuestionOutcome, index: number): void {
    this.store$.dispatch(BalanceQuestionOutcomeChanged(result, index));
  }

  shouldDisplayBanner = (): boolean => {
    return this.safetyAndBalanceQuestionsScore.drivingFaults === 1;
  };
}
