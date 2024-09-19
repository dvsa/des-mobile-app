import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { select } from '@ngrx/store';
import { ClearCandidateLicenceData } from '@pages/candidate-licence/candidate-licence.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { WaitingRoomToCarValidationError } from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import {
  CommonWaitingRoomToCarPageState,
  WaitingRoomToCarBasePageComponent,
} from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { getDelegatedTestIndicator } from '@store/tests/delegated-test/delegated-test.reducer';
import { isDelegatedTest } from '@store/tests/delegated-test/delegated-test.selector';
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
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import {
  MotEvidenceChanged,
  MotEvidenceProvidedReset,
  MotEvidenceProvidedToggled,
} from '@store/tests/vehicle-details/vehicle-details.actions';
import { Observable, merge } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

interface CatCWaitingRoomToCarPageState {
  delegatedTest$: Observable<boolean>;
  candidateDeclarationSigned$: Observable<boolean>;
  insuranceDeclarationAccepted$: Observable<boolean>;
  residencyDeclarationAccepted$: Observable<boolean>;
  vehicleChecksCompleted$: Observable<boolean>;
  vehicleChecksScore$: Observable<VehicleChecksScore>;
  vehicleChecks$: Observable<CatCUniqueTypes.VehicleChecks>;
  fullLicenceHeld$: Observable<boolean>;
  fullLicenceHeldSelection$: Observable<string>;
}

type WaitingRoomToCarPageState = CommonWaitingRoomToCarPageState & CatCWaitingRoomToCarPageState;

@Component({
  selector: '.waiting-room-to-car-cat-c-page',
  templateUrl: './waiting-room-to-car.cat-c.page.html',
  styleUrls: ['./waiting-room-to-car.cat-c.page.scss'],
})
export class WaitingRoomToCarCatCPage extends WaitingRoomToCarBasePageComponent implements OnInit {
  form: UntypedFormGroup;
  pageState: WaitingRoomToCarPageState;
  fullLicenceHeld: boolean = null;
  isDelegated = false;
  submitClicked = false;

  constructor(injector: Injector) {
    super(injector);
    this.form = new UntypedFormGroup({});
  }

  ngOnInit(): void {
    super.onInitialisation();

    const currentTest$ = this.store$.pipe(select(getTests), select(getCurrentTest));

    this.pageState = {
      ...this.commonPageState,
      delegatedTest$: currentTest$.pipe(select(getDelegatedTestIndicator), select(isDelegatedTest)),
      insuranceDeclarationAccepted$: currentTest$.pipe(
        select(getPreTestDeclarations),
        select(getInsuranceDeclarationStatus)
      ),
      residencyDeclarationAccepted$: currentTest$.pipe(
        select(getPreTestDeclarations),
        select(getResidencyDeclarationStatus)
      ),
      candidateDeclarationSigned$: currentTest$.pipe(
        select(getPreTestDeclarations),
        select(getCandidateDeclarationSignedStatus)
      ),
      vehicleChecksCompleted$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatC),
        select(getVehicleChecksCompleted)
      ),
      fullLicenceHeld$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatC),
        select(getFullLicenceHeld)
      ),
      vehicleChecks$: currentTest$.pipe(select(getTestData), select(getVehicleChecksCatC)),
      vehicleChecksScore$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatC),
        withLatestFrom(currentTest$.pipe(select(getTestCategory))),
        map(([vehicleChecks, category]) =>
          this.faultCountProvider.getVehicleChecksFaultCount(category as TestCategory, vehicleChecks)
        )
      ),
      fullLicenceHeldSelection$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatC),
        select(getFullLicenceHeld),
        map((licenceHeld) => hasFullLicenceHeldBeenSelected(licenceHeld))
      ),
    };

    this.setupSubscription();
  }

  motNoEvidenceCancelled = (): void => {
    this.form.get('alternateEvidenceCtrl')?.reset();
    this.store$.dispatch(MotEvidenceProvidedToggled(undefined));
    this.store$.dispatch(MotEvidenceProvidedReset());
  };

  ionViewDidLeave(): void {
    super.ionViewDidLeave();

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setupSubscription(): void {
    const { delegatedTest$, fullLicenceHeld$ } = this.pageState;

    this.subscription = merge(
      delegatedTest$.pipe(map((result) => (this.isDelegated = result))),
      fullLicenceHeld$.pipe(map((result) => (this.fullLicenceHeld = result)))
    ).subscribe();
  }

  vehicleChecksCompletedOutcomeChanged(toggled: boolean): void {
    this.store$.dispatch(VehicleChecksCompletedToggled(toggled));
  }

  vehicleChecksDrivingFaultsNumberChanged(number: number): void {
    this.store$.dispatch(
      VehicleChecksDrivingFaultsNumberChanged(this.generateDelegatedQuestionResults(number, CompetencyOutcome.DF))
    );
  }

  fullLicenceHeldChange = (licenceHeld: boolean): void => {
    this.fullLicenceHeld = licenceHeld;
    this.store$.dispatch(SetFullLicenceHeld(licenceHeld));
  };

  onSubmit = async (): Promise<void> => {
    Object.keys(this.form.controls).forEach((controlName: string) => this.form.controls[controlName].markAsDirty());

    if (this.form.valid) {
      if (this.fullLicenceHeld && isAnyOf(this.testCategory, [TestCategory.CE, TestCategory.C1E])) {
        this.store$.dispatch(this.isDelegated ? DropExtraVehicleChecksDelegated() : DropExtraVehicleChecks());
      }
      this.store$.dispatch(ClearCandidateLicenceData());
      this.abortMOTCall();

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
