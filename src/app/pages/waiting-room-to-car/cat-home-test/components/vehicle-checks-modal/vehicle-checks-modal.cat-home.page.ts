import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { QuestionOutcome, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ModalController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { QuestionProvider } from '@providers/question/question';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import {
  NUMBER_OF_SHOW_ME_QUESTIONS,
} from '@shared/constants/show-me-questions/show-me-questions.cat-home-test.constants';
import {
  NUMBER_OF_TELL_ME_QUESTIONS,
} from '@shared/constants/tell-me-questions/tell-me-questions.cat-home-test.constants';
import { StoreModel } from '@shared/models/store.model';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import { getCandidate } from '@store/tests/journal-data/cat-home/candidate/candidate.cat-home.reducer';
import { getUntitledCandidateName } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { getTestData } from '@store/tests/test-data/cat-home/test-data.cat-h.reducer';
import {
  ShowMeQuestionOutcomeChanged,
  ShowMeQuestionSelected,
  TellMeQuestionOutcomeChanged,
  TellMeQuestionSelected,
} from '@store/tests/test-data/cat-home/vehicle-checks/vehicle-checks.cat-home.actions';
import {
  getSelectedShowMeQuestions,
  getSelectedTellMeQuestions,
  getVehicleChecksCatHomeTest,
} from '@store/tests/test-data/cat-home/vehicle-checks/vehicle-checks.cat-home.selector';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as vehicleChecksModalActions from './vehicle-checks-modal.cat-home.actions';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { Style } from '@capacitor/status-bar';

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
  formGroup: UntypedFormGroup;
  showMeQuestions: VehicleChecksQuestion[];
  tellMeQuestions: VehicleChecksQuestion[];
  @Input()
  category: TestCategory;
  @Input()
  submitClicked: boolean;
  readonly showMeQuestionsNumberArray: number[] = Array(NUMBER_OF_SHOW_ME_QUESTIONS);
  readonly tellMeQuestionsNumberArray: number[] = Array(NUMBER_OF_TELL_ME_QUESTIONS);
  vehicleChecksScore: VehicleChecksScore;
  subscription: Subscription;

  constructor(
    public store$: Store<StoreModel>,
    public modalCtrl: ModalController,
    public accessibilityService: AccessibilityService,
    private faultCountProvider: FaultCountProvider,
    private questionProvider: QuestionProvider
  ) {
    this.formGroup = new UntypedFormGroup({});
  }

  ngOnInit(): void {
    this.showMeQuestions = this.questionProvider.getShowMeQuestions(this.category);
    this.tellMeQuestions = this.questionProvider.getTellMeQuestions(this.category);
    const currentTest$ = this.store$.pipe(select(getTests), select(getCurrentTest));

    this.pageState = {
      candidateName$: currentTest$.pipe(select(getJournalData), select(getCandidate), select(getUntitledCandidateName)),
      showMeQuestions$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatHomeTest),
        select(getSelectedShowMeQuestions)
      ),
      tellMeQuestions$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatHomeTest),
        select(getSelectedTellMeQuestions)
      ),
      vehicleChecksScore$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatHomeTest),
        map((vehicleChecks) => this.faultCountProvider.getVehicleChecksFaultCount(this.category, vehicleChecks))
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

  ionViewDidEnter() {
    this.store$.dispatch(vehicleChecksModalActions.VehicleChecksViewDidEnter());
  }

  async onClose() {
    await this.accessibilityService.configureStatusBar(Style.Default);
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
