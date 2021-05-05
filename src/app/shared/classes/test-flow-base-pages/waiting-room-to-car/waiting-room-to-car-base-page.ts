import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import { CategoryCode, GearboxCategory } from '@dvsa/mes-test-schema/categories/common';

import { StoreModel } from '@shared/models/store.model';
import { JournalDataUnion } from '@shared/unions/journal-union';
import { getUntitledCandidateName } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { getTests } from '@store/tests/tests.reducer';
import { PersistTests } from '@store/tests/tests.actions';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { AuthenticationProvider } from '@providers/authentication/authentication';

import { getVehicleDetails } from '@store/tests/vehicle-details/cat-b/vehicle-details.cat-b.reducer';
import { getGearboxCategory, getRegistrationNumber } from '@store/tests/vehicle-details/vehicle-details.selector';

import { TestFlowPageNames } from '@pages/page-names.constants';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { FormGroup } from '@angular/forms';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  WaitingRoomToCarValidationError,
  WaitingRoomToCarViewDidEnter,
} from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import { map } from 'rxjs/operators';
import { getTestCategory } from '@store/tests/category/category.reducer';
import {
  DualControlsToggled,
  GearboxCategoryChanged,
  SchoolCarToggled,
  VehicleRegistrationChanged,
} from '@store/tests/vehicle-details/vehicle-details.actions';
import {
  InstructorAccompanimentToggled,
  InterpreterAccompanimentToggled,
  OtherAccompanimentToggled,
  SupervisorAccompanimentToggled,
} from '@store/tests/accompaniment/accompaniment.actions';
import { InstructorRegistrationNumberChanged } from '@store/tests/instructor-details/instructor-details.actions';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import {
  hasEyesightTestBeenCompleted,
  hasEyesightTestGotSeriousFault,
} from '@store/tests/test-data/cat-b/test-data.cat-b.selector';
import { getDualControls, getSchoolCar } from '@store/tests/vehicle-details/cat-b/vehicle-details.cat-b.selector';
import { getAccompaniment } from '@store/tests/accompaniment/accompaniment.reducer';
import {
  getInstructorAccompaniment,
  getInterpreterAccompaniment,
  getOtherAccompaniment,
  getSupervisorAccompaniment,
} from '@store/tests/accompaniment/accompaniment.selector';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { BasePageComponent } from '../../base-page';

export interface CommonWaitingRoomToCarPageState {
  candidateName$: Observable<string>;
  registrationNumber$: Observable<string>;
  transmission$: Observable<GearboxCategory>;
  category$: Observable<CategoryCode>;

  showEyesight$: Observable<boolean>;
  eyesightTestComplete$: Observable<boolean>;
  eyesightTestFailed$: Observable<boolean>;

  schoolCar$: Observable<boolean>;
  dualControls$: Observable<boolean>;

  instructorAccompaniment$: Observable<boolean>;
  supervisorAccompaniment$: Observable<boolean>;
  otherAccompaniment$: Observable<boolean>;
  interpreterAccompaniment$: Observable<boolean>;
}

export abstract class WaitingRoomToCarBasePageComponent extends BasePageComponent {

  commonPageState: CommonWaitingRoomToCarPageState;
  subscription: Subscription;
  merged$: Observable<boolean | string | JournalDataUnion>;
  testCategory: TestCategory;

  private categoriesRequiringEyesightTest: TestCategory[] = [
    TestCategory.B,
    TestCategory.BE,
    TestCategory.ADI2,
    TestCategory.F, TestCategory.G, TestCategory.H, TestCategory.K,
    TestCategory.EUAMM2, TestCategory.EUA1M2, TestCategory.EUA2M2, TestCategory.EUAM2,
  ];

  protected constructor(
    protected store$: Store<StoreModel>,
    protected platform: Platform,
    protected authenticationProvider: AuthenticationProvider,
    protected router: Router,
    protected routeByCategoryProvider: RouteByCategoryProvider,
  ) {
    super(platform, authenticationProvider, router);
  }

