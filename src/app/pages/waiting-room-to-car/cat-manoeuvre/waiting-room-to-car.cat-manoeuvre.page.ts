import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ClearCandidateLicenceData } from '@pages/candidate-licence/candidate-licence.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { WaitingRoomToCarValidationError } from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import {
  CommonWaitingRoomToCarPageState,
  WaitingRoomToCarBasePageComponent,
} from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { getDelegatedTestIndicator } from '@store/tests/delegated-test/delegated-test.reducer';
import { isDelegatedTest } from '@store/tests/delegated-test/delegated-test.selector';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getVehicleDetails } from '@store/tests/vehicle-details/cat-manoeuvres/vehicle-details.cat-manoeuvre.reducer';
import {
  getNumberOfSeats,
  getVehicleHeight,
  getVehicleLength,
  getVehicleWidth,
} from '@store/tests/vehicle-details/cat-manoeuvres/vehicle-details.cat-manoeuvre.selector';
import { MotEvidenceProvidedReset } from '@store/tests/vehicle-details/vehicle-details.actions';

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
  form: UntypedFormGroup;
  pageState: WaitingRoomToCarPageState;
  fullLicenceHeld: boolean = null;

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
      vehicleLength$: currentTest$.pipe(select(getVehicleDetails), select(getVehicleLength)),
      vehicleWidth$: currentTest$.pipe(select(getVehicleDetails), select(getVehicleWidth)),
      vehicleHeight$: currentTest$.pipe(select(getVehicleDetails), select(getVehicleHeight)),
      numberOfSeats$: currentTest$.pipe(select(getVehicleDetails), select(getNumberOfSeats)),
    };
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
        replaceUrl: false,
      });
      return;
    }

    Object.keys(this.form.controls).forEach((controlName: string) => {
      if (this.form.controls[controlName].invalid) {
        this.store$.dispatch(WaitingRoomToCarValidationError(`${controlName} is blank`));
      }
    });
  };
}
