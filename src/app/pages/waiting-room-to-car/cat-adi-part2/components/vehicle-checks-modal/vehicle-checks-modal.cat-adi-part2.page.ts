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
import { NUMBER_OF_TELL_ME_QUESTIONS } from '@shared/constants/tell-me-questions/tell-me-questions.cat-adi-part2.constants';
import { StoreModel } from '@shared/models/store.model';
import { selectUntitledCandidateName } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { getTestData } from '@store/tests/test-data/cat-adi-part2/test-data.cat-adi-part2.reducer';
import {
  TellMeQuestionOutcomeChanged,
  TellMeQuestionSelected,
} from '@store/tests/test-data/cat-adi-part2/vehicle-checks/vehicle-checks.cat-adi-part2.action';
import {
  getSelectedTellMeQuestions,
  getVehicleChecksCatADI2,
} from '@store/tests/test-data/cat-adi-part2/vehicle-checks/vehicle-checks.cat-adi-part2.selector';
import { selectCurrentTest } from '@store/tests/tests.selector';
import { VehicleChecksQuestionComponent } from '../../../components/vehicle-checks-question/vehicle-checks-question';
import * as vehicleChecksModalActions from './vehicle-checks-modal.cat-adi-part2.actions';

@Component({
  selector: 'vehicle-checks-modal-cat-adi-part2',
  templateUrl: 'vehicle-checks-modal.cat-adi-part2.page.html',
  styleUrls: ['vehicle-checks-modal.cat-adi-part2.page.scss'],
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
export class VehicleChecksCatADIPart2Modal {
  private currentTest = this.store$.selectSignal(selectCurrentTest);
  private checks = computed(() => getVehicleChecksCatADI2(getTestData(this.currentTest() as never)));
  candidateName = this.store$.selectSignal(selectUntitledCandidateName);
  selectedTellMeQuestions = computed(() => getSelectedTellMeQuestions(this.checks()));
  vehicleChecksScore = computed(() =>
    this.faultCountProvider.getVehicleChecksFaultCount(TestCategory.ADI2, this.checks())
  );
  formGroup: UntypedFormGroup;
  tellMeQuestions: VehicleChecksQuestion[];
  readonly tellMeQuestionsNumberArray: number[] = Array(NUMBER_OF_TELL_ME_QUESTIONS);
  @Input()
  submitClicked: boolean;
  @Input()
  isPracticeMode: boolean;

  constructor(
    public store$: Store<StoreModel>,
    private faultCountProvider: FaultCountProvider,
    public modalCtrl: ModalController,
    public accessibilityService: AccessibilityService,
    public questionProvider: QuestionProvider
  ) {
    this.formGroup = new UntypedFormGroup({});
  }

  ngOnInit(): void {
    this.tellMeQuestions = this.questionProvider.getTellMeQuestions(TestCategory.ADI2);
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

  tellMeQuestionChanged(result: QuestionResult, index: number): void {
    this.store$.dispatch(TellMeQuestionSelected(result, index));
  }

  tellMeQuestionOutcomeChanged(result: QuestionOutcome, index: number): void {
    this.store$.dispatch(TellMeQuestionOutcomeChanged(result, index));
  }
}
