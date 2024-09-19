import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ClearCandidateLicenceData } from '@pages/candidate-licence/candidate-licence.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { WaitingRoomToCarValidationError } from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import {
  CommonWaitingRoomToCarPageState,
  WaitingRoomToCarBasePageComponent,
} from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import { getTestData } from '@store/tests/test-data/cat-adi-part2/test-data.cat-adi-part2.reducer';
import { getVehicleChecksCatADIPart2 } from '@store/tests/test-data/cat-adi-part2/test-data.cat-adi-part2.selector';
import { EyesightTestReset } from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getTrainerDetails } from '@store/tests/trainer-details/cat-adi-part2/trainer-details.cat-adi-part2.reducer';
import {
  getOrditTrained,
  getTrainerRegistrationNumber,
  getTrainingRecords,
} from '@store/tests/trainer-details/cat-adi-part2/trainer-details.cat-adi-part2.selector';
import {
  MotEvidenceProvidedReset,
  MotEvidenceProvidedToggled,
} from '@store/tests/vehicle-details/vehicle-details.actions';

interface CatAdi2WaitingRoomToCarPageState {
  orditTrained$: Observable<boolean>;
  trainingRecords$: Observable<boolean>;
  trainerRegistrationNumber$: Observable<number>;
  vehicleChecks$: Observable<CatADI2UniqueTypes.VehicleChecks>;
  vehicleChecksScore$: Observable<VehicleChecksScore>;
}

type WaitingRoomToCarPageState = CommonWaitingRoomToCarPageState & CatAdi2WaitingRoomToCarPageState;

@Component({
  selector: 'app-waiting-room-to-car-cat-adi-part2',
  templateUrl: './waiting-room-to-car.cat-adi-part2.page.html',
  styleUrls: ['./waiting-room-to-car.cat-adi-part2.page.scss'],
})
export class WaitingRoomToCarCatADIPart2Page extends WaitingRoomToCarBasePageComponent implements OnInit {
  pageState: WaitingRoomToCarPageState;
  form: UntypedFormGroup;
  submitClicked: boolean;

  constructor(injector: Injector) {
    super(injector);
    this.form = new UntypedFormGroup({});
  }

  ngOnInit(): void {
    super.onInitialisation();

    const currentTest$ = this.store$.pipe(select(getTests), select(getCurrentTest));

    this.pageState = {
      ...this.commonPageState,
      orditTrained$: currentTest$.pipe(select(getTrainerDetails), select(getOrditTrained)),
      trainingRecords$: currentTest$.pipe(select(getTrainerDetails), select(getTrainingRecords)),
      trainerRegistrationNumber$: currentTest$.pipe(select(getTrainerDetails), select(getTrainerRegistrationNumber)),
      vehicleChecks$: currentTest$.pipe(select(getTestData), select(getVehicleChecksCatADIPart2)),
      vehicleChecksScore$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatADIPart2),
        map((vehicleChecks) => this.faultCountProvider.getTellMeFaultCount(TestCategory.ADI2, vehicleChecks))
      ),
    };
  }

  motNoEvidenceCancelled = (): void => {
    this.form.get('alternateEvidenceCtrl')?.reset();
    this.store$.dispatch(MotEvidenceProvidedToggled(undefined));
    this.store$.dispatch(MotEvidenceProvidedReset());
  };

  onSubmit = async (): Promise<void> => {
    Object.keys(this.form.controls).forEach((controlName: string) => this.form.controls[controlName].markAsDirty());

    if (this.form.valid) {
      this.store$.dispatch(ClearCandidateLicenceData());

      await this.routeByCategoryProvider.navigateToPage(TestFlowPageNames.TEST_REPORT_PAGE, this.testCategory, {
        replaceUrl: true,
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

  eyesightFailCancelled = (): void => {
    this.form.get('eyesightCtrl')?.reset();
    this.store$.dispatch(EyesightTestReset());
  };
}
