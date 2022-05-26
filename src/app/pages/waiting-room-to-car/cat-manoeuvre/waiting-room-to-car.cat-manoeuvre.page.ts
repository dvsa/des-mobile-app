import { Component, OnInit } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';

import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';
import {
  CommonWaitingRoomToCarPageState,
  WaitingRoomToCarBasePageComponent,
} from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { StoreModel } from '@shared/models/store.model';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { WaitingRoomToCarValidationError } from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getDelegatedTestIndicator } from '@store/tests/delegated-test/delegated-test.reducer';
import { isDelegatedTest } from '@store/tests/delegated-test/delegated-test.selector';
import { VehicleDetailsByCategoryProvider } from '@providers/vehicle-details-by-category/vehicle-details-by-category';
import { getVehicleDetails } from '@store/tests/vehicle-details/cat-manoeuvres/vehicle-details.cat-manoeuvre.reducer';
import {
  getNumberOfSeats,
  getVehicleHeight,
  getVehicleLength,
  getVehicleWidth,
} from '@store/tests/vehicle-details/cat-manoeuvres/vehicle-details.cat-manoeuvre.selector';

interface CatManoeuvreWaitingRoomToCarPageState {
  delegatedTest$: Observable<boolean>;
  vehicleLength$: Observable<number>;
  vehicleWidth$: Observable<number>;
  vehicleHeight$: Observable<number>;
  numberOfSeats$: Observable<number>;
}

type WaitingRoomToCarPageState = CommonWaitingRoomToCarPageState & CatManoeuvreWaitingRoomToCarPageState;

@Component({
  selector: 'app-waiting-room-to-car-cat-manoeuvre',
  templateUrl: './waiting-room-to-car.cat-manoeuvre.page.html',
  styleUrls: ['./waiting-room-to-car.cat-manoeuvre.page.scss'],
})
export class WaitingRoomToCarCatManoeuvrePage extends WaitingRoomToCarBasePageComponent implements OnInit {
  form: FormGroup;
  pageState: WaitingRoomToCarPageState;
  fullLicenceHeld: boolean = null;
  isDelegated: boolean = false;

  constructor(
    private faultCountProvider: FaultCountProvider,
    private vehicleDetailsProvider: VehicleDetailsByCategoryProvider,
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
      delegatedTest$: currentTest$.pipe(
        select(getDelegatedTestIndicator),
        select(isDelegatedTest),
      ),
      vehicleLength$: currentTest$.pipe(
        select(getVehicleDetails),
        select(getVehicleLength),
      ),
      vehicleWidth$: currentTest$.pipe(
        select(getVehicleDetails),
        select(getVehicleWidth),
      ),
      vehicleHeight$: currentTest$.pipe(
        select(getVehicleDetails),
        select(getVehicleHeight),
      ),
      numberOfSeats$: currentTest$.pipe(
        select(getVehicleDetails),
        select(getNumberOfSeats),
      ),
    };
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
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

}
