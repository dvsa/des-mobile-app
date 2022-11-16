import {
  waitForAsync,
  TestBed, fakeAsync, tick,
} from '@angular/core/testing';
import {
  ModalController,
  NavController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { Store } from '@ngrx/store';
import { ModalControllerMock, RouterMock, PlatformMock } from '@mocks/index.mock';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';

import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { StoreModel } from '@shared/models/store.model';
import { TestsModel } from '@store/tests/tests.model';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { ActivityCodeModel, activityCodeModelList } from '@shared/constants/activity-code/activity-code.constants';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { WeatherConditionProvider } from '@providers/weather-conditions/weather-condition';
import { NavControllerMock } from '@shared/mocks/nav-controller.mock';
import { ToastControllerMock } from '@shared/mocks/toast-controller.mock';
import { OutcomeBehaviourMapProviderMock } from '@providers/outcome-behaviour-map/__mocks__/outcome-behaviour-map.mock';
import {
  Identification, IndependentDriving, WeatherConditions,
} from '@dvsa/mes-test-schema/categories/common';
import {
  AdditionalInformationChanged,
  CandidateDescriptionChanged, D255No, D255Yes, DebriefUnWitnessed, DebriefWitnessed,
  IdentificationUsedChanged,
  IndependentDrivingTypeChanged,
  RouteNumberChanged, TrueLikenessToPhotoChanged,
  WeatherConditionsChanged,
} from '@store/tests/test-summary/test-summary.actions';
import { SetActivityCode } from '@store/tests/activity-code/activity-code.actions';
import {
  CompleteTest, OfficeValidationError, OfficeViewDidEnter, SavingWriteUpForLater, TestStartDateChanged,
} from '@pages/office/office.actions';
import { PersistTests, SendCurrentTest } from '@store/tests/tests.actions';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { FinishTestModal } from '@pages/office/components/finish-test-modal/finish-test-modal';
import {
  ProvisionalLicenseNotReceived,
  ProvisionalLicenseReceived,
} from '@store/tests/pass-completion/pass-completion.actions';
import {
  DualControlsToggled, GearboxCategoryChanged, SchoolBikeToggled, SchoolCarToggled,
} from '@store/tests/vehicle-details/vehicle-details.actions';
import { HealthDeclarationAccepted } from '@store/tests/post-test-declarations/post-test-declarations.actions';
import {
  CandidateChoseToProceedWithTestInEnglish,
  CandidateChoseToProceedWithTestInWelsh,
} from '@store/tests/communication-preferences/communication-preferences.actions';
import {
  InstructorAccompanimentToggled,
  InterpreterAccompanimentToggled, OtherAccompanimentToggled,
  SupervisorAccompanimentToggled,
} from '@store/tests/accompaniment/accompaniment.actions';
import { CircuitTypeChanged } from '@store/tests/test-summary/cat-a-mod1/test-summary.cat-a-mod1.actions';
import { DELEGATED_REKEY_UPLOAD_OUTCOME_PAGE, TestFlowPageNames } from '@pages/page-names.constants';
import { take } from 'rxjs/operators';
import {
  AbstractControl, UntypedFormControl, UntypedFormGroup, Validators,
} from '@angular/forms';
import { of, Subscription } from 'rxjs';
import { SetStartDate } from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.actions';
import {
  SupervisorAccompanimentToggledCPC,
} from '@store/tests/accompaniment/cat-cpc/accompaniment.cat-cpc.actions';
import { wrtcDestroy$ } from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { trDestroy$ } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { SetRekeyDate } from '@store/tests/rekey-date/rekey-date.actions';
import { OfficeBasePageComponent } from '../office-base-page';

describe('OfficeBasePageComponent', () => {
  let platform: Platform;
  let authenticationProvider: AuthenticationProvider;
  let router: Router;
  let store$: Store<StoreModel>;
  let navController: NavController;
  let toastController: ToastController;
  let modalController: ModalController;
  let outcomeBehaviourProvider: OutcomeBehaviourMapProvider;
  let weatherConditionProvider: WeatherConditionProvider;
  let faultSummaryProvider: FaultSummaryProvider;
  let faultCountProvider: FaultCountProvider;

  let basePageComponent: OfficeBasePageComponent;
  const initialState = {
    tests: {
      currentTest: { slotId: '1234' },
      startedTests: {
        1234: {
          testData: {
            eco: {
              completed: true,
              adviceGivenControl: true,
              adviceGivenPlanning: true,
              ecoRelatedFault: 'description',
              ecoCaptureReason: 'reason',
              fuelEfficientDriving: true,
            },
            ETA: {
              physical: false,
              verbal: false,
            },
          },
          activityCode: '1',
          testSummary: {
            routeNumber: 3,
            independentDriving: 'Sat nav',
            candidateDescription: 'description',
            identification: 'Licence',
          },
        } as TestResultSchemasUnion,
      },
      testStatus: { 1234: TestStatus.Booked },
    } as TestsModel,
  } as StoreModel;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Platform, useClass: PlatformMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: Router, useClass: RouterMock },
        provideMockStore({ initialState }),
        { provide: NavController, useClass: NavControllerMock },
        { provide: ToastController, useClass: ToastControllerMock },
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: OutcomeBehaviourMapProvider, useClass: OutcomeBehaviourMapProviderMock },
        WeatherConditionProvider,
        { provide: FaultSummaryProvider, useClass: FaultSummaryProvider },
        { provide: FaultCountProvider, useClass: FaultCountProvider },
      ],
    });

    platform = TestBed.inject(Platform);
    authenticationProvider = TestBed.inject(AuthenticationProvider);
    router = TestBed.inject(Router);
    store$ = TestBed.inject(MockStore);
    navController = TestBed.inject(NavController);
    toastController = TestBed.inject(ToastController);
    modalController = TestBed.inject(ModalController);
    outcomeBehaviourProvider = TestBed.inject(OutcomeBehaviourMapProvider);
    weatherConditionProvider = TestBed.inject(WeatherConditionProvider);
    faultSummaryProvider = TestBed.inject(FaultSummaryProvider);
    faultCountProvider = TestBed.inject(FaultCountProvider);
    spyOn(store$, 'dispatch');

    class BasePageClass extends OfficeBasePageComponent {
      constructor(
        plat: Platform,
        auth: AuthenticationProvider,
        rout: Router,
        sto$: Store<StoreModel>,
        nav: NavController,
        toa: ToastController,
        mod: ModalController,
        beh: OutcomeBehaviourMapProvider,
        wea: WeatherConditionProvider,
        fsp: FaultSummaryProvider,
        fcp: FaultCountProvider,
      ) {
        super(plat, auth, rout, sto$, nav, toa, mod, beh, wea, fsp, fcp);
      }
    }

    basePageComponent = new BasePageClass(
      platform,
      authenticationProvider,
      router,
      store$,
      navController,
      toastController,
      modalController,
      outcomeBehaviourProvider,
      weatherConditionProvider,
      faultSummaryProvider,
      faultCountProvider,
    );
  }));
  describe('onInitialisation', () => {
    it('should resolve state variables', () => {
      basePageComponent.onInitialisation();
      basePageComponent.commonPageState.activityCode$
        .pipe(take(1))
        .subscribe((res: ActivityCodeModel) => expect(res.activityCode).toEqual('1'));
      basePageComponent.commonPageState.routeNumber$
        .pipe(take(1))
        .subscribe((res: number) => expect(res).toEqual(3));
      basePageComponent.commonPageState.independentDriving$
        .pipe(take(1))
        .subscribe((res: string) => expect(res).toEqual('Sat nav'));
      basePageComponent.commonPageState.candidateDescription$
        .pipe(take(1))
        .subscribe((res: string) => expect(res).toEqual('description'));
      basePageComponent.commonPageState.identification$
        .pipe(take(1))
        .subscribe((res: Identification) => expect(res).toEqual('Licence'));
      basePageComponent.commonPageState.displayDrivingFault$
        .pipe(take(1))
        .subscribe((res: boolean) => expect(!!res).toEqual(false));
      basePageComponent.commonPageState.displayDangerousFault$
        .pipe(take(1))
        .subscribe((res: boolean) => expect(!!res).toEqual(false));
      basePageComponent.commonPageState.displaySeriousFault$
        .pipe(take(1))
        .subscribe((res: boolean) => expect(!!res).toEqual(false));
      basePageComponent.commonPageState.displayEta$
        .pipe(take(1))
        .subscribe((res: boolean) => expect(!!res).toEqual(false));
      basePageComponent.commonPageState.displayEco$
        .pipe(take(1))
        .subscribe((res: boolean) => expect(!!res).toEqual(false));
    });
  });

  describe('ionViewDidEnter', () => {
    it('should dispatch OfficeViewDidEnter', () => {
      basePageComponent.ionViewDidEnter();
      expect(store$.dispatch).toHaveBeenCalledWith(OfficeViewDidEnter());
    });
  });

  describe('setIsValidStartDateTime', () => {
    it('should set isValidStartDateTime', () => {
      basePageComponent.setIsValidStartDateTime(true);
      expect(basePageComponent.isValidStartDateTime).toEqual(true);
    });
  });

  describe('weatherConditionsChanged', () => {
    it('should dispatch a weather conditions changed action with the weather condition values', () => {
      const conditions: WeatherConditions[] = ['Showers'];
      basePageComponent.weatherConditionsChanged(conditions);
      expect(store$.dispatch).toHaveBeenCalledWith(WeatherConditionsChanged(conditions));
    });
  });

  describe('activityCodeChanged', () => {
    beforeEach(() => {
      basePageComponent.form.addControl('showMeQuestion', new UntypedFormControl('', []));
      spyOn(basePageComponent.form.controls['showMeQuestion'], 'setValue');
    });
    it('should dispatch a SetActivityCode action with the activity code', () => {
      basePageComponent.form.controls = { showMeQuestion: null };
      basePageComponent.activityCodeChanged(activityCodeModelList[0]);
      expect(store$.dispatch).toHaveBeenCalledWith(SetActivityCode(activityCodeModelList[0].activityCode));
    });
    it('should setValue of showMeQuestion to {}', () => {
      basePageComponent.form.controls = {
        showMeQuestion: {
          ...basePageComponent.form.controls['showMeQuestion'],
          value: { code: 'N/A' },
        } as AbstractControl,
      };
      basePageComponent.activityCodeChanged(activityCodeModelList[0]);
      expect(basePageComponent.form.controls['showMeQuestion'].setValue).toHaveBeenCalledWith({});
    });
    it('should not setValue of showMeQuestion when value is not N/A', () => {
      basePageComponent.form.controls = {
        showMeQuestion: {
          ...basePageComponent.form.controls['showMeQuestion'],
          value: { code: 'A1' },
        } as AbstractControl,
      };
      basePageComponent.activityCodeChanged(activityCodeModelList[0]);
      expect(basePageComponent.form.controls['showMeQuestion'].setValue).not.toHaveBeenCalled();
    });
  });

  describe('completeTest', () => {
    beforeEach(() => {
      spyOn(basePageComponent, 'popToRoot');
      basePageComponent.finishTestModal = { dismiss: async () => true } as HTMLIonModalElement;
    });
    it('should successfully end the test', async () => {
      await basePageComponent.completeTest();
      expect(store$.dispatch).toHaveBeenCalledWith(CompleteTest());
      expect(basePageComponent.popToRoot).toHaveBeenCalled();
    });
    it('should not dispatch complete test if in practice mode', async () => {
      basePageComponent.isEndToEndPracticeMode = true;
      await basePageComponent.completeTest();
      expect(store$.dispatch).not.toHaveBeenCalledWith(CompleteTest());
      expect(basePageComponent.popToRoot).toHaveBeenCalled();
    });
  });

  describe('popToRoot', () => {
    beforeEach(() => {
      spyOn(basePageComponent, 'exitPracticeMode');
    });
    it('should not call navigateBack when in practice mode', async () => {
      basePageComponent.isEndToEndPracticeMode = true;
      await basePageComponent.popToRoot();
      expect(basePageComponent.navController.navigateBack).not.toHaveBeenCalled();
    });
    it('should call the navigateBack method whilst not in practice mode', async () => {
      basePageComponent.isEndToEndPracticeMode = false;
      await basePageComponent.popToRoot();
      expect(basePageComponent.navController.navigateBack).toHaveBeenCalled();
    });
  });

  describe('defer', () => {
    it('should call popToRoot and dispatch two actions', async () => {
      spyOn(basePageComponent, 'popToRoot');
      await basePageComponent.defer();
      expect(basePageComponent.popToRoot).toHaveBeenCalled();
      expect(store$.dispatch).toHaveBeenCalledWith(SavingWriteUpForLater());
      expect(store$.dispatch).toHaveBeenCalledWith(PersistTests());
    });
  });

  describe('setupSubscriptions', () => {
    it('should assign store values to variables', () => {
      basePageComponent.commonPageState = {
        ...basePageComponent.commonPageState,
        startDateTime$: of('2022-01-01T12:00:00'),
      };
      basePageComponent.setupSubscriptions();
      expect(basePageComponent.startDateTime).toEqual('2022-01-01T12:00:00');
    });
  });

  describe('ionViewDidLeave', () => {
    it('should unsubscribe when subscription', () => {
      basePageComponent.subscription = new Subscription();
      spyOn(basePageComponent.subscription, 'unsubscribe');
      basePageComponent.ionViewDidLeave();
      expect(basePageComponent.subscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      spyOn(basePageComponent, 'showFinishTestModal');
    });
    it('should call through to showFinishTestModal when form is valid', async () => {
      spyOn(basePageComponent, 'isFormValid').and.returnValue(Promise.resolve(true));
      await basePageComponent.onSubmit();
      expect(basePageComponent.showFinishTestModal).toHaveBeenCalled();
    });
    it('should not call through to showFinishTestModal when form is invalid', async () => {
      spyOn(basePageComponent, 'isFormValid').and.returnValue(Promise.resolve(false));
      await basePageComponent.onSubmit();
      expect(basePageComponent.showFinishTestModal).not.toHaveBeenCalled();
    });
  });

  describe('goToReasonForRekey', () => {
    beforeEach(() => {
      spyOn(router, 'navigate');
    });
    it('should call through to router.navigate when form is valid', async () => {
      spyOn(basePageComponent, 'isFormValid').and.returnValue(Promise.resolve(true));
      await basePageComponent.goToReasonForRekey();
      expect(router.navigate).toHaveBeenCalledWith([TestFlowPageNames.REKEY_REASON_PAGE]);
    });
    it('should not call through to router.navigate when form is invalid', async () => {
      spyOn(basePageComponent, 'isFormValid').and.returnValue(Promise.resolve(false));
      await basePageComponent.goToReasonForRekey();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('additionalInformationChanged', () => {
    it('should dispatch an Additional Information change action with the new value', () => {
      const info: string = 'Nothing more to say.';
      basePageComponent.additionalInformationChanged(info);

      expect(store$.dispatch).toHaveBeenCalledWith(AdditionalInformationChanged(info));
    });
  });

  describe('candidateDescriptionChanged', () => {
    it('should dispatch a Candidate Description change action with the new value', () => {
      const desc: string = 'Tall but deceptively short.';
      basePageComponent.candidateDescriptionChanged(desc);

      expect(store$.dispatch).toHaveBeenCalledWith(CandidateDescriptionChanged(desc));
    });
  });

  describe('dateOfTestChanged', () => {
    it('should ', () => {
      basePageComponent.startDateTime = '2022-01-01T12:00:00';
      basePageComponent.dateOfTestChanged('2022-01-02');
      expect(store$.dispatch).toHaveBeenCalledWith(TestStartDateChanged('2022-01-01T12:00:00', '2022-01-02T12:00:00'));
      expect(store$.dispatch).toHaveBeenCalledWith(SetStartDate('2022-01-02T12:00:00'));
    });
  });
  describe('routeNumberChanged', () => {
    it('should dispatch a Route change action with the new value', () => {
      const route: number = 17;
      basePageComponent.routeNumberChanged(route);

      expect(store$.dispatch).toHaveBeenCalledWith(RouteNumberChanged(route));
    });
  });
  describe('independentDrivingChanged', () => {
    it('should dispatch an Independent Driving change action with the new value', () => {
      const drivingAid: IndependentDriving = 'Diagram';
      basePageComponent.independentDrivingChanged(drivingAid);

      expect(store$.dispatch).toHaveBeenCalledWith(IndependentDrivingTypeChanged(drivingAid));
    });
  });
  describe('trueLikenessToPhotoChanged', () => {
    it('should dispatch TrueLikenessToPhotoChanged with true', () => {
      basePageComponent.trueLikenessToPhotoChanged(true);
      expect(store$.dispatch).toHaveBeenCalledWith(TrueLikenessToPhotoChanged(true));
    });
  });
  describe('provisionalLicenseReceived', () => {
    it('should dispatch ProvisionalLicenseReceived', () => {
      basePageComponent.provisionalLicenseReceived();
      expect(store$.dispatch).toHaveBeenCalledWith(ProvisionalLicenseReceived());
    });
  });
  describe('provisionalLicenseNotReceived', () => {
    it('should dispatch ProvisionalLicenseNotReceived', () => {
      basePageComponent.provisionalLicenseNotReceived();
      expect(store$.dispatch).toHaveBeenCalledWith(ProvisionalLicenseNotReceived());
    });
  });
  describe('transmissionChanged', () => {
    it('should dispatch GearboxCategoryChanged with Manual', () => {
      basePageComponent.transmissionChanged('Manual');
      expect(store$.dispatch).toHaveBeenCalledWith(GearboxCategoryChanged('Manual'));
    });
  });
  describe('healthDeclarationChanged', () => {
    it('should dispatch HealthDeclarationAccepted with false', () => {
      basePageComponent.healthDeclarationChanged(false);
      expect(store$.dispatch).toHaveBeenCalledWith(HealthDeclarationAccepted(false));
    });
  });
  describe('d255Changed', () => {
    [
      { outcome: true, action: D255Yes },
      { outcome: false, action: D255No },
    ].forEach(({ action, outcome }) => {
      it(`should dispatch D255${outcome ? 'Yes' : 'No'}`, () => {
        basePageComponent.d255Changed(outcome);
        expect(store$.dispatch).toHaveBeenCalledWith(action());
      });
    });
  });
  describe('isWelshChanged', () => {
    it('should dispatch CandidateChoseToProceedWithTestInWelsh with Cymraeg', () => {
      basePageComponent.isWelshChanged(true);
      expect(store$.dispatch).toHaveBeenCalledWith(CandidateChoseToProceedWithTestInWelsh('Cymraeg'));
    });
    it('should dispatch CandidateChoseToProceedWithTestInEnglish with English', () => {
      basePageComponent.isWelshChanged(false);
      expect(store$.dispatch).toHaveBeenCalledWith(CandidateChoseToProceedWithTestInEnglish('English'));
    });
  });
  describe('instructorAccompanimentToggled', () => {
    it('should dispatch InstructorAccompanimentToggled', () => {
      basePageComponent.instructorAccompanimentToggled();
      expect(store$.dispatch).toHaveBeenCalledWith(InstructorAccompanimentToggled());
    });
  });
  describe('supervisorAccompanimentToggled', () => {
    it('should dispatch SupervisorAccompanimentToggled', () => {
      basePageComponent.supervisorAccompanimentToggled();
      expect(store$.dispatch).toHaveBeenCalledWith(SupervisorAccompanimentToggled());
    });
  });
  describe('interpreterAccompanimentToggled', () => {
    it('should dispatch InterpreterAccompanimentToggled', () => {
      basePageComponent.interpreterAccompanimentToggled();
      expect(store$.dispatch).toHaveBeenCalledWith(InterpreterAccompanimentToggled());
    });
  });
  describe('supervisorAccompanimentToggledCPC', () => {
    it('should dispatch the action SupervisorAccompanimentToggledCPC', () => {
      basePageComponent.supervisorAccompanimentToggledCPC();
      expect(store$.dispatch).toHaveBeenCalledWith(SupervisorAccompanimentToggledCPC());
    });
  });
  describe('schoolBikeToggled', () => {
    it('should dispatch SchoolBikeToggled', () => {
      basePageComponent.schoolBikeToggled();
      expect(store$.dispatch).toHaveBeenCalledWith(SchoolBikeToggled());
    });
  });
  describe('otherAccompanimentToggled', () => {
    it('should dispatch OtherAccompanimentToggled', () => {
      basePageComponent.otherAccompanimentToggled();
      expect(store$.dispatch).toHaveBeenCalledWith(OtherAccompanimentToggled());
    });
  });
  describe('dualControlsToggled', () => {
    it('should dispatch DualControlsToggled', () => {
      basePageComponent.dualControlsToggled();
      expect(store$.dispatch).toHaveBeenCalledWith(DualControlsToggled());
    });
  });
  describe('schoolCarToggled', () => {
    it('should dispatch SchoolCarToggled', () => {
      basePageComponent.schoolCarToggled();
      expect(store$.dispatch).toHaveBeenCalledWith(SchoolCarToggled());
    });
  });
  describe('circuitChanged', () => {
    it('should dispatch CircuitTypeChanged with Left', () => {
      basePageComponent.circuitChanged('Left');
      expect(store$.dispatch).toHaveBeenCalledWith(CircuitTypeChanged('Left'));
    });
  });
  describe('debriefWitnessedChanged', () => {
    [
      { witnessed: true, action: DebriefWitnessed },
      { witnessed: false, action: DebriefUnWitnessed },
    ].forEach(({ action, witnessed }) => {
      it(`should dispatch action with ${witnessed}`, () => {
        basePageComponent.debriefWitnessedChanged(witnessed);
        expect(store$.dispatch).toHaveBeenCalledWith(action());
      });
    });
  });
  describe('identificationChanged', () => {
    it('should dispatch an Identification change action with the new value', () => {
      const idType: Identification = 'Passport';
      basePageComponent.identificationChanged(idType);
      expect(store$.dispatch).toHaveBeenCalledWith(IdentificationUsedChanged(idType));
    });
  });
  describe('showFinishTestModal', async () => {
    it('should create a modal', async () => {
      spyOn(basePageComponent.modalController, 'create').and.callThrough();
      await basePageComponent.showFinishTestModal();
      expect(basePageComponent.modalController.create).toHaveBeenCalledWith({
        id: 'FinishTestModal',
        component: FinishTestModal,
        cssClass: 'mes-modal-alert text-zoom-regular',
        backdropDismiss: false,
        showBackdrop: true,
        componentProps: {
          completeTest: basePageComponent.completeTest,
          destroyTestSubs: basePageComponent.destroyTestSubs,
        },
      });
    });
  });
  describe('destroyTestSubs', () => {
    it('should run next and complete on both wrtcDestroy$ and trDestroy$', () => {
      spyOn(wrtcDestroy$, 'next');
      spyOn(wrtcDestroy$, 'complete');
      spyOn(trDestroy$, 'next');
      spyOn(trDestroy$, 'complete');

      basePageComponent.destroyTestSubs();

      expect(wrtcDestroy$.next).toHaveBeenCalled();
      expect(wrtcDestroy$.complete).toHaveBeenCalled();
      expect(trDestroy$.next).toHaveBeenCalled();
      expect(trDestroy$.complete).toHaveBeenCalled();
    });
  });
  describe('completeTestDelegated', () => {
    it('should dispatch store and then navigate to '
            + 'rekey upload after the modal is dismissed', async () => {
      await basePageComponent.showFinishTestModal();

      spyOn(store$, 'dispatch');
      spyOn(basePageComponent.finishTestModal, 'dismiss');
      spyOn(basePageComponent.router, 'navigate');

      await basePageComponent.completeTestDelegated();

      expect(store$.dispatch).toHaveBeenCalledWith(SetRekeyDate());
      expect(store$.dispatch).toHaveBeenCalledWith(SendCurrentTest());
      expect(basePageComponent.finishTestModal.dismiss).toHaveBeenCalled();
      expect(basePageComponent.router.navigate).toHaveBeenCalledWith(
        [DELEGATED_REKEY_UPLOAD_OUTCOME_PAGE],
        { replaceUrl: true },
      );
    });
  });
  describe('isFormValid', () => {
    it('should return true if form is valid', async () => {
      await basePageComponent.isFormValid();
      expect(basePageComponent.form.valid).toEqual(true);
    });

    it('should dispatch the appropriate ValidationError actions', fakeAsync(() => {
      basePageComponent.form = new UntypedFormGroup({
        requiredControl1: new UntypedFormControl(null, [Validators.required]),
        requiredControl2: new UntypedFormControl(null, [Validators.required]),
        notRequiredControl: new UntypedFormControl(null),
      });

      basePageComponent.isFormValid();
      tick();
      expect(store$.dispatch).toHaveBeenCalledWith(OfficeValidationError('requiredControl1 is blank'));
      expect(store$.dispatch).toHaveBeenCalledWith(OfficeValidationError('requiredControl2 is blank'));
      expect(store$.dispatch).not.toHaveBeenCalledWith(OfficeValidationError('notRequiredControl is blank'));
      expect(basePageComponent.toast).not.toBeUndefined();
    }));
  });

});
