import { toSignal } from '@angular/core/rxjs-interop';
import { AlertController } from '@ionic/angular';
import { Observable, Subject, Subscription } from 'rxjs';

import { CategoryCode, GearboxCategory, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import { Inject, Signal, computed, effect, inject } from '@angular/core';
import { MotHistory } from '@dvsa/mes-mot-schema';
import { TEST_CENTRE_JOURNAL_PAGE, TestFlowPageNames } from '@pages/page-names.constants';
import { ModalEvent } from '@pages/waiting-room-to-car/components/mot-components/mot-failed-modal/mot-failed-modal.component';
import { MOTAbortedMethod } from '@pages/waiting-room-to-car/components/vehicle-registration/vehicle-registration';
import {
  InvalidMotModalOutcome,
  MotCallAborted,
  MotFailedModalOpened,
  MotSearchButtonPressed,
  MotServiceUnavailable,
  WaitingRoomToCarBikeCategoryChanged,
  WaitingRoomToCarBikeCategorySelected,
  WaitingRoomToCarViewDidEnter,
} from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { HttpStatusCodes } from '@shared/models/http-status-codes';
import { JournalDataUnion } from '@shared/unions/journal-union';
import { TestCentreJournalEnteredFromTest } from '@store/test-centre-journal/test-centre-journal.actions';
import {
  InstructorAccompanimentToggled,
  InterpreterAccompanimentToggled,
  OtherAccompanimentToggled,
  SupervisorAccompanimentToggled,
} from '@store/tests/accompaniment/accompaniment.actions';
import { getAccompaniment } from '@store/tests/accompaniment/accompaniment.reducer';
import {
  getInstructorAccompaniment,
  getInterpreterAccompaniment,
  getOtherAccompaniment,
  getSupervisorAccompaniment,
} from '@store/tests/accompaniment/accompaniment.selector';
import {
  InterpreterAccompanimentToggledCPC,
  SupervisorAccompanimentToggledCPC,
} from '@store/tests/accompaniment/cat-cpc/accompaniment.cat-cpc.actions';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import { selectTestCategory } from '@store/tests/category/category.reducer';
import { InstructorRegistrationNumberChanged } from '@store/tests/instructor-details/instructor-details.actions';
import { selectUntitledCandidateName } from '@store/tests/journal-data/common/candidate/candidate.selector';
import {
  CandidateDeclarationSigned,
  SetDeclarationStatus,
} from '@store/tests/pre-test-declarations/pre-test-declarations.actions';
import {
  hasEyesightTestBeenCompleted,
  hasEyesightTestGotSeriousFault,
} from '@store/tests/test-data/cat-b/test-data.cat-b.selector';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import {
  EyesightTestFailed,
  EyesightTestPassed,
} from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import { PersistTests } from '@store/tests/tests.actions';
import { selectCurrentTest } from '@store/tests/tests.selector';
import {
  OrditTrainedChanged,
  TrainerRegistrationNumberChanged,
  TrainingRecordsChanged,
} from '@store/tests/trainer-details/cat-adi-part2/trainer-details.cat-adi-part2.actions';
import { getVehicleDetails } from '@store/tests/vehicle-details/cat-b/vehicle-details.cat-b.reducer';
import { getDualControls, getSchoolCar } from '@store/tests/vehicle-details/cat-b/vehicle-details.cat-b.selector';
import {
  AutomaticConfirmationChanged,
  DualControlsToggled,
  GearboxCategoryChanged,
  MotEvidenceProvidedReset,
  MotEvidenceProvidedToggled,
  MotStatusChanged,
  ResetMOTDetails,
  SchoolBikeToggled,
  SchoolCarToggled,
  VRNListUpdated,
  VehicleExpiryDateChanged,
  VehicleMakeChanged,
  VehicleModelChanged,
  VehicleRegistrationChanged,
} from '@store/tests/vehicle-details/vehicle-details.actions';
import {
  getGearboxCategory,
  getMotEvidenceProvided,
  getRegistrationNumber,
  isAutomaticConfirmed,
} from '@store/tests/vehicle-details/vehicle-details.selector';

export const wrtcDestroy$ = new Subject<{}>();

export abstract class WaitingRoomToCarBasePageComponent extends PracticeableBasePageComponent {
  protected alertController = inject(AlertController);
  protected routeByCategoryProvider = inject(RouteByCategoryProvider);
  protected faultCountProvider = inject(FaultCountProvider);
  protected networkStateProvider = inject(NetworkStateProvider);

  subscription: Subscription;
  merged$: Observable<boolean | string | JournalDataUnion>;
  testCategory: TestCategory;
  trainerNumberProvided = false;
  failedMOTModalCurrentlyOpen = false;
  isSearchingForMOT = false;
  abortSubject: Subject<void> = new Subject<void>();

  private getCurrentVehicleDetails() {
    const currentTest = this.currentTest();
    return currentTest ? getVehicleDetails(currentTest as never) : null;
  }

  private getCurrentAccompaniment() {
    const currentTest = this.currentTest();
    return currentTest ? getAccompaniment(currentTest as never) : null;
  }

  private getCurrentTestData() {
    const currentTest = this.currentTest();
    return currentTest ? getTestData(currentTest as never) : null;
  }

  currentTest = this.store$.selectSignal(selectCurrentTest);
  candidateName: Signal<string> = this.store$.selectSignal(selectUntitledCandidateName);
  category: Signal<CategoryCode> = this.store$.selectSignal(selectTestCategory);
  showEyesight: Signal<boolean> = computed(() =>
    isAnyOf(this.category() as TestCategory, this.categoriesRequiringEyesightTest)
  );
  isOffline: Signal<boolean> = toSignal(this.networkStateProvider.isOffline$, { initialValue: false });

  registrationNumber: Signal<string> = computed(() => {
    const vehicleDetails = this.getCurrentVehicleDetails();
    return vehicleDetails ? getRegistrationNumber(vehicleDetails) : null;
  });
  transmission: Signal<GearboxCategory> = computed(() => {
    const vehicleDetails = this.getCurrentVehicleDetails();
    return vehicleDetails ? getGearboxCategory(vehicleDetails) : null;
  });
  isAutomaticConfirmed: Signal<boolean> = computed(() => {
    const vehicleDetails = this.getCurrentVehicleDetails();
    return vehicleDetails ? isAutomaticConfirmed(vehicleDetails) : false;
  });
  motEvidenceProvided: Signal<boolean> = computed(() => {
    const vehicleDetails = this.getCurrentVehicleDetails();
    return vehicleDetails ? getMotEvidenceProvided(vehicleDetails) : undefined;
  });
  schoolCar: Signal<boolean> = computed(() => {
    const vehicleDetails = this.getCurrentVehicleDetails();
    return vehicleDetails ? getSchoolCar(vehicleDetails as never) : false;
  });
  dualControls: Signal<boolean> = computed(() => {
    const vehicleDetails = this.getCurrentVehicleDetails();
    return vehicleDetails ? getDualControls(vehicleDetails as never) : false;
  });
  instructorAccompaniment: Signal<boolean> = computed(() => {
    const accompaniment = this.getCurrentAccompaniment();
    return accompaniment ? getInstructorAccompaniment(accompaniment) : false;
  });
  supervisorAccompaniment: Signal<boolean> = computed(() => {
    const accompaniment = this.getCurrentAccompaniment();
    return accompaniment ? getSupervisorAccompaniment(accompaniment) : false;
  });
  otherAccompaniment: Signal<boolean> = computed(() => {
    const accompaniment = this.getCurrentAccompaniment();
    return accompaniment ? getOtherAccompaniment(accompaniment) : false;
  });
  interpreterAccompaniment: Signal<boolean> = computed(() => {
    const accompaniment = this.getCurrentAccompaniment();
    return accompaniment ? getInterpreterAccompaniment(accompaniment) : false;
  });
  eyesightTestComplete: Signal<boolean> = computed(() => {
    const testData = this.getCurrentTestData();
    return hasEyesightTestBeenCompleted(testData as never) ?? false;
  });
  eyesightTestFailed: Signal<boolean> = computed(() => {
    const testData = this.getCurrentTestData();
    return hasEyesightTestGotSeriousFault(testData as never) ?? false;
  });

  private categoriesRequiringEyesightTest: TestCategory[] = [
    TestCategory.B,
    TestCategory.BE,
    TestCategory.ADI2,
    TestCategory.F,
    TestCategory.G,
    TestCategory.H,
    TestCategory.K,
    TestCategory.EUAMM2,
    TestCategory.EUA1M2,
    TestCategory.EUA2M2,
    TestCategory.EUAM2,
  ];

  protected constructor(@Inject(false) public loginRequired = false) {
    super(loginRequired);

    effect(() => {
      this.testCategory = this.category() as TestCategory;
    });
  }

  onInitialisation(): void {
    super.ngOnInit();
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
    this.abortMOTCall(MOTAbortedMethod.NAVIGATION);
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

  automaticConfirmationChanged(isConfirmed: boolean): void {
    this.store$.dispatch(AutomaticConfirmationChanged(isConfirmed));
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

  vehicleRegistrationChanged(vehicleRegistration: string, isAmended = false): void {
    this.store$.dispatch(VehicleRegistrationChanged(vehicleRegistration, isAmended));
  }

  getMOTEvidenceProvided(evidenceToggle: boolean): void {
    if (evidenceToggle !== undefined) {
      this.store$.dispatch(MotEvidenceProvidedToggled(evidenceToggle));
    } else {
      this.store$.dispatch(MotEvidenceProvidedReset());
    }
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
    this.store$.dispatch(TestCentreJournalEnteredFromTest());
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
    if (instructorRegistration) {
      if (!this.trainerNumberProvided) {
        this.store$.dispatch(TrainerRegistrationNumberChanged(instructorRegistration));
        this.trainerNumberProvided = true;
      }
    } else this.trainerNumberProvided = false;
  }

  updateVRNSearchList(vrn: string) {
    this.store$.dispatch(VRNListUpdated(vrn));
  }

  motDetailsChanged(motDetails: MotHistory) {
    if (motDetails) {
      this.store$.dispatch(VehicleMakeChanged(motDetails?.make));
      this.store$.dispatch(VehicleModelChanged(motDetails?.model));
      this.store$.dispatch(VehicleExpiryDateChanged(motDetails?.expiryDate));
      this.store$.dispatch(MotStatusChanged(motDetails?.status));
    } else {
      this.store$.dispatch(ResetMOTDetails());
    }
  }

  motFailedModalOpened(modalOpen: boolean): void {
    this.store$.dispatch(MotFailedModalOpened());
    this.blurScreenContent(modalOpen);
  }

  blurScreenContent(modalOpen: boolean): void {
    this.failedMOTModalCurrentlyOpen = modalOpen;
  }

  motSearchButtonPressed(): void {
    this.store$.dispatch(MotSearchButtonPressed());
  }

  motFailedModalOutcome(outcome: ModalEvent): void {
    this.store$.dispatch(InvalidMotModalOutcome(outcome));
  }

  async practiceModeTestCentreAlert() {
    const alert = await this.alertController.create({
      header: 'Unavailable',
      message: 'Test centre journal is currently unavailable in practice mode',
      buttons: ['Ok'],
    });

    await alert.present();
  }

  /**
   * Aborts the ongoing MOT call.
   *
   * This method dispatches the `MotCallAborted` action with the provided method
   * and emits a value from the `abortSubject` to signal the abortion of the ongoing HTTP request.
   *
   * @param {MOTAbortedMethod} method - The method used to abort the MOT call.
   */
  abortMOTCall(method: MOTAbortedMethod): void {
    if (this.isSearchingForMOT) {
      this.store$.dispatch(MotCallAborted(method));
      this.abortSubject.next();
    }
  }

  motSearchingStatusChanged(status: boolean): void {
    this.isSearchingForMOT = status;
  }

  motServiceUnavailable(statusCode: HttpStatusCodes): void {
    this.store$.dispatch(MotServiceUnavailable(statusCode));
    this.abortSubject.next();
  }

  noMotData(noMotData: boolean): void {
    if (noMotData) {
      this.store$.dispatch(MotStatusChanged('No details'));
    }
  }

  protected readonly MOTAbortedMethod = MOTAbortedMethod;
}
