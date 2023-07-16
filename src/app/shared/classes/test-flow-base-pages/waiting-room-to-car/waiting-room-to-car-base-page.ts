import { select, Store } from '@ngrx/store';
import {
  BehaviorSubject, Observable, Subject, Subscription,
} from 'rxjs';
import { AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { map, withLatestFrom } from 'rxjs/operators';

import { CategoryCode, GearboxCategory, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import { StoreModel } from '@shared/models/store.model';
import { JournalDataUnion } from '@shared/unions/journal-union';
import { getUntitledCandidateName } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { getTests } from '@store/tests/tests.reducer';
import { PersistTests } from '@store/tests/tests.actions';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { getVehicleDetails } from '@store/tests/vehicle-details/cat-b/vehicle-details.cat-b.reducer';
import {
  getAlternativeMotEvidenceDetails,
  getAlternativeMotEvidenceProvided,
  getGearboxCategory,
  getMake,
  getModel,
  getMotStatus,
  getRegistrationNumber,
  getTestExpiryDate,
} from '@store/tests/vehicle-details/vehicle-details.selector';
import { TEST_CENTRE_JOURNAL_PAGE, TestFlowPageNames } from '@pages/page-names.constants';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import {
  GetMotStatus,
  WaitingRoomToCarBikeCategoryChanged,
  WaitingRoomToCarBikeCategorySelected,
  WaitingRoomToCarViewDidEnter,
} from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import { getTestCategory } from '@store/tests/category/category.reducer';
import {
  AlternativeMotEvidenceDetailsChanged,
  AlternativeMotEvidenceProvidedChanged,
  DualControlsToggled,
  GearboxCategoryChanged,
  SchoolBikeToggled,
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
import {
  EyesightTestFailed,
  EyesightTestPassed,
} from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import {
  CandidateDeclarationSigned,
  SetDeclarationStatus,
} from '@store/tests/pre-test-declarations/pre-test-declarations.actions';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import {
  OrditTrainedChanged,
  TrainerRegistrationNumberChanged,
  TrainingRecordsChanged,
} from '@store/tests/trainer-details/cat-adi-part2/trainer-details.cat-adi-part2.actions';
import {
  InterpreterAccompanimentToggledCPC,
  SupervisorAccompanimentToggledCPC,
} from '@store/tests/accompaniment/cat-cpc/accompaniment.cat-cpc.actions';
import { Inject } from '@angular/core';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import { isRekey } from '@store/tests/rekey/rekey.selector';
import { getRekeyIndicator } from '@store/tests/rekey/rekey.reducer';
import { motError$, MotErrorDisplay, MotStatus } from '@providers/mot-details/mot-details';

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
  showCheckMot$: Observable<boolean>;
  isCheckingMot$: Observable<boolean>;
  motError$: Observable<MotErrorDisplay>;
  checkInvalidMotCount$: Observable<number>;
  motStatus$: Observable<string>;
  testExpiryDate$: Observable<string>;
  make$: Observable<string>;
  model$: Observable<string>;
  showAlternativeMotEvidenceProvided$: Observable<boolean>;
  alternativeMotEvidenceProvided$: Observable<boolean>;
  alternativeMotEvidenceDetails$: Observable<string>;
}

export const wrtcDestroy$ = new Subject<{}>();
export const isCheckingMot$ = new BehaviorSubject(false);
export const checkInvalidMotCount$ = new BehaviorSubject(0);

export abstract class WaitingRoomToCarBasePageComponent extends PracticeableBasePageComponent {

  commonPageState: CommonWaitingRoomToCarPageState;
  subscription: Subscription;
  merged$: Observable<boolean | string | JournalDataUnion>;
  testCategory: TestCategory;
  hasRequestedMOT: boolean = false;

  private categoriesRequiringEyesightTest: TestCategory[] = [
    TestCategory.B,
    TestCategory.BE,
    TestCategory.ADI2,
    TestCategory.F, TestCategory.G, TestCategory.H, TestCategory.K,
    TestCategory.EUAMM2, TestCategory.EUA1M2, TestCategory.EUA2M2, TestCategory.EUAM2,
  ];

  protected constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    protected routeByCategoryProvider: RouteByCategoryProvider,
    public alertController: AlertController,
    @Inject(false) public loginRequired: boolean = false,
    private appConfig: AppConfigProvider,
  ) {
    super(platform, authenticationProvider, router, store$, loginRequired);
  }

  onInitialisation(): void {
    super.ngOnInit();
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
      motStatus$: currentTest$.pipe(
        select(getVehicleDetails),
        select(getMotStatus),
      ),
      make$: currentTest$.pipe(
        select(getVehicleDetails),
        select(getMake),
      ),
      model$: currentTest$.pipe(
        select(getVehicleDetails),
        select(getModel),
      ),
      testExpiryDate$: currentTest$.pipe(
        select(getVehicleDetails),
        select(getTestExpiryDate),
      ),
      showAlternativeMotEvidenceProvided$: currentTest$.pipe(
        select(getVehicleDetails),
        select(getMotStatus),
        map((status) => status === MotStatus.NOT_VALID),
      ),
      alternativeMotEvidenceProvided$: currentTest$.pipe(
        select(getVehicleDetails),
        select(getAlternativeMotEvidenceProvided),
      ),
      alternativeMotEvidenceDetails$: currentTest$.pipe(
        select(getVehicleDetails),
        select(getAlternativeMotEvidenceDetails),
      ),
      isCheckingMot$,
      motError$,
      checkInvalidMotCount$,
      showCheckMot$: currentTest$.pipe(
        select(getRekeyIndicator),
        select(isRekey),
        withLatestFrom(this.appConfig.getAppConfig()?.role),
        map(([rekeyTest, role]) => !(rekeyTest || role === ExaminerRole.DLG)),
      ),
    };
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(WaitingRoomToCarViewDidEnter());
  }

  ionViewWillLeave(): void {
    this.store$.dispatch(PersistTests());
  }

  getDebriefPage = (): string => {
    return TestFlowPageNames.DEBRIEF_PAGE;
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

  supervisorAccompanimentToggledCPC(): void {
    this.store$.dispatch(SupervisorAccompanimentToggledCPC());
  }

  interpreterAccompanimentToggledCPC(): void {
    this.store$.dispatch(InterpreterAccompanimentToggledCPC());
  }

  otherAccompanimentToggled(): void {
    this.store$.dispatch(OtherAccompanimentToggled());
  }

  vehicleRegistrationChanged(vehicleRegistration: string): void {
    this.store$.dispatch(VehicleRegistrationChanged(vehicleRegistration));
  }

  alternativeMotEvidenceChanged(alternativeEvidence: boolean) {
    this.store$.dispatch(AlternativeMotEvidenceProvidedChanged(alternativeEvidence));
  }

  alternativeMotEvidenceDetailsChanged(details: string) {
    this.store$.dispatch(AlternativeMotEvidenceDetailsChanged(details));
  }

  getMOTStatus(): void {
    this.hasRequestedMOT = true;
    this.store$.dispatch(GetMotStatus());
  }

  schoolCarToggled(): void {
    this.store$.dispatch(SchoolCarToggled());
  }

  instructorRegistrationChanged(instructorRegistration: number): void {
    this.store$.dispatch(InstructorRegistrationNumberChanged(instructorRegistration));
  }

  eyesightTestResultChanged(passed: boolean): void {
    this.store$.dispatch(passed ? EyesightTestPassed() : EyesightTestFailed());
  }

  schoolBikeToggled(): void {
    this.store$.dispatch(SchoolBikeToggled());
  }

  categoryCodeChanged(category: CategoryCode): void {
    this.store$.dispatch(WaitingRoomToCarBikeCategorySelected(category));

    if (this.testCategory !== category) {
      this.store$.dispatch(WaitingRoomToCarBikeCategoryChanged(category, this.testCategory));
    }
    this.store$.dispatch(PopulateTestCategory(category));
  }

  async onViewTestCentreJournal(): Promise<void> {
    if (this.isEndToEndPracticeMode) {
      await this.practiceModeTestCentreAlert();
      return;
    }
    await this.router.navigate([TEST_CENTRE_JOURNAL_PAGE]);
  }

  candidateDeclarationOutcomeChanged(declaration: boolean): void {
    this.store$.dispatch(SetDeclarationStatus(declaration));
    this.store$.dispatch(CandidateDeclarationSigned());
  }

  generateDelegatedQuestionResults(number: number, outcome: CompetencyOutcome): QuestionResult[] {
    return Array(number)
      .fill(null)
      .map(() => ({
        outcome,
        code: 'DEL',
      }));
  }

  closeVehicleChecksModal(): void {
    this.store$.dispatch(WaitingRoomToCarViewDidEnter());
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

  async practiceModeTestCentreAlert() {
    const alert = await this.alertController.create({
      header: 'Unavailable',
      message: 'Test centre journal is currently unavailable in practice mode',
      buttons: ['Ok'],
    });

    await alert.present();
  }
}
