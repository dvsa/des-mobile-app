import { Component, Input, computed } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { Style } from '@capacitor/status-bar';
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
import { NUMBER_OF_SHOW_ME_QUESTIONS } from '@shared/constants/show-me-questions/show-me-questions.cat-home-test.constants';
import { NUMBER_OF_TELL_ME_QUESTIONS } from '@shared/constants/tell-me-questions/tell-me-questions.cat-home-test.constants';
import { StoreModel } from '@shared/models/store.model';
import { selectUntitledCandidateName } from '@store/tests/journal-data/common/candidate/candidate.selector';
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
import { selectCurrentTest } from '@store/tests/tests.selector';
import { VehicleChecksQuestionComponent } from '../../../components/vehicle-checks-question/vehicle-checks-question';
import * as vehicleChecksModalActions from './vehicle-checks-modal.cat-home.actions';

@Component({
  selector: 'vehicle-checks-modal-cat-home-test',
  templateUrl: 'vehicle-checks-modal.cat-home.page.html',
  styleUrls: ['vehicle-checks-modal.cat-home.page.scss'],
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
    VehicleChecksQuestionComponent,
    FormsModule,
    ReactiveFormsModule,
    IonFooter,
    IonRow,
    IonCol,
    IonText,
  ],
})
export class VehicleChecksCatHomeTestModal {
  private currentTest = this.store$.selectSignal(selectCurrentTest);
  private checks = computed(() => getVehicleChecksCatHomeTest(getTestData(this.currentTest() as never)));
  candidateName = this.store$.selectSignal(selectUntitledCandidateName);
  selectedShowMeQuestions = computed(() => getSelectedShowMeQuestions(this.checks()));
  selectedTellMeQuestions = computed(() => getSelectedTellMeQuestions(this.checks()));
  vehicleChecksScore = computed(() => this.faultCountProvider.getVehicleChecksFaultCount(this.category, this.checks()));
  formGroup: UntypedFormGroup;
  showMeQuestions: VehicleChecksQuestion[];
  tellMeQuestions: VehicleChecksQuestion[];
  @Input()
  category: TestCategory;
  @Input()
  submitClicked: boolean;
  @Input()
  isPracticeMode: boolean;
  readonly showMeQuestionsNumberArray: number[] = Array(NUMBER_OF_SHOW_ME_QUESTIONS);
  readonly tellMeQuestionsNumberArray: number[] = Array(NUMBER_OF_TELL_ME_QUESTIONS);

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
  }

  ionViewDidEnter() {
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
}
