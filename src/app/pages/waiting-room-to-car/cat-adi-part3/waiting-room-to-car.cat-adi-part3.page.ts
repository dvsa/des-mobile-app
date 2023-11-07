import { Component, Injector, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { select } from '@ngrx/store';
import { UntypedFormGroup } from '@angular/forms';

import {
  CommonWaitingRoomToCarPageState,
  WaitingRoomToCarBasePageComponent,
} from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { WaitingRoomToCarValidationError } from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { getTrainerDetails } from '@store/tests/trainer-details/cat-adi-part3/trainer-details.cat-adi-part3.reducer';
import {
  getOrditTrained,
  getTrainerRegistrationNumber,
} from '@store/tests/trainer-details/cat-adi-part2/trainer-details.cat-adi-part2.selector';
import { DualControlsToggledNo, DualControlsToggledYes } from '@store/tests/vehicle-details/vehicle-details.actions';
import {
  getPDILogbook,
  getTraineeLicence,
} from '@store/tests/trainer-details/cat-adi-part3/trainer-details.cat-adi-part3.selector';
import {
  PDILogbook,
  TraineeLicence,
} from '@store/tests/trainer-details/cat-adi-part3/trainer-details.cat-adi-part3.actions';
import { TrainerAccompanimentToggled } from '@store/tests/accompaniment/cat-adi3/accompaniment.cat-adi3.actions';
import { getAccompaniment } from '@store/tests/accompaniment/cat-adi3/accompaniment.cat-adi3.reducer';
import { getTrainerAccompaniment } from '@store/tests/accompaniment/cat-adi3/accompaniment.cat-adi3.selector';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

interface CatAdi3WaitingRoomToCarPageState {
  orditTrained$: Observable<boolean>;
  trainerRegistrationNumber$: Observable<number>;
  pdiLogbook$: Observable<boolean>;
  traineeLicence$: Observable<boolean>;
  trainerAccompaniment$: Observable<boolean>;
}

type WaitingRoomToCarPageState = CommonWaitingRoomToCarPageState & CatAdi3WaitingRoomToCarPageState;

@Component({
  selector: 'app-waiting-room-to-car-cat-adi-part3',
  templateUrl: './waiting-room-to-car.cat-adi-part3.page.html',
  styleUrls: ['./waiting-room-to-car.cat-adi-part3.page.scss'],
})
export class WaitingRoomToCarCatADIPart3Page extends WaitingRoomToCarBasePageComponent implements OnInit {
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
      orditTrained$: currentTest$.pipe(
        select(getTrainerDetails),
        select(getOrditTrained),
      ),
      trainerRegistrationNumber$: currentTest$.pipe(
        select(getTrainerDetails),
        select(getTrainerRegistrationNumber),
      ),
      pdiLogbook$: currentTest$.pipe(
        select(getTrainerDetails),
        select(getPDILogbook),
      ),
      traineeLicence$: currentTest$.pipe(
        select(getTrainerDetails),
        select(getTraineeLicence),
      ),
      trainerAccompaniment$: currentTest$.pipe(
        select(getAccompaniment),
        select(getTrainerAccompaniment),
      ),
    };
  }

  onSubmit = async (): Promise<void> => {
    Object.keys(this.form.controls)
      .forEach((controlName: string) => this.form.controls[controlName].markAsDirty());

    if (this.form.valid) {
      await this.routeByCategoryProvider.navigateToPage(TestFlowPageNames.TEST_REPORT_DASHBOARD_PAGE);
      return;
    }

    Object.keys(this.form.controls)
      .forEach((controlName: string) => {
        if (this.form.controls[controlName].invalid) {
          this.store$.dispatch(WaitingRoomToCarValidationError(`${controlName} is blank`));
        }
      });
  };

  dualControlsOutcomeToggled(dualControls: boolean): void {
    this.store$.dispatch(dualControls ? DualControlsToggledYes() : DualControlsToggledNo());
  }

  pdiLogbookChanged(pdiLogbook: boolean): void {
    this.store$.dispatch(PDILogbook(pdiLogbook));
  }

  traineeLicenceChanged(pdiLogbook: boolean): void {
    this.store$.dispatch(TraineeLicence(pdiLogbook));
  }

  trainerAccompanimentChanged(): void {
    this.store$.dispatch(TrainerAccompanimentToggled());
  }

  notSC(category: CategoryCode): boolean {
    return category !== TestCategory.SC;
  }

}