  onInitialisation(): void {
    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.commonPageState = {
      candidateName$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getUntitledCandidateName),
      ),
      registrationNumber$: currentTest$.pipe(
        select(getVehicleDetails),
        select(getRegistrationNumber),
      ),
      transmission$: currentTest$.pipe(
        select(getVehicleDetails),
        select(getGearboxCategory),
      ),
      category$: currentTest$.pipe(
        select(getTestCategory),
        map((result) => this.testCategory = result as TestCategory),
      ),
      showEyesight$: currentTest$.pipe(
        select(getTestCategory),
        map((category) => isAnyOf(category as TestCategory, this.categoriesRequiringEyesightTest)),
      ),
      eyesightTestComplete$: currentTest$.pipe(
        select(getTestData),
        select(hasEyesightTestBeenCompleted),
      ),
      eyesightTestFailed$: currentTest$.pipe(
        select(getTestData),
        select(hasEyesightTestGotSeriousFault),
      ),
      schoolCar$: currentTest$.pipe(
        select(getVehicleDetails),
        select(getSchoolCar),
      ),
      dualControls$: currentTest$.pipe(
        select(getVehicleDetails),
        select(getDualControls),
      ),
      instructorAccompaniment$: currentTest$.pipe(
        select(getAccompaniment),
        select(getInstructorAccompaniment),
      ),
      supervisorAccompaniment$: currentTest$.pipe(
        select(getAccompaniment),
        select(getSupervisorAccompaniment),
      ),
      otherAccompaniment$: currentTest$.pipe(
        select(getAccompaniment),
        select(getOtherAccompaniment),
      ),
      interpreterAccompaniment$: currentTest$.pipe(
        select(getAccompaniment),
        select(getInterpreterAccompaniment),
      ),
    };
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(WaitingRoomToCarViewDidEnter());
  }

  ionViewWillLeave(): void {
    this.store$.dispatch(PersistTests());
  }

  getDebriefPage = (): string => {
    return this.routeByCategoryProvider.getNextPage(TestFlowPageNames.DEBRIEF_PAGE, this.testCategory);
  };

  dualControlsToggled(): void {
    this.store$.dispatch(DualControlsToggled());
  }

  transmissionChanged(transmission: GearboxCategory): void {
    this.store$.dispatch(GearboxCategoryChanged(transmission));
  }

  instructorAccompanimentToggled(): void {
    this.store$.dispatch(InstructorAccompanimentToggled());
  }

  supervisorAccompanimentToggled(): void {
    this.store$.dispatch(SupervisorAccompanimentToggled());
  }

  interpreterAccompanimentToggled(): void {
    this.store$.dispatch(InterpreterAccompanimentToggled());
  }

  otherAccompanimentToggled(): void {
    this.store$.dispatch(OtherAccompanimentToggled());
  }

  vehicleRegistrationChanged(vehicleRegistration: string) {
    this.store$.dispatch(VehicleRegistrationChanged(vehicleRegistration));
  }

  schoolCarToggled(): void {
    this.store$.dispatch(SchoolCarToggled());
  }

  instructorRegistrationChanged(instructorRegistration: number): void {
    this.store$.dispatch(InstructorRegistrationNumberChanged(instructorRegistration));
  }

  onSubmitLogic = async (form: FormGroup) => {
    Object.keys(form.controls)
      .forEach((controlName: string) => form.controls[controlName].markAsDirty());

    if (form.valid) {
      await this.routeByCategoryProvider.navigateToPage(TestFlowPageNames.TEST_REPORT_PAGE, this.testCategory);
      // this.navController.push(CAT_B.TEST_REPORT_PAGE).then(() => {
      //   // remove Waiting Room To Car Page
      //   const view = this.navController.getViews().find(view => view.id === CAT_B.WAITING_ROOM_TO_CAR_PAGE);
      //   if (view) {
      //     this.navController.removeView(view);
      //   }
      // });
    } else {
      Object.keys(form.controls)
        .forEach((controlName: string) => {
          if (form.controls[controlName].invalid) {
            this.store$.dispatch(WaitingRoomToCarValidationError(`${controlName} is blank`));
          }
        });
    }
  };

}
