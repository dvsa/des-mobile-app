import { NgClass } from '@angular/common';
import { Component, OnInit, computed } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { OfflineBannerComponent } from '@components/common/offline-banner/offline-banner';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
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
import { WaitingRoomToCarBasePageComponent } from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { getPreTestDeclarations } from '@store/tests/pre-test-declarations/pre-test-declarations.reducer';
import {
  getCandidateDeclarationSignedStatus,
  getInsuranceDeclarationStatus,
  getResidencyDeclarationStatus,
} from '@store/tests/pre-test-declarations/pre-test-declarations.selector';
import { getTestData } from '@store/tests/test-data/cat-home/test-data.cat-h.reducer';
import { getVehicleChecksCatHomeTest } from '@store/tests/test-data/cat-home/vehicle-checks/vehicle-checks.cat-home.selector';
import { EyesightTestReset } from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import { MotEvidenceProvidedReset } from '@store/tests/vehicle-details/vehicle-details.actions';
import { AccompanimentCardComponent } from '../components/accompaniment-card/accompaniment-card';
import { EyesightFailureConfirmationComponent } from '../components/eyesight-failure-confirmation/eyesight-failure-confirmation';
import { EyesightTestComponent } from '../components/eyesight-test/eyesight-test';
import { MotNoEvidenceConfirmationComponent } from '../components/mot-components/mot-no-evidence-confirmation/mot-no-evidence-confirmation';
import { TestCategoryComponent } from '../components/test-category/test-category';
import { VehicleChecksComponent } from '../components/vehicle-checks/vehicle-checks';
import { VehicleRegistrationComponent } from '../components/vehicle-registration/vehicle-registration';

@Component({
  selector: 'app-waiting-room-to-car-cat-home-test',
  templateUrl: './waiting-room-to-car.cat-home-test.page.html',
  styleUrls: ['./waiting-room-to-car.cat-home-test.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    NgClass,
    TestFlowHeaderComponent,
    IonContent,
    OfflineBannerComponent,
    WarningBannerComponent,
    FormsModule,
    ReactiveFormsModule,
    IonGrid,
    EyesightTestComponent,
    IonRow,
    EyesightFailureConfirmationComponent,
    IonCol,
    VehicleRegistrationComponent,
    MotNoEvidenceConfirmationComponent,
    TestCategoryComponent,
    VehicleChecksComponent,
    AccompanimentCardComponent,
    IonFooter,
    IonButton,
    IonText,
  ],
})
export class WaitingRoomToCarCatHomeTestPage extends WaitingRoomToCarBasePageComponent implements OnInit {
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
  vehicleChecks = computed(() => getVehicleChecksCatHomeTest(getTestData(this.currentTest())));
  vehicleChecksScore = computed(() =>
    this.faultCountProvider.getVehicleChecksFaultCount(this.category() as TestCategory, this.vehicleChecks())
  );
  submitClicked: boolean;

  constructor() {
    super();
    this.form = new UntypedFormGroup({});
  }

  ngOnInit(): void {
    super.onInitialisation();
  }

  motNoEvidenceCancelled = (): void => {
    this.form.get('alternateEvidenceCtrl')?.reset();
    this.store$.dispatch(MotEvidenceProvidedReset());
  };

  onSubmit = async (): Promise<void> => {
    Object.keys(this.form.controls).forEach((controlName: string) => this.form.controls[controlName].markAsDirty());

    if (this.form.valid) {
      this.store$.dispatch(ClearCandidateLicenceData());

      await this.routeByCategoryProvider.navigateToPage(TestFlowPageNames.TEST_REPORT_PAGE, this.testCategory, {
        replaceUrl: true,
      });
      return;
    }

    Object.keys(this.form.controls).forEach((controlName: string) => {
      if (this.form.controls[controlName].invalid) {
        this.store$.dispatch(WaitingRoomToCarValidationError(`${controlName} is blank`));
      }
    });

    this.submitClicked = true;
  };

  eyesightFailCancelled = (): void => {
    this.form.get('eyesightCtrl')?.reset();
    this.store$.dispatch(EyesightTestReset());
  };

  shouldDisplayEyesightBanner = (): boolean => {
    return this.testCategory === TestCategory.K;
  };
}
