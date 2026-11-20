import { NgClass } from '@angular/common';
import { Component, OnInit, computed } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { OfflineBannerComponent } from '@components/common/offline-banner/offline-banner';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { CombinationCodes, Configuration, Question, Question5 } from '@dvsa/mes-test-schema/categories/CPC';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonRow,
  IonText,
  IonToolbar,
} from '@ionic/angular';
import { ClearCandidateLicenceData } from '@pages/candidate-licence/candidate-licence.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { WaitingRoomToCarValidationError } from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import { CPCQuestionProvider } from '@providers/cpc-questions/cpc-questions';
import { WaitingRoomToCarBasePageComponent } from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { Combination } from '@shared/constants/cpc-questions/cpc-question-combinations.constants';
import { getPreTestDeclarations } from '@store/tests/pre-test-declarations/pre-test-declarations.reducer';
import {
  getCandidateDeclarationSignedStatus,
  getInsuranceDeclarationStatus,
  getResidencyDeclarationStatus,
} from '@store/tests/pre-test-declarations/pre-test-declarations.selector';
import { PopulateCombination } from '@store/tests/test-data/cat-cpc/combination/combination.action';
import { PopulateTestScore } from '@store/tests/test-data/cat-cpc/overall-score/total-percentage.action';
import { PopulateQuestions } from '@store/tests/test-data/cat-cpc/questions/questions.action';
import { getTestData } from '@store/tests/test-data/cat-cpc/test-data.cat-cpc.reducer';
import { getCombination } from '@store/tests/test-data/cat-cpc/test-data.cat-cpc.selector';
import { getVehicleDetails } from '@store/tests/vehicle-details/cat-cpc/vehicle-details.cat-cpc.reducer';
import { getVehicleConfiguration } from '@store/tests/vehicle-details/cat-cpc/vehicle-details.cat-cpc.selector';
import {
  MotEvidenceProvidedReset,
  PopulateVehicleConfiguration,
} from '@store/tests/vehicle-details/vehicle-details.actions';
import { CandidateDeclarationSignedComponent } from '../components/candidate-declaration/candidate-declaration';
import { MotNoEvidenceConfirmationComponent } from '../components/mot-components/mot-no-evidence-confirmation/mot-no-evidence-confirmation';
import { VehicleRegistrationComponent } from '../components/vehicle-registration/vehicle-registration';
import { AccompanimentCardCatCPCComponent } from './components/accompaniment-card/accompaniment-card.cat-cpc';
import { CombinationComponent } from './components/combination/combination';
import { VehicleDetailsCatCPCComponent } from './components/vehicle-details/vehicle-details';

@Component({
  selector: 'app-waiting-room-to-car-cat-cpc',
  templateUrl: './waiting-room-to-car.cat-cpc.page.html',
  styleUrls: ['./waiting-room-to-car.cat-cpc.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    NgClass,
    TestFlowHeaderComponent,
    IonContent,
    OfflineBannerComponent,
    FormsModule,
    ReactiveFormsModule,
    IonGrid,
    IonRow,
    IonCol,
    CandidateDeclarationSignedComponent,
    VehicleRegistrationComponent,
    MotNoEvidenceConfirmationComponent,
    VehicleDetailsCatCPCComponent,
    CombinationComponent,
    AccompanimentCardCatCPCComponent,
    IonFooter,
    IonButton,
    IonText,
  ],
})
export class WaitingRoomToCarCatCPCPage extends WaitingRoomToCarBasePageComponent implements OnInit {
  form: UntypedFormGroup;
  insuranceDeclarationAccepted = computed(() =>
    getInsuranceDeclarationStatus(getPreTestDeclarations(this.currentTest()))
  );
  residencyDeclarationAccepted = computed(() =>
    getResidencyDeclarationStatus(getPreTestDeclarations(this.currentTest()))
  );
  candidateDeclarationSigned = computed(() =>
    getCandidateDeclarationSignedStatus(getPreTestDeclarations(this.currentTest()))
  );
  combination = computed(() => getCombination(getTestData(this.currentTest())));
  configuration = computed(() => getVehicleConfiguration(getVehicleDetails(this.currentTest())));
  combinations: Combination[];

  constructor(private cpcQuestionProvider: CPCQuestionProvider) {
    super();
    this.form = new UntypedFormGroup({});
  }

  ngOnInit(): void {
    super.onInitialisation();

    this.combinations = this.cpcQuestionProvider.getCombinations(this.category() as TestCategory);
  }

  motNoEvidenceCancelled = (): void => {
    this.form.get('alternateEvidenceCtrl')?.reset();
    this.store$.dispatch(MotEvidenceProvidedReset());
  };

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
    this.subscription?.unsubscribe();
  }

  onSubmit = async (): Promise<void> => {
    Object.keys(this.form.controls).forEach((controlName: string) => this.form.controls[controlName].markAsDirty());

    if (this.form.valid) {
      this.store$.dispatch(ClearCandidateLicenceData());

      await this.routeByCategoryProvider.navigateToPage(TestFlowPageNames.TEST_REPORT_PAGE, this.testCategory, {
        replaceUrl: !this.isDelegated,
      });
      return;
    }

    Object.keys(this.form.controls).forEach((controlName: string) => {
      if (this.form.controls[controlName].invalid) {
        this.store$.dispatch(WaitingRoomToCarValidationError(`${controlName} is blank`));
      }
    });
  };

  vehicleConfiguration(configuration: Configuration): void {
    this.store$.dispatch(PopulateVehicleConfiguration(configuration));
  }

  combinationSelected(combination: CombinationCodes): void {
    const questions: Question[] = this.cpcQuestionProvider.getQuestionsBank(combination);
    const question5: Question5 = this.cpcQuestionProvider.getQuestion5ByVehicleType(combination);

    this.store$.dispatch(PopulateCombination(combination));
    this.store$.dispatch(PopulateQuestions([...questions, question5]));

    // reset total score
    this.store$.dispatch(PopulateTestScore(0));
  }

  showVehicleDetails = (): boolean => this.testCategory === TestCategory.CCPC;
}
