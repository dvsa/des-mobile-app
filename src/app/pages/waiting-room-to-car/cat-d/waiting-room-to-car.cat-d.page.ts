import { Component, inject, OnInit } from '@angular/core';
import {
  CommonWaitingRoomToCarPageState,
  WaitingRoomToCarBasePageComponent,
} from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { map, withLatestFrom } from 'rxjs/operators';
import { select } from '@ngrx/store';
import { UntypedFormGroup } from '@angular/forms';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { merge, Observable } from 'rxjs';
import { isDelegatedTest } from '@store/tests/delegated-test/delegated-test.selector';
import { getDelegatedTestIndicator } from '@store/tests/delegated-test/delegated-test.reducer';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { WaitingRoomToCarValidationError } from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import {
  DropExtraVehicleChecks,
  DropExtraVehicleChecksDelegated,
  SetFullLicenceHeld,
  VehicleChecksCompletedToggled,
  VehicleChecksDrivingFaultsNumberChanged,
} from '@store/tests/test-data/cat-d/vehicle-checks/vehicle-checks.cat-d.action';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { getPreTestDeclarations } from '@store/tests/pre-test-declarations/pre-test-declarations.reducer';
import {
  getCandidateDeclarationSignedStatus,
  getInsuranceDeclarationStatus,
  getResidencyDeclarationStatus,
} from '@store/tests/pre-test-declarations/pre-test-declarations.selector';
import {
  getFullLicenceHeld,
  getVehicleChecksCatD,
  getVehicleChecksCompleted,
  hasFullLicenceHeldBeenSelected,
} from '@store/tests/test-data/cat-d/vehicle-checks/vehicle-checks.cat-d.selector';
import { getTestData } from '@store/tests/test-data/cat-d/test-data.cat-d.reducer';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { SafetyQuestionsScore } from '@shared/models/safety-questions-score.model';
import { getSafetyQuestionsCatD } from '@store/tests/test-data/cat-d/safety-questions/safety-questions.cat-d.selector';
import { ClearCandidateLicenceData } from '@pages/candidate-licence/candidate-licence.actions';

interface CatDWaitingRoomToCarPageState {
  delegatedTest$: Observable<boolean>;
  candidateDeclarationSigned$: Observable<boolean>;
  insuranceDeclarationAccepted$: Observable<boolean>;
  residencyDeclarationAccepted$: Observable<boolean>;
  vehicleChecksCompleted$: Observable<boolean>;
  vehicleChecksScore$: Observable<VehicleChecksScore>;
  safetyQuestionsScore$: Observable<SafetyQuestionsScore>;
  vehicleChecks$: Observable<CatDUniqueTypes.VehicleChecks>;
  safetyQuestions$: Observable<CatDUniqueTypes.SafetyQuestions>;
  fullLicenceHeld$: Observable<boolean>;
  fullLicenceHeldSelection$: Observable<string>;
}

type WaitingRoomToCarPageState = CommonWaitingRoomToCarPageState & CatDWaitingRoomToCarPageState;

@Component({
  selector: '.waiting-room-to-car-cat-d-page',
  templateUrl: './waiting-room-to-car.cat-d.page.html',
  styleUrls: ['./waiting-room-to-car.cat-d.page.scss'],
})
export class WaitingRoomToCarCatDPage extends WaitingRoomToCarBasePageComponent implements OnInit {
  private faultCountProvider = inject(FaultCountProvider);

  form: UntypedFormGroup;
  pageState: WaitingRoomToCarPageState;
  fullLicenceHeld: boolean = null;
  isDelegated: boolean = false;

  constructor() {
    super();
    this.form = new UntypedFormGroup({});
  }

