import {
  Component, ElementRef, OnInit, ViewChild,
} from '@angular/core';
import {
  AlertController, NavController, NavParams, Platform,
} from '@ionic/angular';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { Observable } from 'rxjs';
import { GearboxCategory } from '@dvsa/mes-test-schema/categories/common';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import {
  DualControlsToggled,
  GearboxCategoryChanged,
  SchoolCarToggled,
  VehicleRegistrationChanged,
} from '@store/tests/vehicle-details/vehicle-details.actions';
import { map } from 'rxjs/operators';
import {
  InstructorAccompanimentToggled,
  InterpreterAccompanimentToggled,
  OtherAccompanimentToggled,
  SupervisorAccompanimentToggled,
} from '@store/tests/accompaniment/accompaniment.actions';
import { getVehicleDetails } from '@store/tests/vehicle-details/cat-adi-part2/vehicle-details.cat-adi-part2.reducer';
import { getAccompaniment } from '@store/tests/accompaniment/accompaniment.reducer';
import {
  getGearboxCategory,
  getRegistrationNumber,
  isAutomatic,
  isManual,
} from '@store/tests/vehicle-details/vehicle-details.selector';
import {
  getDualControls,
  getSchoolCar,
} from '@store/tests/vehicle-details/cat-adi-part2/vehicle-details.cat-adi-part2.selector';
import {
  getInstructorAccompaniment,
  getInterpreterAccompaniment,
  getOtherAccompaniment,
  getSupervisorAccompaniment,
} from '@store/tests/accompaniment/accompaniment.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { getUntitledCandidateName } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { getTests } from '@store/tests/tests.reducer';
import { FormGroup } from '@angular/forms';
import { QuestionProvider } from '@providers/question/question';
import {
  EyesightTestFailed,
  EyesightTestPassed,
} from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import {
  getVehicleChecksCatADIPart2,
  hasEyesightTestBeenCompleted,
  hasEyesightTestGotSeriousFault,
} from '@store/tests/test-data/cat-adi-part2/test-data.cat-adi-part2.selector';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { getTestData } from '@store/tests/test-data/cat-adi-part2/test-data.cat-adi-part2.reducer';
import { PersistTests } from '@store/tests/tests.actions';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import {
  OrditTrainedChanged,
  TrainerRegistrationNumberChanged,
  TrainingRecordsChanged,
} from '@store/tests/trainer-details/cat-adi-part2/trainer-details.cat-adi-part2.actions';
import { getTrainerDetails } from '@store/tests/trainer-details/cat-adi-part2/trainer-details.cat-adi-part2.reducer';
import {
  getOrditTrained,
  getTrainerRegistrationNumber,
  getTrainingRecords,
} from '@store/tests/trainer-details/cat-adi-part2/trainer-details.cat-adi-part2.selector';
import {
  WaitingRoomToCarBasePageComponent,
} from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { Router } from '@angular/router';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '../../page-names.constants';
import { WaitingRoomToCarValidationError } from '../waiting-room-to-car.actions';
import * as waitingRoomToCarActions from '../waiting-room-to-car.actions';

interface WaitingRoomToCarPageState {
  candidateName$: Observable<string>;
  registrationNumber$: Observable<string>;
  transmission$: Observable<GearboxCategory>;
  schoolCar$: Observable<boolean>;
  dualControls$: Observable<boolean>;
  instructorAccompaniment$: Observable<boolean>;
  supervisorAccompaniment$: Observable<boolean>;
  otherAccompaniment$: Observable<boolean>;
  interpreterAccompaniment$: Observable<boolean>;
  eyesightTestComplete$: Observable<boolean>;
  eyesightTestFailed$: Observable<boolean>;
  gearboxAutomaticRadioChecked$: Observable<boolean>;
  gearboxManualRadioChecked$: Observable<boolean>;
  vehicleChecksScore$: Observable<VehicleChecksScore>;
  vehicleChecks$: Observable<CatADI2UniqueTypes.VehicleChecks>;
  orditTrained$: Observable<boolean>;
  trainingRecords$: Observable<boolean>;
  trainerRegistrationNumber$: Observable<number>;
}

@Component({
  selector: '.waiting-room-to-car-cat-adi-part2-page',
  templateUrl: 'waiting-room-to-car.cat-adi-part2.page.html',
})
export class WaitingRoomToCarCatADIPart2Page extends WaitingRoomToCarBasePageComponent implements OnInit {
  pageState: WaitingRoomToCarPageState;
  form: FormGroup;

