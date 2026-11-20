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
import { isAnyOf } from '@shared/helpers/simplifiers';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { getPreTestDeclarations } from '@store/tests/pre-test-declarations/pre-test-declarations.reducer';
import {
  getCandidateDeclarationSignedStatus,
  getInsuranceDeclarationStatus,
  getResidencyDeclarationStatus,
} from '@store/tests/pre-test-declarations/pre-test-declarations.selector';
import { getTestData } from '@store/tests/test-data/cat-c/test-data.cat-c.reducer';
import {
  DropExtraVehicleChecks,
  DropExtraVehicleChecksDelegated,
  SetFullLicenceHeld,
  VehicleChecksCompletedToggled,
  VehicleChecksDrivingFaultsNumberChanged,
} from '@store/tests/test-data/cat-c/vehicle-checks/vehicle-checks.cat-c.action';
import {
  getFullLicenceHeld,
  getVehicleChecksCatC,
  getVehicleChecksCompleted,
  hasFullLicenceHeldBeenSelected,
} from '@store/tests/test-data/cat-c/vehicle-checks/vehicle-checks.cat-c.selector';
import {
  MotEvidenceChanged,
  MotEvidenceProvidedReset,
  MotEvidenceProvidedToggled,
} from '@store/tests/vehicle-details/vehicle-details.actions';
import { AccompanimentCardComponent } from '../components/accompaniment-card/accompaniment-card';
import { CandidateDeclarationSignedComponent } from '../components/candidate-declaration/candidate-declaration';
import { FullLicenceHeldComponent } from '../components/full-licence-held-toggle/full-licence-held-toggle';
import { MotNoEvidenceConfirmationComponent } from '../components/mot-components/mot-no-evidence-confirmation/mot-no-evidence-confirmation';
import { TestCategoryComponent } from '../components/test-category/test-category';
import { VehicleChecksToggleComponent } from '../components/vehicle-checks-completed/vehicle-checks-completed';
import { VehicleChecksComponent } from '../components/vehicle-checks/vehicle-checks';
import { VehicleRegistrationComponent } from '../components/vehicle-registration/vehicle-registration';

@Component({
  selector: '.waiting-room-to-car-cat-c-page',
  templateUrl: './waiting-room-to-car.cat-c.page.html',
  styleUrls: ['./waiting-room-to-car.cat-c.page.scss'],
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
    TestCategoryComponent,
    VehicleChecksComponent,
    FullLicenceHeldComponent,
    VehicleChecksToggleComponent,
    AccompanimentCardComponent,
    WarningBannerComponent,
    IonFooter,
    IonButton,
    IonText,
  ],
})
export class WaitingRoomToCarCatCPage extends WaitingRoomToCarBasePageComponent implements OnInit {
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
  vehicleChecks = computed(() => getVehicleChecksCatC(getTestData(this.currentTest())));
  vehicleChecksCompleted = computed(() => getVehicleChecksCompleted(this.vehicleChecks()));
  fullLicenceHeld = computed(() => getFullLicenceHeld(this.vehicleChecks()));
  fullLicenceHeldSelection = computed(() => hasFullLicenceHeldBeenSelected(this.fullLicenceHeld()));
  vehicleChecksScore = computed(() =>
    this.faultCountProvider.getVehicleChecksFaultCount(this.category() as TestCategory, this.vehicleChecks())
  );
  submitClicked = false;

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

  vehicleChecksCompletedOutcomeChanged(toggled: boolean): void {
    this.store$.dispatch(VehicleChecksCompletedToggled(toggled));
  }

  vehicleChecksDrivingFaultsNumberChanged(number: number): void {
    this.store$.dispatch(
      VehicleChecksDrivingFaultsNumberChanged(this.generateDelegatedQuestionResults(number, CompetencyOutcome.DF))
    );
  }

  fullLicenceHeldChange = (licenceHeld: boolean): void => {
    this.store$.dispatch(SetFullLicenceHeld(licenceHeld));
  };

  onSubmit = async (): Promise<void> => {
    Object.keys(this.form.controls).forEach((controlName: string) => this.form.controls[controlName].markAsDirty());

    if (this.form.valid) {
      if (this.fullLicenceHeld() && isAnyOf(this.testCategory, [TestCategory.CE, TestCategory.C1E])) {
        this.store$.dispatch(this.isDelegated ? DropExtraVehicleChecksDelegated() : DropExtraVehicleChecks());
      }
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

    this.submitClicked = true;
  };

  showFullLicenceHeld = (): boolean => isAnyOf(this.testCategory, [TestCategory.CE, TestCategory.C1E]);
  protected readonly MotEvidenceChanged = MotEvidenceChanged;
  protected readonly MotEvidenceProvidedToggled = MotEvidenceProvidedToggled;
}
