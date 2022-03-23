import { Component, OnInit } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import {
  CommonWaitingRoomToCarPageState,
  WaitingRoomToCarBasePageComponent,
} from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { QuestionProvider } from '@providers/question/question';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getSchoolBike } from '@store/tests/vehicle-details/cat-a-mod1/vehicle-details.cat-a-mod1.selector';
import { getVehicleDetails } from '@store/tests/vehicle-details/vehicle-details.reducer';
import { isAutomatic, isManual } from '@store/tests/vehicle-details/vehicle-details.selector';
import { WaitingRoomToCarValidationError } from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';

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
  form: FormGroup;

  constructor(
    private questionProvider: QuestionProvider,
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    routeByCat: RouteByCategoryProvider,
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
    Object.keys(this.form.controls).forEach((controlName: string) => this.form.controls[controlName].markAsDirty());

    if (this.form.valid) {
      await this.routeByCategoryProvider.navigateToPage(TestFlowPageNames.TEST_REPORT_PAGE, this.testCategory);
      return;
    }

    Object.keys(this.form.controls).forEach((controlName: string) => {
      if (this.form.controls[controlName].invalid) {
        this.store$.dispatch(WaitingRoomToCarValidationError(`${controlName} is blank`));
      }
    });
  };

}