  ngOnInit(): void {
    super.onInitialisation();

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.pageState = {
      ...this.commonPageState,
      delegatedTest$: currentTest$.pipe(
        select(getDelegatedTestIndicator),
        select(isDelegatedTest),
      ),
      insuranceDeclarationAccepted$: currentTest$.pipe(
        select(getPreTestDeclarations),
        select(getInsuranceDeclarationStatus),
      ),
      residencyDeclarationAccepted$: currentTest$.pipe(
        select(getPreTestDeclarations),
        select(getResidencyDeclarationStatus),
      ),
      candidateDeclarationSigned$: currentTest$.pipe(
        select(getPreTestDeclarations),
        select(getCandidateDeclarationSignedStatus),
      ),
      vehicleChecksCompleted$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatD),
        select(getVehicleChecksCompleted),
      ),
      fullLicenceHeld$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatD),
        select(getFullLicenceHeld),
      ),
      vehicleChecks$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatD),
      ),
      vehicleChecksScore$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatD),
        withLatestFrom(currentTest$.pipe(
          select(getTestCategory),
        )),
        map(([vehicleChecks, category]) =>
          this.faultCountProvider.getVehicleChecksFaultCount(category as TestCategory, vehicleChecks)),
      ),
      fullLicenceHeldSelection$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatD),
        select(getFullLicenceHeld),
        map((licenceHeld) => hasFullLicenceHeldBeenSelected(licenceHeld)),
      ),
      safetyQuestions$: currentTest$.pipe(
        select(getTestData),
        select(getSafetyQuestionsCatD),
      ),
      safetyQuestionsScore$: currentTest$.pipe(
        select(getTestData),
        select(getSafetyQuestionsCatD),
        withLatestFrom(currentTest$.pipe(
          select(getTestCategory),
        )),
        map(([safetyQuestions, category]) =>
          this.faultCountProvider.getSafetyQuestionsFaultCount(category as TestCategory, safetyQuestions)),
      ),
    };

    this.setupSubscription();
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setupSubscription(): void {
    const {
      delegatedTest$,
      fullLicenceHeld$,
    } = this.pageState;

    this.subscription = merge(
      delegatedTest$.pipe(map((result) => this.isDelegated = result)),
      fullLicenceHeld$.pipe(map((result) => this.fullLicenceHeld = result)),
    )
      .subscribe();
  }

  vehicleChecksCompletedOutcomeChanged(toggled: boolean): void {
    this.store$.dispatch(VehicleChecksCompletedToggled(toggled));
  }

  vehicleChecksDrivingFaultsNumberChanged(number: number): void {
    this.store$.dispatch(VehicleChecksDrivingFaultsNumberChanged(
      this.generateDelegatedQuestionResults(number, CompetencyOutcome.DF),
    ));
  }

  fullLicenceHeldChange = (licenceHeld: boolean): void => {
    this.fullLicenceHeld = licenceHeld;
    this.store$.dispatch(SetFullLicenceHeld(licenceHeld));
  };

  onSubmit = async (): Promise<void> => {
    Object.keys(this.form.controls)
      .forEach((controlName: string) => this.form.controls[controlName].markAsDirty());

    if (this.form.valid) {
      if (this.fullLicenceHeld && isAnyOf(this.testCategory, [TestCategory.DE, TestCategory.D1E])) {
        this.store$.dispatch(this.isDelegated ? DropExtraVehicleChecksDelegated() : DropExtraVehicleChecks());
      }
      this.store$.dispatch(ClearCandidateLicenceData());

      await this.routeByCategoryProvider.navigateToPage(
        TestFlowPageNames.TEST_REPORT_PAGE,
        this.testCategory,
        { replaceUrl: !this.isDelegated },
      );
      return;
    }

    Object.keys(this.form.controls)
      .forEach((controlName: string) => {
        if (this.form.controls[controlName].invalid) {
          this.store$.dispatch(WaitingRoomToCarValidationError(`${controlName} is blank`));
        }
      });
  };

  displayLoadSecured = (): boolean => isAnyOf(this.testCategory, [TestCategory.DE, TestCategory.D1E]);

  showFullLicenceHeld = (): boolean => isAnyOf(this.testCategory, [TestCategory.DE, TestCategory.D1E]);
}
