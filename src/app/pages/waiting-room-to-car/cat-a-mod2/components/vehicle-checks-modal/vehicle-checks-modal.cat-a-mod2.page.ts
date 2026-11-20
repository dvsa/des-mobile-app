import { Component, Input, computed } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { Style } from '@capacitor/status-bar';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
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
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { QuestionProvider } from '@providers/question/question';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import { NUMBER_OF_BALANCE_QUESTIONS } from '@shared/constants/balance-questions.cat-a-mod2.constants';
import { NUMBER_OF_SAFETY_QUESTIONS } from '@shared/constants/safety-questions.cat-a-mod2.constants';
import { StoreModel } from '@shared/models/store.model';
import { selectUntitledCandidateName } from '@store/tests/journal-data/common/candidate/candidate.selector';
import {
  BalanceQuestionOutcomeChanged,
  BalanceQuestionSelected,
  SafetyQuestionOutcomeChanged,
  SafetyQuestionSelected,
} from '@store/tests/test-data/cat-a-mod2/safety-and-balance/safety-and-balance.cat-a-mod2.actions';
import * as safetyAndBalance from '@store/tests/test-data/cat-a-mod2/safety-and-balance/safety-and-balance.cat-a-mod2.selector';
import { getTestData } from '@store/tests/test-data/cat-a-mod2/test-data.cat-a-mod2.reducer';
import { selectCurrentTest } from '@store/tests/tests.selector';
import { VehicleChecksQuestionCatAMod2Component } from '../vehicle-checks-question/vehicle-checks-question';
import * as vehicleChecksModalActions from './vehicle-checks-modal.cat-a-mod2.actions';

@Component({
  selector: 'vehicle-checks-modal-cat-a-mod2',
  templateUrl: 'vehicle-checks-modal.cat-a-mod2.page.html',
  styleUrls: ['vehicle-checks-modal.cat-a-mod2.page.scss'],
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
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    VehicleChecksQuestionCatAMod2Component,
    FormsModule,
    ReactiveFormsModule,
    WarningBannerComponent,
    IonFooter,
    IonRow,
    IonCol,
    IonText,
  ],
})
export class VehicleChecksCatAMod2Modal {
  private currentTest = this.store$.selectSignal(selectCurrentTest);
  private questions = computed(() =>
    safetyAndBalance.getSafetyAndBalanceQuestions(getTestData(this.currentTest() as never))
  );
  candidateName = this.store$.selectSignal(selectUntitledCandidateName);
  selectedSafetyQuestions = computed(() => safetyAndBalance.getSelectedSafetyQuestions(this.questions()));
  selectedBalanceQuestions = computed(() => safetyAndBalance.getSelectedBalanceQuestions(this.questions()));
  safetyAndBalanceQuestionsScore = computed(() =>
    this.faultCountProvider.getSafetyAndBalanceFaultCount(TestCategory.EUAM2, this.questions())
  );
  formGroup: UntypedFormGroup;
  @Input()
  submitClicked: boolean;
  @Input()
  isPracticeMode: boolean;

  safetyQuestions: VehicleChecksQuestion[];
  balanceQuestions: VehicleChecksQuestion[];

  readonly safetyQuestionsNumberArray: number[] = Array(NUMBER_OF_SAFETY_QUESTIONS);
  readonly balanceQuestionsNumberArray: number[] = Array(NUMBER_OF_BALANCE_QUESTIONS);

  constructor(
    public store$: Store<StoreModel>,
    public accessibilityService: AccessibilityService,
    private faultCountProvider: FaultCountProvider,
    public modalCtrl: ModalController,
    questionProvider: QuestionProvider
  ) {
    this.formGroup = new UntypedFormGroup({});
    this.safetyQuestions = questionProvider.getSafetyQuestions(TestCategory.EUAM2);
    this.balanceQuestions = questionProvider.getBalanceQuestions(TestCategory.EUAM2);
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
    return this.safetyAndBalanceQuestionsScore().drivingFaults === 1;
  };
}
