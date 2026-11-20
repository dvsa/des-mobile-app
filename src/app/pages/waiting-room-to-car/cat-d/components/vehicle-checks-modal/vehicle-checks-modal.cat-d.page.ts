import { Component, Input, computed } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { QuestionOutcome, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Store } from '@ngrx/store';
import { QuestionProvider } from '@providers/question/question';
import { SafetyQuestion } from '@providers/question/safety-question.model';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { StoreModel } from '@shared/models/store.model';
import { selectUntitledCandidateName } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { selectCurrentTest } from '@store/tests/tests.selector';

import { getTestData } from '@store/tests/test-data/cat-d/test-data.cat-d.reducer';

import {
  SetFullLicenceHeld,
  ShowMeQuestionOutcomeChanged,
  ShowMeQuestionSelected,
  TellMeQuestionOutcomeChanged,
  TellMeQuestionSelected,
} from '@store/tests/test-data/cat-d/vehicle-checks/vehicle-checks.cat-d.action';

import { SafetyQuestionOutcomeChanged } from '@store/tests/test-data/cat-d/safety-questions/safety-questions.cat-d.action';

import { NUMBER_OF_SAFETY_QUESTIONS } from '@shared/constants/safety-questions.cat-d.constants';

import { Style } from '@capacitor/status-bar';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonLabel,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import {
  NUMBER_OF_SHOW_ME_QUESTIONS as NUMBER_OF_SHOW_ME_QUESTIONS_TRAILER,
  NUMBER_OF_SHOW_ME_QUESTIONS_EXTRA as NUMBER_OF_SHOW_ME_QUESTIONS_TRAILER_EXTRA,
} from '@shared/constants/show-me-questions/show-me-questions.vocational-trailer.constants';
import { NUMBER_OF_SHOW_ME_QUESTIONS as NUMBER_OF_SHOW_ME_QUESTIONS_NON_TRAILER } from '@shared/constants/show-me-questions/show-me-questions.vocational.constants';
import {
  NUMBER_OF_TELL_ME_QUESTIONS as NUMBER_OF_TELL_ME_QUESTIONS_TRAILER,
  NUMBER_OF_TELL_ME_QUESTIONS_EXTRA as NUMBER_OF_TELL_ME_QUESTIONS_TRAILER_EXTRA,
} from '@shared/constants/tell-me-questions/tell-me-questions.vocational-trailer.constants';
import { NUMBER_OF_TELL_ME_QUESTIONS as NUMBER_OF_TELL_ME_QUESTIONS_NON_TRAILER } from '@shared/constants/tell-me-questions/tell-me-questions.vocational.constants';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import {
  getSafetyQuestions,
  getSafetyQuestionsCatD,
} from '@store/tests/test-data/cat-d/safety-questions/safety-questions.cat-d.selector';
import {
  CatDVehicleChecks,
  getFullLicenceHeld,
  getSelectedShowMeQuestions,
  getSelectedTellMeQuestions,
  getVehicleChecksCatD,
} from '@store/tests/test-data/cat-d/vehicle-checks/vehicle-checks.cat-d.selector';
import { FullLicenceHeldComponent } from '../../../components/full-licence-held-toggle/full-licence-held-toggle';
import { VehicleChecksQuestionComponent } from '../../../components/vehicle-checks-question/vehicle-checks-question';
import { SafetyQuestionComponent } from '../safety-question/safety-question';
import * as vehicleChecksModalActions from './vehicle-checks-modal.cat-d.actions';

