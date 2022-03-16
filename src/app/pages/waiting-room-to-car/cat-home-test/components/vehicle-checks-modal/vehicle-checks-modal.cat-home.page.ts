import { ModalController, NavController } from '@ionic/angular';
import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { getCandidate } from '@store/tests/journal-data/cat-home/candidate/candidate.cat-home.reducer';
import { getUntitledCandidateName }
  from '@store/tests/journal-data/common/candidate/candidate.selector';
import { Observable } from 'rxjs/Observable';
import { FormGroup } from '@angular/forms';
import { QuestionProvider } from '@providers/question/question';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import { QuestionResult, QuestionOutcome, CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
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
import { map } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';
import { Subscription } from 'rxjs/Subscription';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import {
  NUMBER_OF_SHOW_ME_QUESTIONS,
} from '@shared/constants/show-me-questions/show-me-questions.cat-home-test.constants';
import {
  NUMBER_OF_TELL_ME_QUESTIONS,
} from '@shared/constants/tell-me-questions/tell-me-questions.cat-home-test.constants';
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
  testCategory: TestCategory;
  readonly showMeQuestionsNumberArray: number[] = Array(NUMBER_OF_SHOW_ME_QUESTIONS);
  readonly tellMeQuestionsNumberArray: number[] = Array(NUMBER_OF_TELL_ME_QUESTIONS);

  vehicleChecksScore: VehicleChecksScore;

  subscription: Subscription;
  categoryCodeSubscription: Subscription;

  constructor(
    public store$: Store<StoreModel>,
    private navController: NavController,
    private faultCountProvider: FaultCountProvider,
    private testDataByCategoryProvider: TestDataByCategoryProvider,
    private questionProvider: QuestionProvider,
    private modalCtrl: ModalController,
  ) {
    this.formGroup = new FormGroup({});
  }

  ngOnInit(): void {
    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.categoryCodeSubscription = currentTest$.pipe(
      select(getTestCategory),
    ).subscribe((value) => {
      this.testCategory = value as TestCategory;
    });

    const testData$ = currentTest$.pipe(
      map((data) => this.testDataByCategoryProvider.getTestDataByCategoryCode(this.testCategory as CategoryCode)(data)),
    );

    this.showMeQuestions = this.questionProvider.getShowMeQuestions(this.testCategory);
    this.tellMeQuestions = this.questionProvider.getTellMeQuestions(this.testCategory);
    this.pageState = {
      candidateName$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getUntitledCandidateName),
      ),
      showMeQuestions$: testData$.pipe(
        select(getVehicleChecksCatHomeTest),
        select(getSelectedShowMeQuestions),
      ),
      tellMeQuestions$: testData$.pipe(
        select(getVehicleChecksCatHomeTest),
        select(getSelectedTellMeQuestions),
      ),
      vehicleChecksScore$: testData$.pipe(
        select(getVehicleChecksCatHomeTest),
        map((vehicleChecks) => {
          return this.faultCountProvider.getVehicleChecksFaultCount(this.testCategory, vehicleChecks);
        }),
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
    if (this.categoryCodeSubscription) {
      this.categoryCodeSubscription.unsubscribe();
    }
  }

  async onSubmit() {
    await this.modalCtrl.dismiss();
  }

  ionViewDidEnter() {
    this.store$.dispatch(vehicleChecksModalActions.VehicleChecksViewDidEnter());
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

  shouldDisplayBanner = (): boolean => {
    return this.vehicleChecksScore.drivingFaults === 4 && this.vehicleChecksScore.seriousFaults === 1;
  };

  async onClose() {
    await this.modalCtrl.dismiss();
  }
}