  @ViewChild('registrationInput')
  regisrationInput: ElementRef;

  @ViewChild('instructorRegistrationInput')
  instructorRegistrationInput: ElementRef;

  showEyesightFailureConfirmation: boolean = false;

  tellMeQuestions: VehicleChecksQuestion[];

  constructor(
    public store$: Store<StoreModel>,
    public navController: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    public faultCountProvider: FaultCountProvider,
    public questionProvider: QuestionProvider,
    router: Router,
    routeByCat: RouteByCategoryProvider,
    alertController: AlertController,
  ) {
    super(platform, authenticationProvider, router, store$, routeByCat, alertController);

    this.tellMeQuestions = questionProvider.getTellMeQuestions(TestCategory.ADI2);
    this.form = new FormGroup({});
  }

  ngOnInit(): void {

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.pageState = {
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
      eyesightTestComplete$: currentTest$.pipe(
        select(getTestData),
        select(hasEyesightTestBeenCompleted),
      ),
      eyesightTestFailed$: currentTest$.pipe(
        select(getTestData),
        select(hasEyesightTestGotSeriousFault),
      ),
      gearboxAutomaticRadioChecked$: currentTest$.pipe(
        select(getVehicleDetails),
        map(isAutomatic),
      ),
      gearboxManualRadioChecked$: currentTest$.pipe(
        select(getVehicleDetails),
        map(isManual),
      ),
      vehicleChecksScore$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatADIPart2),
        map((vehicleChecks) => {
          return this.faultCountProvider.getTellMeFaultCount(TestCategory.ADI2, vehicleChecks);
        }),
      ),
      vehicleChecks$: currentTest$.pipe(
        select(getTestData),
        select(getVehicleChecksCatADIPart2),
      ),
      orditTrained$: currentTest$.pipe(
        select(getTrainerDetails),
        select(getOrditTrained),
      ),
      trainingRecords$: currentTest$.pipe(
        select(getTrainerDetails),
        select(getTrainingRecords),
      ),
      trainerRegistrationNumber$: currentTest$.pipe(
        select(getTrainerDetails),
        select(getTrainerRegistrationNumber),
      ),
    };
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(waitingRoomToCarActions.WaitingRoomToCarViewDidEnter());
  }

  ionViewWillLeave(): void {
    this.store$.dispatch(PersistTests());
  }

  schoolCarToggled(): void {
    this.store$.dispatch(SchoolCarToggled());
  }

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

  closeVehicleChecksModal = () => {
    this.store$.dispatch(waitingRoomToCarActions.WaitingRoomToCarViewDidEnter());
  };

  onSubmit = async (): Promise<void> => {
    Object.keys(this.form.controls).forEach((controlName: string) => this.form.controls[controlName].markAsDirty());

    if (this.form.valid) {
      await this.routeByCategoryProvider.navigateToPage(TestFlowPageNames.TEST_REPORT_PAGE, TestCategory.ADI2);
    } else {
      Object.keys(this.form.controls).forEach((controlName: string) => {
        if (this.form.controls[controlName].invalid) {
          this.store$.dispatch(WaitingRoomToCarValidationError(`${controlName} is blank`));
        }
      });
    }
  };
  updateForm(ctrl: string, value: any) {
    this.form.patchValue({
      [ctrl]: value,
    });
  }

  isCtrlDirtyAndInvalid(controlName: string): boolean {
    return !this.form.value[controlName] && this.form.get(controlName).dirty;
  }

  setEyesightFailureVisibility(show: boolean) {
    this.showEyesightFailureConfirmation = show;
  }

  eyesightTestResultChanged(passed: boolean): void {
    const action = passed ? EyesightTestPassed() : EyesightTestFailed();
    this.store$.dispatch(action);
  }

  trainingRecordOutcomeChanged(hasRecords: boolean): void {
    this.store$.dispatch(TrainingRecordsChanged(hasRecords));
  }

  orditTrainedOutcomeChanged(wasOrditTrained: boolean): void {
    this.store$.dispatch(OrditTrainedChanged(wasOrditTrained));
  }

  trainerRegistrationNumberChanged(instructorRegistration: number): void {
    this.store$.dispatch(TrainerRegistrationNumberChanged(instructorRegistration));
  }

}
