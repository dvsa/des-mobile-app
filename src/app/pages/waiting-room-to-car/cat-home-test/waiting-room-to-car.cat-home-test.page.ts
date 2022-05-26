import { Component, OnInit } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import {
  CommonWaitingRoomToCarPageState, WaitingRoomToCarBasePageComponent,
} from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { map, withLatestFrom } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { Observable } from 'rxjs';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { WaitingRoomToCarValidationError } from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import { getPreTestDeclarations } from '@store/tests/pre-test-declarations/pre-test-declarations.reducer';
import {
  getCandidateDeclarationSignedStatus, getInsuranceDeclarationStatus,
  getResidencyDeclarationStatus,
} from '@store/tests/pre-test-declarations/pre-test-declarations.selector';
import {
  getVehicleChecksCatHomeTest,
} from '@store/tests/test-data/cat-home/vehicle-checks/vehicle-checks.cat-home.selector';
import { getTestData } from '@store/tests/test-data/cat-home/test-data.cat-h.reducer';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { EyesightTestReset } from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import { CatFUniqueTypes } from '@dvsa/mes-test-schema/categories/F';
import { CatGUniqueTypes } from '@dvsa/mes-test-schema/categories/G';
import { CatHUniqueTypes } from '@dvsa/mes-test-schema/categories/H';
import { CatKUniqueTypes } from '@dvsa/mes-test-schema/categories/K';

interface CatHomeWaitingRoomToCarPageState {
  candidateDeclarationSigned$: Observable<boolean>;
  insuranceDeclarationAccepted$: Observable<boolean>;
  residencyDeclarationAccepted$: Observable<boolean>;
  vehicleChecksScore$: Observable<VehicleChecksScore>;
  vehicleChecks$: Observable<HomeCatVehicleChecksUnion>;
}

type HomeCatVehicleChecksUnion =
  CatFUniqueTypes.VehicleChecks |
  CatGUniqueTypes.VehicleChecks |
  CatHUniqueTypes.VehicleChecks |
  CatKUniqueTypes.VehicleChecks;

type WaitingRoomToCarPageState = CommonWaitingRoomToCarPageState & CatHomeWaitingRoomToCarPageState;

@Component({
  selector: 'app-waiting-room-to-car-cat-home-test',
  templateUrl: './waiting-room-to-car.cat-home-test.page.html',
  styleUrls: ['./waiting-room-to-car.cat-home-test.page.scss'],
})
export class WaitingRoomToCarCatHomeTestPage extends WaitingRoomToCarBasePageComponent implements OnInit {

  form: FormGroup;
  pageState: WaitingRoomToCarPageState;

  constructor(
    private faultCountProvider: FaultCountProvider,
    routeByCat: RouteByCategoryProvider,
    store$: Store<StoreModel>,
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    alertController: AlertController,
  ) {
    super(platform, authenticationProvider, router, store$, routeByCat, alertController);
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
      vehicleChecks$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatHomeTest),
      ),
      vehicleChecksScore$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatHomeTest),
        withLatestFrom(currentTest$.pipe(select(getTestCategory))),
        map(([vehicleChecks, category]) =>
          this.faultCountProvider.getVehicleChecksFaultCount(category as TestCategory, vehicleChecks)),
      ),
    };
  }

  onSubmit = async (): Promise<void> => {
    Object.keys(this.form.controls).forEach((controlName: string) => this.form.controls[controlName].markAsDirty());

    if (this.form.valid) {
      await this.routeByCategoryProvider.navigateToPage(
        TestFlowPageNames.TEST_REPORT_PAGE,
        this.testCategory,
        { replaceUrl: true },
      );
      return;
    }

    Object.keys(this.form.controls).forEach((controlName: string) => {
      if (this.form.controls[controlName].invalid) {
        this.store$.dispatch(WaitingRoomToCarValidationError(`${controlName} is blank`));
      }
    });
  };

  eyesightFailCancelled = (): void => {
    this.form.get('eyesightCtrl')?.reset();
    this.store$.dispatch(EyesightTestReset());
  };

  shouldDisplayEyesightBanner = (): boolean => {
    return this.testCategory === TestCategory.K;
  };
}