@Component({
  selector: 'vehicle-checks-modal-cat-d',
  templateUrl: 'vehicle-checks-modal.cat-d.page.html',
  styleUrls: ['vehicle-checks-modal.cat-d.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonLabel,
    IonTitle,
    IonContent,
    IonCard,
    FullLicenceHeldComponent,
    FormsModule,
    ReactiveFormsModule,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    VehicleChecksQuestionComponent,
    WarningBannerComponent,
    SafetyQuestionComponent,
    IonFooter,
    IonRow,
    IonCol,
    IonText,
  ],
})
export class VehicleChecksCatDModal {
  private viewCurrentTest = this.store$.selectSignal(selectCurrentTest);
  private viewTestData = computed(() => getTestData(this.viewCurrentTest() as never));
  private viewVehicleChecks = computed(() => getVehicleChecksCatD(this.viewTestData()));
  private checksScore = computed(() =>
    this.faultCountProvider.getVehicleChecksFaultCount(this.category, this.viewVehicleChecks())
  );
  get vehicleChecksScore(): VehicleChecksScore {
    return this.checksScore();
  }
  get vehicleChecks(): CatDVehicleChecks {
    return this.viewVehicleChecks();
  }
  get fullLicenceHeld(): boolean {
    return getFullLicenceHeld(this.viewVehicleChecks());
  }
  safetyQuestionsScore = computed(() =>
    this.faultCountProvider.getSafetyQuestionsFaultCount(this.category, getSafetyQuestionsCatD(this.viewTestData()))
  );
  candidateName = this.store$.selectSignal(selectUntitledCandidateName);
  selectedShowMeQuestions = computed(() => getSelectedShowMeQuestions(this.viewVehicleChecks()));
  selectedTellMeQuestions = computed(() => getSelectedTellMeQuestions(this.viewVehicleChecks()));
  showFullLicenceHeldInStore = computed(() => getFullLicenceHeld(this.viewVehicleChecks()) !== null);
  fullLicenceHeldSelection = computed(() =>
    this.hasFullLicenceHeldBeenSelected(getFullLicenceHeld(this.viewVehicleChecks()))
  );
  selectedSafetyQuestions = computed(() => getSafetyQuestions(getSafetyQuestionsCatD(this.viewTestData())));
  formGroup: UntypedFormGroup;

  showMeQuestions: VehicleChecksQuestion[];
  tellMeQuestions: VehicleChecksQuestion[];
  safetyQuestions: SafetyQuestion[];

  @Input()
  category: TestCategory;
  @Input()
  submitClicked: boolean;
  @Input()
  isPracticeMode: boolean;

  showMeQuestionsNumberArray: number[];
  tellMeQuestionsNumberArray: number[];
  safetyQuestionsNumberArray: number[];

  fullLicenceHeldSelected: string = null;

  constructor(
    public store$: Store<StoreModel>,
    private faultCountProvider: FaultCountProvider,
    public modalCtrl: ModalController,
    public accessibilityService: AccessibilityService,
    public questionProvider: QuestionProvider
  ) {
    this.formGroup = new UntypedFormGroup({});
    this.safetyQuestionsNumberArray = Array(NUMBER_OF_SAFETY_QUESTIONS);
  }

  ngOnInit(): void {
    this.showMeQuestions = this.questionProvider.getShowMeQuestions(this.category);
    this.tellMeQuestions = this.questionProvider.getTellMeQuestions(this.category);
    this.safetyQuestions = this.questionProvider.getVocationalSafetyQuestions(this.category);

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

  async onClose() {
    await this.closeModal();
  }

  async onSubmit() {
    await this.closeModal();
  }

  async closeModal() {
    if (this.isPracticeMode) {
      await this.accessibilityService.configureStatusBar(Style.Light);
    }
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
      this.vehicleChecksScore.drivingFaults === (this.fullLicenceHeld ? 1 : 4) &&
      this.vehicleChecksScore.seriousFaults === 1
    );
  };

  isNonTrailerBanner(): boolean {
    return this.vehicleChecksScore.drivingFaults === 4 && this.vehicleChecksScore.seriousFaults === 1;
  }

  fullLicenceHeldChange = (licenceHeld: boolean): void => {
    this.store$.dispatch(SetFullLicenceHeld(licenceHeld));
    this.setNumberOfShowMeTellMeQuestions(licenceHeld);
  };

  showFullLicenceHeld = (): boolean => isAnyOf(this.category, [TestCategory.DE, TestCategory.D1E]);

  private hasFullLicenceHeldBeenSelected = (fullLicenceHeld: boolean): string =>
    fullLicenceHeld === null ? null : fullLicenceHeld ? 'Y' : 'N';

  getNumberOfShowMeQuestions = (fullLicenceHeld: boolean): number =>
    fullLicenceHeld ? NUMBER_OF_SHOW_ME_QUESTIONS_TRAILER : NUMBER_OF_SHOW_ME_QUESTIONS_TRAILER_EXTRA;

  getNumberOfTellMeQuestions = (fullLicenceHeld: boolean): number =>
    fullLicenceHeld ? NUMBER_OF_TELL_ME_QUESTIONS_TRAILER : NUMBER_OF_TELL_ME_QUESTIONS_TRAILER_EXTRA;
}
