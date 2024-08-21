import { Component } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { QuestionOutcome, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ModalController, NavParams } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { QuestionProvider } from '@providers/question/question';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import { NUMBER_OF_TELL_ME_QUESTIONS } from '@shared/constants/tell-me-questions/tell-me-questions.cat-adi-part2.constants';
import { StoreModel } from '@shared/models/store.model';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { getUntitledCandidateName } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { getTestData } from '@store/tests/test-data/cat-adi-part2/test-data.cat-adi-part2.reducer';
import {
  TellMeQuestionOutcomeChanged,
  TellMeQuestionSelected,
} from '@store/tests/test-data/cat-adi-part2/vehicle-checks/vehicle-checks.cat-adi-part2.action';
import {
  getSelectedTellMeQuestions,
  getVehicleChecksCatADI2,
} from '@store/tests/test-data/cat-adi-part2/vehicle-checks/vehicle-checks.cat-adi-part2.selector';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { Observable, Subscription, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import * as vehicleChecksModalActions from './vehicle-checks-modal.cat-adi-part2.actions';

interface VehicleChecksModalCatADIPart2State {
  candidateName$: Observable<string>;
  tellMeQuestions$: Observable<QuestionResult[]>;
  vehicleChecksScore$: Observable<VehicleChecksScore>;
}

@Component({
  selector: 'vehicle-checks-modal-cat-adi-part2',
  templateUrl: 'vehicle-checks-modal.cat-adi-part2.page.html',
  styleUrls: ['vehicle-checks-modal.cat-adi-part2.page.scss'],
})
export class VehicleChecksCatADIPart2Modal {
  pageState: VehicleChecksModalCatADIPart2State;
  formGroup: UntypedFormGroup;
  tellMeQuestions: VehicleChecksQuestion[];
  readonly tellMeQuestionsNumberArray: number[] = Array(NUMBER_OF_TELL_ME_QUESTIONS);
  vehicleChecksScore: VehicleChecksScore;
  subscription: Subscription;
  submitClicked: boolean;

  constructor(
    public store$: Store<StoreModel>,
    private faultCountProvider: FaultCountProvider,
    public modalCtrl: ModalController,
    questionProvider: QuestionProvider,
    params: NavParams
  ) {
    this.submitClicked = params.get('submitClicked');
    this.formGroup = new UntypedFormGroup({});
    this.tellMeQuestions = questionProvider.getTellMeQuestions(TestCategory.ADI2);
  }

  ngOnInit(): void {
    const currentTest$ = this.store$.pipe(select(getTests), select(getCurrentTest));
    this.pageState = {
      candidateName$: currentTest$.pipe(select(getJournalData), select(getCandidate), select(getUntitledCandidateName)),
      tellMeQuestions$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatADI2),
        select(getSelectedTellMeQuestions)
      ),
      vehicleChecksScore$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatADI2),
        map((vehicleChecks) => this.faultCountProvider.getVehicleChecksFaultCount(TestCategory.ADI2, vehicleChecks))
      ),
    };

    const { vehicleChecksScore$ } = this.pageState;

    const merged$ = merge(vehicleChecksScore$.pipe(map((score) => (this.vehicleChecksScore = score))));

    this.subscription = merged$.subscribe();
  }

  ionViewDidLeave(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async onClose() {
    await this.modalCtrl.dismiss();
  }

  async onSubmit() {
    await this.modalCtrl.dismiss();
  }

  ionViewDidEnter() {
    this.store$.dispatch(vehicleChecksModalActions.VehicleChecksViewDidEnter());
  }

  tellMeQuestionChanged(result: QuestionResult, index: number): void {
    this.store$.dispatch(TellMeQuestionSelected(result, index));
  }

  tellMeQuestionOutcomeChanged(result: QuestionOutcome, index: number): void {
    this.store$.dispatch(TellMeQuestionOutcomeChanged(result, index));
  }
}
