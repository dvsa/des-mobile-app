import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, computed } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { QuestionOutcome, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
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
import { Store } from '@ngrx/store';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { QuestionProvider } from '@providers/question/question';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import { StoreModel } from '@shared/models/store.model';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import { selectUntitledCandidateName } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { getTestData } from '@store/tests/test-data/cat-c/test-data.cat-c.reducer';
import {
  SetFullLicenceHeld,
  ShowMeQuestionOutcomeChanged,
  ShowMeQuestionSelected,
  TellMeQuestionOutcomeChanged,
  TellMeQuestionSelected,
} from '@store/tests/test-data/cat-c/vehicle-checks/vehicle-checks.cat-c.action';
import {
  CatCVehicleChecks,
  getFullLicenceHeld,
  getSelectedShowMeQuestions,
  getSelectedTellMeQuestions,
  getVehicleChecksCatC,
} from '@store/tests/test-data/cat-c/vehicle-checks/vehicle-checks.cat-c.selector';
import { selectCurrentTest } from '@store/tests/tests.selector';

import { Style } from '@capacitor/status-bar';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { isAnyOf } from '@shared/helpers/simplifiers';
import {
  NUMBER_OF_SHOW_ME_QUESTIONS as NUMBER_OF_SHOW_ME_QUESTIONS_TRAILER,
  NUMBER_OF_SHOW_ME_QUESTIONS_EXTRA as NUMBER_OF_SHOW_ME_QUESTIONS_TRAILER_EXTRA,
} from '../../../../../shared/constants/show-me-questions/show-me-questions.vocational-trailer.constants';
import { NUMBER_OF_SHOW_ME_QUESTIONS as NUMBER_OF_SHOW_ME_QUESTIONS_NON_TRAILER } from '../../../../../shared/constants/show-me-questions/show-me-questions.vocational.constants';
import {
  NUMBER_OF_TELL_ME_QUESTIONS as NUMBER_OF_TELL_ME_QUESTIONS_TRAILER,
  NUMBER_OF_TELL_ME_QUESTIONS_EXTRA as NUMBER_OF_TELL_ME_QUESTIONS_TRAILER_EXTRA,
} from '../../../../../shared/constants/tell-me-questions/tell-me-questions.vocational-trailer.constants';
import { NUMBER_OF_TELL_ME_QUESTIONS as NUMBER_OF_TELL_ME_QUESTIONS_NON_TRAILER } from '../../../../../shared/constants/tell-me-questions/tell-me-questions.vocational.constants';
import { FullLicenceHeldComponent } from '../../../components/full-licence-held-toggle/full-licence-held-toggle';
import { VehicleChecksQuestionComponent } from '../../../components/vehicle-checks-question/vehicle-checks-question';
import * as vehicleChecksModalActions from './vehicle-checks-modal.cat-c.actions';

@Component({
  selector: 'vehicle-checks-modal-cat-c',
  templateUrl: 'vehicle-checks-modal.cat-c.page.html',
  styleUrls: ['vehicle-checks-modal.cat-c.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    IonFooter,
    IonRow,
    IonCol,
    IonText,
  ],
})
export class VehicleChecksCatCModal {
  private viewCurrentTest = this.store$.selectSignal(selectCurrentTest);
  private viewTestData = computed(() => getTestData(this.viewCurrentTest() as never));
  private viewVehicleChecks = computed(() => getVehicleChecksCatC(this.viewTestData()));
  private checksScore = computed(() =>
    this.faultCountProvider.getVehicleChecksFaultCount(this.category, this.viewVehicleChecks())
  );
  get vehicleChecksScore(): VehicleChecksScore {
    return this.checksScore();
  }
  get vehicleChecks(): CatCVehicleChecks {
    return this.viewVehicleChecks();
  }
  get fullLicenceHeld(): boolean {
    return getFullLicenceHeld(this.viewVehicleChecks());
  }
  candidateName = this.store$.selectSignal(selectUntitledCandidateName);
  selectedShowMeQuestions = computed(() => getSelectedShowMeQuestions(this.viewVehicleChecks()));
  selectedTellMeQuestions = computed(() => getSelectedTellMeQuestions(this.viewVehicleChecks()));
  showFullLicenceHeldInStore = computed(() => getFullLicenceHeld(this.viewVehicleChecks()) !== null);
  fullLicenceHeldSelection = computed(() =>
    this.hasFullLicenceHeldBeenSelected(getFullLicenceHeld(this.viewVehicleChecks()))
  );
  formGroup: UntypedFormGroup;

  showMeQuestions: VehicleChecksQuestion[];
  tellMeQuestions: VehicleChecksQuestion[];

  @Input()
  category: TestCategory;
  @Input()
  submitClicked: boolean;
  @Input()
  isPracticeMode: boolean;

  showMeQuestionsNumberArray: number[];
  tellMeQuestionsNumberArray: number[];

  constructor(
    public store$: Store<StoreModel>,
    private faultCountProvider: FaultCountProvider,
    private ref: ChangeDetectorRef,
    public modalCtrl: ModalController,
    public accessibilityService: AccessibilityService,
    public questionProvider: QuestionProvider
  ) {
    this.formGroup = new UntypedFormGroup({});
  }

  ngOnInit(): void {
    this.showMeQuestions = this.questionProvider.getShowMeQuestions(this.category);
    this.tellMeQuestions = this.questionProvider.getTellMeQuestions(this.category);

    this.setNumberOfShowMeTellMeQuestions(this.fullLicenceHeld);
    this.ref.detectChanges();
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

  ionViewDidEnter(): void {
    this.store$.dispatch(vehicleChecksModalActions.VehicleChecksViewDidEnter());
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
    this.store$.dispatch(SetFullLicenceHeld(licenceHeld));
    this.setNumberOfShowMeTellMeQuestions(licenceHeld);
  };

  showFullLicenceHeld = (): boolean => isAnyOf(this.category, [TestCategory.CE, TestCategory.C1E]);

  isNonTrailerBanner(): boolean {
    return this.vehicleChecksScore.drivingFaults === 4 && this.vehicleChecksScore.seriousFaults === 1;
  }

  shouldDisplayBanner = (): boolean => {
    if (isAnyOf(this.category, [TestCategory.C, TestCategory.C1])) {
      return this.isNonTrailerBanner();
    }
    return (
      this.vehicleChecksScore.drivingFaults === (this.fullLicenceHeld ? 1 : 4) &&
      this.vehicleChecksScore.seriousFaults === 1
    );
  };

  hasFullLicenceHeldBeenSelected = (fullLicenceHeld: boolean): string =>
    fullLicenceHeld === null ? null : fullLicenceHeld ? 'Y' : 'N';

  getNumberOfShowMeQuestions = (fullLicenceHeld: boolean): number =>
    fullLicenceHeld ? NUMBER_OF_SHOW_ME_QUESTIONS_TRAILER : NUMBER_OF_SHOW_ME_QUESTIONS_TRAILER_EXTRA;

  getNumberOfTellMeQuestions = (fullLicenceHeld: boolean): number =>
    fullLicenceHeld ? NUMBER_OF_TELL_ME_QUESTIONS_TRAILER : NUMBER_OF_TELL_ME_QUESTIONS_TRAILER_EXTRA;
}
