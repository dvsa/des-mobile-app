import { ModalController, NavParams } from '@ionic/angular';
import { Component, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, merge, Subscription } from 'rxjs';
import { UntypedFormGroup } from '@angular/forms';
import { QuestionResult, QuestionOutcome } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { map } from 'rxjs/operators';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { getCandidate } from '@store/tests/journal-data/cat-c/candidate/candidate.cat-c.reducer';
import { getUntitledCandidateName } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { QuestionProvider } from '@providers/question/question';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import { getTestData } from '@store/tests/test-data/cat-c/test-data.cat-c.reducer';
import {
  ShowMeQuestionSelected,
  ShowMeQuestionOutcomeChanged,
  TellMeQuestionSelected,
  TellMeQuestionOutcomeChanged,
  SetFullLicenceHeld,
} from '@store/tests/test-data/cat-c/vehicle-checks/vehicle-checks.cat-c.action';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import {
  getVehicleChecksCatC,
  getSelectedShowMeQuestions,
  getSelectedTellMeQuestions,
  CatCVehicleChecks,
  getFullLicenceHeld,
} from '@store/tests/test-data/cat-c/vehicle-checks/vehicle-checks.cat-c.selector';

import { isAnyOf } from '@shared/helpers/simplifiers';
import {
  NUMBER_OF_TELL_ME_QUESTIONS as NUMBER_OF_TELL_ME_QUESTIONS_NON_TRAILER,
} from '../../../../../shared/constants/tell-me-questions/tell-me-questions.vocational.constants';
import {
  NUMBER_OF_SHOW_ME_QUESTIONS as NUMBER_OF_SHOW_ME_QUESTIONS_NON_TRAILER,
} from '../../../../../shared/constants/show-me-questions/show-me-questions.vocational.constants';
import {
  NUMBER_OF_TELL_ME_QUESTIONS as NUMBER_OF_TELL_ME_QUESTIONS_TRAILER,
  NUMBER_OF_TELL_ME_QUESTIONS_EXTRA as NUMBER_OF_TELL_ME_QUESTIONS_TRAILER_EXTRA,
} from '../../../../../shared/constants/tell-me-questions/tell-me-questions.vocational-trailer.constants';
import {
  NUMBER_OF_SHOW_ME_QUESTIONS as NUMBER_OF_SHOW_ME_QUESTIONS_TRAILER,
  NUMBER_OF_SHOW_ME_QUESTIONS_EXTRA as NUMBER_OF_SHOW_ME_QUESTIONS_TRAILER_EXTRA,
} from '../../../../../shared/constants/show-me-questions/show-me-questions.vocational-trailer.constants';
import * as vehicleChecksModalActions from './vehicle-checks-modal.cat-c.actions';

interface VehicleChecksModalCatCState {
  candidateName$: Observable<string>;
  showMeQuestions$: Observable<QuestionResult[]>;
  tellMeQuestions$: Observable<QuestionResult[]>;
  vehicleChecksScore$: Observable<VehicleChecksScore>;
  vehicleChecks$: Observable<CatCVehicleChecks>;
  fullLicenceHeld$: Observable<boolean>;
  showFullLicenceHeld$: Observable<boolean>;
  fullLicenceHeldSelection$: Observable<string>;
}

@Component({
  selector: 'vehicle-checks-modal-cat-c',
  templateUrl: 'vehicle-checks-modal.cat-c.page.html',
  styleUrls: ['vehicle-checks-modal.cat-c.page.scss'],
})
export class VehicleChecksCatCModal {

  @Input()
  zoom: string;

  pageState: VehicleChecksModalCatCState;
  formGroup: UntypedFormGroup;

  showMeQuestions: VehicleChecksQuestion[];
  tellMeQuestions: VehicleChecksQuestion[];

  category: TestCategory;
  fullLicenceHeld: boolean = null;
  showMeQuestionsNumberArray: number[];
  tellMeQuestionsNumberArray: number[];

