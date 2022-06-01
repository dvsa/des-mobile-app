import { ModalController, NavParams } from '@ionic/angular';
import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, merge } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { QuestionResult, QuestionOutcome } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { getCandidate } from '@store/tests/journal-data/cat-home/candidate/candidate.cat-home.reducer';
import { getUntitledCandidateName }
  from '@store/tests/journal-data/common/candidate/candidate.selector';
import { QuestionProvider } from '@providers/question/question';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import {
  getVehicleChecksCatHomeTest,
  getSelectedShowMeQuestions,
  getSelectedTellMeQuestions,
} from '@store/tests/test-data/cat-home/vehicle-checks/vehicle-checks.cat-home.selector';
import {
  ShowMeQuestionSelected,
  ShowMeQuestionOutcomeChanged,
  TellMeQuestionSelected,
  TellMeQuestionOutcomeChanged,
} from '@store/tests/test-data/cat-home/vehicle-checks/vehicle-checks.cat-home.actions';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import {
  NUMBER_OF_SHOW_ME_QUESTIONS,
} from '@shared/constants/show-me-questions/show-me-questions.cat-home-test.constants';
import {
  NUMBER_OF_TELL_ME_QUESTIONS,
} from '@shared/constants/tell-me-questions/tell-me-questions.cat-home-test.constants';
import { getTestData } from '@store/tests/test-data/cat-home/test-data.cat-h.reducer';
import * as vehicleChecksModalActions from './vehicle-checks-modal.cat-home.actions';

interface VehicleChecksModalCatHomeTestState {
  candidateName$: Observable<string>;
  showMeQuestions$: Observable<QuestionResult[]>;
  tellMeQuestions$: Observable<QuestionResult[]>;
  vehicleChecksScore$: Observable<VehicleChecksScore>;
}

@Component({
  selector: 'vehicle-checks-modal-cat-home-test',
  templateUrl: 'vehicle-checks-modal.cat-home.page.html',
  styleUrls: ['vehicle-checks-modal.cat-home.page.scss'],
})
export class VehicleChecksCatHomeTestModal {
  pageState: VehicleChecksModalCatHomeTestState;
  formGroup: FormGroup;
  showMeQuestions: VehicleChecksQuestion[];
  tellMeQuestions: VehicleChecksQuestion[];
  category: TestCategory;
  readonly showMeQuestionsNumberArray: number[] = Array(NUMBER_OF_SHOW_ME_QUESTIONS);
  readonly tellMeQuestionsNumberArray: number[] = Array(NUMBER_OF_TELL_ME_QUESTIONS);
  vehicleChecksScore: VehicleChecksScore;
  subscription: Subscription;

  constructor(
    public store$: Store<StoreModel>,
    private modalCtrl: ModalController,
    private faultCountProvider: FaultCountProvider,
    private questionProvider: QuestionProvider,
    params: NavParams,
  ) {
    this.category = params.get('category');
    this.formGroup = new FormGroup({});
    this.showMeQuestions = this.questionProvider.getShowMeQuestions(this.category);
    this.tellMeQuestions = this.questionProvider.getTellMeQuestions(this.category);
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
      showMeQuestions$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatHomeTest),
        select(getSelectedShowMeQuestions),
      ),
      tellMeQuestions$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatHomeTest),
        select(getSelectedTellMeQuestions),
      ),
      vehicleChecksScore$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatHomeTest),
        map((vehicleChecks) => this.faultCountProvider.getVehicleChecksFaultCount(this.category, vehicleChecks)),
      ),
    };

    const { vehicleChecksScore$ } = this.pageState;

    const merged$ = merge(
      vehicleChecksScore$.pipe(
        map((score) => this.vehicleChecksScore = score),
      ),
    );

    this.subscription = merged$.subscribe();
  }

  ionViewDidLeave(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ionViewDidEnter() {
    this.store$.dispatch(vehicleChecksModalActions.VehicleChecksViewDidEnter());
  }

  async onClose() {
    await this.modalCtrl.dismiss();
  }

  async onSubmit() {
    await this.modalCtrl.dismiss();
  }

  showMeQuestionChanged(result: QuestionResult, index: number): void {
    this.store$.dispatch(ShowMeQuestionSelected(result, index));
  }

  showMeQuestionOutcomeChanged(result: QuestionOutcome, index: number): void {
    this.store$.dispatch(ShowMeQuestionOutcomeChanged(result, index));
  }

  tellMeQuestionChanged(result: QuestionResult, index: number): void {
    this.store$.dispatch(TellMeQuestionSelected(result, index));
  }

  tellMeQuestionOutcomeChanged(result: QuestionOutcome, index: number): void {
    this.store$.dispatch(TellMeQuestionOutcomeChanged(result, index));
  }
}
