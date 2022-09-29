import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, merge, Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { QuestionResult, QuestionOutcome, SafetyQuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { map } from 'rxjs/operators';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { getCandidate } from '@store/tests/journal-data/cat-d/candidate/candidate.cat-d.reducer';
import { getUntitledCandidateName }
  from '@store/tests/journal-data/common/candidate/candidate.selector';
import { QuestionProvider } from '@providers/question/question';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import { SafetyQuestion } from '@providers/question/safety-question.model';

import { getTestData } from '@store/tests/test-data/cat-d/test-data.cat-d.reducer';

import {
  ShowMeQuestionSelected,
  ShowMeQuestionOutcomeChanged,
  TellMeQuestionSelected,
  TellMeQuestionOutcomeChanged,
  SetFullLicenceHeld,
} from '@store/tests/test-data/cat-d/vehicle-checks/vehicle-checks.cat-d.action';

import {
  SafetyQuestionOutcomeChanged,
} from '@store/tests/test-data/cat-d/safety-questions/safety-questions.cat-d.action';

import {
  NUMBER_OF_SAFETY_QUESTIONS,
} from '@shared/constants/safety-questions.cat-d.constants';

import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import { SafetyQuestionsScore } from '@shared/models/safety-questions-score.model';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import {
  getVehicleChecksCatD,
  getSelectedShowMeQuestions,
  getSelectedTellMeQuestions,
  CatDVehicleChecks, getFullLicenceHeld,
} from '@store/tests/test-data/cat-d/vehicle-checks/vehicle-checks.cat-d.selector';
import {
  getSafetyQuestionsCatD,
  getSafetyQuestions,
} from '@store/tests/test-data/cat-d/safety-questions/safety-questions.cat-d.selector';
import { ModalController, NavParams } from '@ionic/angular';
import {
  NUMBER_OF_SHOW_ME_QUESTIONS as NUMBER_OF_SHOW_ME_QUESTIONS_TRAILER,
  NUMBER_OF_SHOW_ME_QUESTIONS_EXTRA as NUMBER_OF_SHOW_ME_QUESTIONS_TRAILER_EXTRA,
} from '@shared/constants/show-me-questions/show-me-questions.vocational-trailer.constants';
import {
  NUMBER_OF_SHOW_ME_QUESTIONS as NUMBER_OF_SHOW_ME_QUESTIONS_NON_TRAILER,
} from '@shared/constants/show-me-questions/show-me-questions.vocational.constants';
import {
  NUMBER_OF_TELL_ME_QUESTIONS as NUMBER_OF_TELL_ME_QUESTIONS_NON_TRAILER,
} from '@shared/constants/tell-me-questions/tell-me-questions.vocational.constants';
import {
  NUMBER_OF_TELL_ME_QUESTIONS as NUMBER_OF_TELL_ME_QUESTIONS_TRAILER,
  NUMBER_OF_TELL_ME_QUESTIONS_EXTRA as NUMBER_OF_TELL_ME_QUESTIONS_TRAILER_EXTRA,
} from '@shared/constants/tell-me-questions/tell-me-questions.vocational-trailer.constants';
import * as vehicleChecksModalActions from './vehicle-checks-modal.cat-d.actions';

interface VehicleChecksModalCatDState {
  candidateName$: Observable<string>;
  showMeQuestions$: Observable<QuestionResult[]>;
  tellMeQuestions$: Observable<QuestionResult[]>;
  safetyQuestions$: Observable<SafetyQuestionResult[]>;
  vehicleChecksScore$: Observable<VehicleChecksScore>;
  vehicleChecks$: Observable<CatDVehicleChecks>;
  safetyQuestionsScore$: Observable<SafetyQuestionsScore>;
  fullLicenceHeld$: Observable<boolean>;
  showFullLicenceHeld$: Observable<boolean>;
  fullLicenceHeldSelection$: Observable<string>;
}

@Component({
  selector: 'vehicle-checks-modal-cat-d',
  templateUrl: 'vehicle-checks-modal.cat-d.page.html',
  styleUrls: ['vehicle-checks-modal.cat-d.page.scss'],
})
export class VehicleChecksCatDModal {
  pageState: VehicleChecksModalCatDState;
  formGroup: FormGroup;

  showMeQuestions: VehicleChecksQuestion[];
  tellMeQuestions: VehicleChecksQuestion[];
  safetyQuestions: SafetyQuestion[];

  category: TestCategory;

  showMeQuestionsNumberArray: number[];
  tellMeQuestionsNumberArray: number[];
  safetyQuestionsNumberArray: number[];

  vehicleChecksScore: VehicleChecksScore;
  vehicleChecks: CatDVehicleChecks;
  safetyQuestionsScore: SafetyQuestionsScore;

  subscription: Subscription;

  fullLicenceHeldSelected: string = null;
  fullLicenceHeld: boolean = null;

  constructor(
    public store$: Store<StoreModel>,
    private faultCountProvider: FaultCountProvider,
    public modalCtrl: ModalController,
    questionProvider: QuestionProvider,
    params: NavParams,
  ) {
    this.category = params.get('category');
    this.formGroup = new FormGroup({});
    this.safetyQuestionsNumberArray = Array(NUMBER_OF_SAFETY_QUESTIONS);
    this.showMeQuestions = questionProvider.getShowMeQuestions(this.category);
    this.tellMeQuestions = questionProvider.getTellMeQuestions(this.category);
    this.safetyQuestions = questionProvider.getVocationalSafetyQuestions(this.category);
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
        select(getVehicleChecksCatD),
        select(getSelectedShowMeQuestions),
      ),
      tellMeQuestions$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatD),
        select(getSelectedTellMeQuestions),
      ),
      safetyQuestions$: currentTest$.pipe(
        select(getTestData),
        select(getSafetyQuestionsCatD),
        select(getSafetyQuestions),
      ),
      vehicleChecksScore$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatD),
        map((vehicleChecks) => this.faultCountProvider.getVehicleChecksFaultCount(this.category, vehicleChecks)),
      ),
      vehicleChecks$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatD),
      ),
      safetyQuestionsScore$: currentTest$.pipe(
        select(getTestData),
        select(getSafetyQuestionsCatD),
        map((safetyQuestions) => this.faultCountProvider.getSafetyQuestionsFaultCount(this.category, safetyQuestions)),
      ),
      fullLicenceHeld$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatD),
        select(getFullLicenceHeld),
      ),
      showFullLicenceHeld$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatD),
        select(getFullLicenceHeld),
        map((licenceHeld: boolean) => licenceHeld !== null),
      ),
      fullLicenceHeldSelection$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatD),
        select(getFullLicenceHeld),
        map((licenceHeld) => this.hasFullLicenceHeldBeenSelected(licenceHeld)),
      ),
    };

    const {
      vehicleChecksScore$, safetyQuestionsScore$, vehicleChecks$, fullLicenceHeld$,
    } = this.pageState;

    const merged$ = merge(
      vehicleChecksScore$.pipe(map((score) => (this.vehicleChecksScore = score))),
      safetyQuestionsScore$.pipe(map((score) => (this.safetyQuestionsScore = score))),
      vehicleChecks$.pipe(map((checks) => (this.vehicleChecks = checks))),
      fullLicenceHeld$.pipe(map((held) => (this.fullLicenceHeld = held))),
    );
    this.subscription = merged$.subscribe();

    this.setNumberOfShowMeTellMeQuestions(this.fullLicenceHeld);
  }

  setNumberOfShowMeTellMeQuestions(fullLicenceHeld?: boolean) {
    let numberOfShowMeQuestions: number;
    let numberOfTellMeQuestions: number;

    switch (this.category) {
      case TestCategory.D:
      case TestCategory.D1:
        numberOfShowMeQuestions = NUMBER_OF_SHOW_ME_QUESTIONS_NON_TRAILER;
        numberOfTellMeQuestions = NUMBER_OF_TELL_ME_QUESTIONS_NON_TRAILER;
        break;
      case TestCategory.DE:
      case TestCategory.D1E:
        numberOfShowMeQuestions = this.getNumberOfShowMeQuestions(fullLicenceHeld);
        numberOfTellMeQuestions = this.getNumberOfTellMeQuestions(fullLicenceHeld);
        break;
      default:
        return;
    }
    this.showMeQuestionsNumberArray = Array(numberOfShowMeQuestions);
    this.tellMeQuestionsNumberArray = Array(numberOfTellMeQuestions);
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

  safetyQuestionOutcomeChanged(result: QuestionOutcome, index: number): void {
    this.store$.dispatch(SafetyQuestionOutcomeChanged(result, index));
  }

  shouldDisplayBanner = (): boolean => {
    if (this.category === TestCategory.D || this.category === TestCategory.D1) {
      return this.isNonTrailerBanner();
    }
    return (
      this.vehicleChecksScore.drivingFaults === (this.fullLicenceHeld ? 1 : 4)
      && this.vehicleChecksScore.seriousFaults === 1
    );
  };

  isNonTrailerBanner(): boolean {
    return (
      this.vehicleChecksScore.drivingFaults === 4
      && this.vehicleChecksScore.seriousFaults === 1
    );
  }

  fullLicenceHeldChange = (licenceHeld: boolean): void => {
    this.fullLicenceHeld = licenceHeld;
    this.store$.dispatch(SetFullLicenceHeld(licenceHeld));
    this.setNumberOfShowMeTellMeQuestions(licenceHeld);

    // on licence held toggle change, we need to re-evaluate the vehicleChecksScore to control the banner display
    this.vehicleChecksScore = this.faultCountProvider.getVehicleChecksFaultCount(
      this.category,
      this.vehicleChecks,
    );
  };

  showFullLicenceHeld = (): boolean => isAnyOf(this.category, [TestCategory.DE, TestCategory.D1E]);

  private hasFullLicenceHeldBeenSelected = (
    fullLicenceHeld: boolean,
  ): string => (fullLicenceHeld === null) ? null : fullLicenceHeld ? 'Y' : 'N';

  getNumberOfShowMeQuestions = (
    fullLicenceHeld: boolean,
  ): number => fullLicenceHeld ? NUMBER_OF_SHOW_ME_QUESTIONS_TRAILER : NUMBER_OF_SHOW_ME_QUESTIONS_TRAILER_EXTRA;

  getNumberOfTellMeQuestions = (
    fullLicenceHeld: boolean,
  ): number => fullLicenceHeld ? NUMBER_OF_TELL_ME_QUESTIONS_TRAILER : NUMBER_OF_TELL_ME_QUESTIONS_TRAILER_EXTRA;
}