  vehicleChecksScore: VehicleChecksScore;
  vehicleChecks: CatCVehicleChecks;
  subscription: Subscription;

  constructor(
    public store$: Store<StoreModel>,
    private faultCountProvider: FaultCountProvider,
    public modalCtrl: ModalController,
    questionProvider: QuestionProvider,
    params: NavParams,
  ) {
    this.category = params.get('category');
    this.formGroup = new UntypedFormGroup({});
    this.showMeQuestions = questionProvider.getShowMeQuestions(this.category);
    this.tellMeQuestions = questionProvider.getTellMeQuestions(this.category);
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
        select(getVehicleChecksCatC),
        select(getSelectedShowMeQuestions),
      ),
      tellMeQuestions$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatC),
        select(getSelectedTellMeQuestions),
      ),
      vehicleChecksScore$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatC),
        map((vehicleChecks) => this.faultCountProvider.getVehicleChecksFaultCount(this.category, vehicleChecks)),
      ),
      vehicleChecks$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatC),
      ),
      fullLicenceHeld$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatC),
        select(getFullLicenceHeld),
      ),
      showFullLicenceHeld$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatC),
        select(getFullLicenceHeld),
        map((licenceHeld: boolean) => licenceHeld !== null),
      ),
      fullLicenceHeldSelection$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatC),
        select(getFullLicenceHeld),
        map((licenceHeld) => this.hasFullLicenceHeldBeenSelected(licenceHeld)),
      ),
    };

    const {
      vehicleChecksScore$,
      vehicleChecks$,
      fullLicenceHeld$,
    } = this.pageState;

    const merged$ = merge(
      vehicleChecksScore$.pipe(map((score) => (this.vehicleChecksScore = score))),
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
      case TestCategory.C:
      case TestCategory.C1:
        numberOfShowMeQuestions = NUMBER_OF_SHOW_ME_QUESTIONS_NON_TRAILER;
        numberOfTellMeQuestions = NUMBER_OF_TELL_ME_QUESTIONS_NON_TRAILER;
        break;
      case TestCategory.CE:
      case TestCategory.C1E:
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

  ionViewDidEnter(): void {
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

  showFullLicenceHeld = (): boolean => isAnyOf(this.category, [TestCategory.CE, TestCategory.C1E]);

  isNonTrailerBanner(): boolean {
    return (
      this.vehicleChecksScore.drivingFaults === 4
            && this.vehicleChecksScore.seriousFaults === 1
    );
  }

  isTrailerBanner(): boolean {
    return (
      this.vehicleChecksScore.drivingFaults === 1
            && this.vehicleChecksScore.seriousFaults === 1
            && isAnyOf(this.category, [TestCategory.CE, TestCategory.C1E])
    );
  }

  shouldDisplayBanner = (): boolean => {
    if (isAnyOf(this.category, [TestCategory.C, TestCategory.C1])) {
      return this.isNonTrailerBanner();
    }
    return (
      this.vehicleChecksScore.drivingFaults === (this.fullLicenceHeld ? 1 : 4)
            && this.vehicleChecksScore.seriousFaults === 1
    );
  };

  hasFullLicenceHeldBeenSelected = (
    fullLicenceHeld: boolean,
  ): string => (fullLicenceHeld === null) ? null : fullLicenceHeld ? 'Y' : 'N';

  getNumberOfShowMeQuestions = (
    fullLicenceHeld: boolean,
  ): number => fullLicenceHeld ? NUMBER_OF_SHOW_ME_QUESTIONS_TRAILER : NUMBER_OF_SHOW_ME_QUESTIONS_TRAILER_EXTRA;

  getNumberOfTellMeQuestions = (
    fullLicenceHeld: boolean,
  ): number => fullLicenceHeld ? NUMBER_OF_TELL_ME_QUESTIONS_TRAILER : NUMBER_OF_TELL_ME_QUESTIONS_TRAILER_EXTRA;
}
