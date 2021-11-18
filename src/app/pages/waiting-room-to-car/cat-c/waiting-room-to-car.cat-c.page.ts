import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import {
  CommonWaitingRoomToCarPageState,
  WaitingRoomToCarBasePageComponent,
} from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { Observable, merge } from 'rxjs';
import { isDelegatedTest } from '@store/tests/delegated-test/delegated-test.selector';
import { getDelegatedTestIndicator } from '@store/tests/delegated-test/delegated-test.reducer';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestFlowPageNames } from '@pages/page-names.constants';
import {
  WaitingRoomToCarValidationError,
} from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import {
  DropExtraVehicleChecks,
  VehicleChecksCompletedToggled,
  VehicleChecksDrivingFaultsNumberChanged,
} from '@store/tests/test-data/cat-c/vehicle-checks/vehicle-checks.cat-c.action';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { getPreTestDeclarations } from '@store/tests/pre-test-declarations/pre-test-declarations.reducer';
import {
  getCandidateDeclarationSignedStatus, getInsuranceDeclarationStatus,
  getResidencyDeclarationStatus,
} from '@store/tests/pre-test-declarations/pre-test-declarations.selector';
import {
  getFullLicenceHeld,
  getVehicleChecksCatC, getVehicleChecksCompleted,
} from '@store/tests/test-data/cat-c/vehicle-checks/vehicle-checks.cat-c.selector';
import { getTestData } from '@store/tests/test-data/cat-c/test-data.cat-c.reducer';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { map } from 'rxjs/operators';
import { FaultCountProvider } from '@providers/fault-count/fault-count';

interface CatCWaitingRoomToCarPageState {
  delegatedTest$: Observable<boolean>;
  candidateDeclarationSigned$: Observable<boolean>;
  insuranceDeclarationAccepted$: Observable<boolean>;
  residencyDeclarationAccepted$: Observable<boolean>;
  vehicleChecksCompleted$: Observable<boolean>;
  vehicleChecksScore$: Observable<VehicleChecksScore>;
  vehicleChecks$: Observable<CatCUniqueTypes.VehicleChecks>;
  fullLicenceHeld$: Observable<boolean>;
}

type WaitingRoomToCarPageState = CommonWaitingRoomToCarPageState & CatCWaitingRoomToCarPageState;

@Component({
  selector: '.waiting-room-to-car-cat-c-page',
  templateUrl: './waiting-room-to-car.cat-c.page.html',
  styleUrls: ['./waiting-room-to-car.cat-c.page.scss'],
})
export class WaitingRoomToCarCatCPage extends WaitingRoomToCarBasePageComponent implements OnInit {

  form: FormGroup;
  pageState: WaitingRoomToCarPageState;
  fullLicenceHeld: boolean = null;

  constructor(
    private faultCountProvider: FaultCountProvider,
    routeByCat: RouteByCategoryProvider,
    store$: Store<StoreModel>,
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
  ) {
    super(store$, platform, authenticationProvider, router, routeByCat);
    this.form = new FormGroup({});
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
        select(getVehicleChecksCatC),
        select(getVehicleChecksCompleted),
      ),
      fullLicenceHeld$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatC),
        select(getFullLicenceHeld),
      ),
      vehicleChecks$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatC),
      ),
      vehicleChecksScore$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatC),
        map((vehicleChecks) =>
          this.faultCountProvider.getVehicleChecksFaultCount(this.testCategory as TestCategory, vehicleChecks)),
      ),
    };
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
  }

  setupSubscription(): void {
    const { fullLicenceHeld$ } = this.pageState;

    this.subscription = merge(
      fullLicenceHeld$.pipe(map((result) => this.fullLicenceHeld = result)),
    ).subscribe();
  }

  vehicleChecksCompletedOutcomeChanged(toggled: boolean): void {
    this.store$.dispatch(VehicleChecksCompletedToggled(toggled));
  }

  vehicleChecksDrivingFaultsNumberChanged(number: number): void {
    this.store$.dispatch(VehicleChecksDrivingFaultsNumberChanged(
      this.generateDelegatedQuestionResults(number, CompetencyOutcome.DF),
    ));
  }

  onSubmit = async (): Promise<void> => {
    Object.keys(this.form.controls).forEach((controlName: string) => this.form.controls[controlName].markAsDirty());

    if (this.form.valid) {
      if (this.fullLicenceHeld && isAnyOf(this.testCategory, [TestCategory.C, TestCategory.CE])) {
        this.store$.dispatch(DropExtraVehicleChecks());
      }
      await this.routeByCategoryProvider.navigateToPage(TestFlowPageNames.TEST_REPORT_PAGE, this.testCategory);
      return;
    }

    Object.keys(this.form.controls).forEach((controlName: string) => {
      if (this.form.controls[controlName].invalid) {
        this.store$.dispatch(WaitingRoomToCarValidationError(`${controlName} is blank`));
      }
    });
  };

  displayCabLockDown = (): boolean => isAnyOf(this.testCategory, [TestCategory.C, TestCategory.CE]);

  displayLoadSecured = (): boolean => isAnyOf(this.testCategory, [TestCategory.C, TestCategory.CE, TestCategory.C1E]);

}
