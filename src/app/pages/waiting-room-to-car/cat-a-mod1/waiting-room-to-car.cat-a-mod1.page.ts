import { Component, Injector, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { select } from '@ngrx/store';
import { UntypedFormGroup } from '@angular/forms';

import {
  CommonWaitingRoomToCarPageState,
  WaitingRoomToCarBasePageComponent,
} from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getSchoolBike } from '@store/tests/vehicle-details/cat-a-mod1/vehicle-details.cat-a-mod1.selector';
import { getVehicleDetails } from '@store/tests/vehicle-details/vehicle-details.reducer';
import { isAutomatic, isManual } from '@store/tests/vehicle-details/vehicle-details.selector';
import { WaitingRoomToCarValidationError } from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { ClearCandidateLicenceData } from '@pages/candidate-licence/candidate-licence.actions';

interface CatMod1WaitingRoomToCarPageState {
  schoolBike$: Observable<boolean>;
  gearboxAutomaticRadioChecked$: Observable<boolean>;
  gearboxManualRadioChecked$: Observable<boolean>;
}

type WaitingRoomToCarPageState = CommonWaitingRoomToCarPageState & CatMod1WaitingRoomToCarPageState;

@Component({
  selector: 'app-waiting-room-to-car-cat-a-mod1',
  templateUrl: './waiting-room-to-car.cat-a-mod1.page.html',
  styleUrls: ['./waiting-room-to-car.cat-a-mod1.page.scss'],
})
export class WaitingRoomToCarCatAMod1Page extends WaitingRoomToCarBasePageComponent implements OnInit {
  pageState: WaitingRoomToCarPageState;
  form: UntypedFormGroup;

  constructor(injector: Injector) {
    super(injector);
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
      schoolBike$: currentTest$.pipe(
        select(getVehicleDetails),
        select(getSchoolBike),
      ),
      gearboxAutomaticRadioChecked$: currentTest$.pipe(
        select(getVehicleDetails),
        map(isAutomatic),
      ),
      gearboxManualRadioChecked$: currentTest$.pipe(
        select(getVehicleDetails),
        map(isManual),
      ),
    };
  }

  onSubmit = async (): Promise<void> => {
    Object.keys(this.form.controls)
      .forEach((controlName: string) => this.form.controls[controlName].markAsDirty());

    if (this.form.valid) {
      this.store$.dispatch(ClearCandidateLicenceData());

      await this.routeByCategoryProvider.navigateToPage(
        TestFlowPageNames.TEST_REPORT_PAGE,
        this.testCategory,
        { replaceUrl: true },
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

}
