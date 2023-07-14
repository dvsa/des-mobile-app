import { TestBed, waitForAsync } from '@angular/core/testing';
import { AlertController, Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AlertControllerMock, PlatformMock, RouterMock } from '@mocks/index.mock';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Subscription } from 'rxjs';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { StoreModel } from '@shared/models/store.model';
import { TestsModel } from '@store/tests/tests.model';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { PersistTests } from '@store/tests/tests.actions';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import {
  WaitingRoomToCarBikeCategoryChanged,
  WaitingRoomToCarBikeCategorySelected,
  WaitingRoomToCarViewDidEnter,
} from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import {
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
import {
  EyesightTestFailed,
  EyesightTestPassed,
} from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import { TEST_CENTRE_JOURNAL_PAGE, TestFlowPageNames } from '@pages/page-names.constants';
import { take } from 'rxjs/operators';
import {
  OrditTrainedChanged,
  TrainerRegistrationNumberChanged,
  TrainingRecordsChanged,
} from '@store/tests/trainer-details/cat-adi-part2/trainer-details.cat-adi-part2.actions';
import {
  CandidateDeclarationSigned,
  SetDeclarationStatus,
} from '@store/tests/pre-test-declarations/pre-test-declarations.actions';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import {
  InterpreterAccompanimentToggledCPC,
  SupervisorAccompanimentToggledCPC,
} from '@store/tests/accompaniment/cat-cpc/accompaniment.cat-cpc.actions';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { WaitingRoomToCarBasePageComponent } from '../waiting-room-to-car-base-page';

describe('WaitingRoomToCarBasePageComponent', () => {
  let platform: Platform;
  let authenticationProvider: AuthenticationProvider;
  let router: Router;
  let store$: Store<StoreModel>;
  let routeByCat: RouteByCategoryProvider;
  let appConf: AppConfigProvider;
  let alertCon: AlertController;

  let basePageComponent: WaitingRoomToCarBasePageComponent;
  const initialState = {
    tests: {
      currentTest: { slotId: '1234' },
      startedTests: {
        1234: {
          journalData: {
            candidate: {
              candidateName: {
                title: 'Mrs',
                firstName: 'Marge',
                lastName: 'Simpson',
              },
            },
          },
          category: TestCategory.B,
          testData: {
            eyesightTest: {
              complete: true,
              seriousFault: false,
            },
          },
          accompaniment: {
            interpreter: true,
            ADI: false,
            supervisor: true,
            other: false,
          },
          vehicleDetails: {
            registrationNumber: 'ABC123',
            gearboxCategory: 'Manual',
            schoolCar: true,
            dualControls: true,
          },
        } as TestResultSchemasUnion,
      },
      testStatus: { 1234: TestStatus.Booked },
    } as TestsModel,
  } as StoreModel;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Platform,
          useClass: PlatformMock,
        },
        {
          provide: AuthenticationProvider,
          useClass: AuthenticationProviderMock,
        },
        {
          provide: Router,
          useClass: RouterMock,
        },
        {
          provide: RouteByCategoryProvider,
          useClass: RouteByCategoryProviderMock,
        },
        {
          provide: AlertController,
          useClass: AlertControllerMock,
        },
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
        provideMockStore({ initialState }),
      ],
    });

    platform = TestBed.inject(Platform);
    authenticationProvider = TestBed.inject(AuthenticationProvider);
    router = TestBed.inject(Router);
    store$ = TestBed.inject(MockStore);
    routeByCat = TestBed.inject(RouteByCategoryProvider);
    appConf = TestBed.inject(AppConfigProvider);
    alertCon = TestBed.inject(AlertController);

    spyOn(store$, 'dispatch');

    class BasePageClass extends WaitingRoomToCarBasePageComponent {
      constructor(
        plat: Platform,
        auth: AuthenticationProvider,
        rout: Router,
        sto$: Store<StoreModel>,
        routeByCategory: RouteByCategoryProvider,
        alertController: AlertController,
        appConfig: AppConfigProvider,
      ) {
        super(plat, auth, rout, sto$, routeByCategory, alertController, false, appConfig);
      }
    }

    basePageComponent = new BasePageClass(
      platform, authenticationProvider, router, store$, routeByCat, alertCon, appConf,
    );
  }));

  describe('onInitialisation', () => {
    it('should resolve state variables', () => {
      basePageComponent.onInitialisation();
      basePageComponent.commonPageState.candidateName$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual('Marge Simpson'));
      basePageComponent.commonPageState.registrationNumber$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual('ABC123'));
      basePageComponent.commonPageState.transmission$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual('Manual'));
      basePageComponent.commonPageState.category$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual(TestCategory.B));
      basePageComponent.commonPageState.showEyesight$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual(true));
      basePageComponent.commonPageState.eyesightTestComplete$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual(true));
      basePageComponent.commonPageState.eyesightTestFailed$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual(false));
      basePageComponent.commonPageState.schoolCar$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual(true));
      basePageComponent.commonPageState.dualControls$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual(true));
      basePageComponent.commonPageState.instructorAccompaniment$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual(false));
      basePageComponent.commonPageState.supervisorAccompaniment$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual(true));
      basePageComponent.commonPageState.otherAccompaniment$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual(false));
      basePageComponent.commonPageState.interpreterAccompaniment$
        .pipe(take(1))
        .subscribe((res) => expect(res)
          .toEqual(true));
    });
  });
  describe('ionViewDidEnter', () => {
    it('should dispatch the WaitingRoomToCarViewDidEnter on ion view did enter', () => {
      basePageComponent.ionViewDidEnter();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(WaitingRoomToCarViewDidEnter());
    });
  });
  describe('ionViewWillLeave', () => {
    it('should dispatch the PersistTests action on ion view will leave', () => {
      basePageComponent.ionViewWillLeave();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(PersistTests());
    });
  });
  describe('ionViewDidLeave', () => {
    it('should unsubscribe when subscription is defined', () => {
      basePageComponent.subscription = new Subscription();
      spyOn(basePageComponent.subscription, 'unsubscribe');
      basePageComponent.ionViewDidLeave();
      expect(basePageComponent.subscription.unsubscribe)
        .toHaveBeenCalled();
    });
  });
  describe('dualControlsToggled', () => {
    it('should dispatch the action DualControlsToggled', () => {
      basePageComponent.dualControlsToggled();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(DualControlsToggled());
    });
  });
  describe('transmissionChanged', () => {
    it('should dispatch the action GearboxCategoryChanged', () => {
      basePageComponent.transmissionChanged('Manual');
      expect(store$.dispatch)
        .toHaveBeenCalledWith(GearboxCategoryChanged('Manual'));
    });
  });
  describe('instructorAccompanimentToggled', () => {
    it('should dispatch the action InstructorAccompanimentToggled', () => {
      basePageComponent.instructorAccompanimentToggled();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(InstructorAccompanimentToggled());
    });
  });
  describe('supervisorAccompanimentToggled', () => {
    it('should dispatch the action SupervisorAccompanimentToggled', () => {
      basePageComponent.supervisorAccompanimentToggled();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(SupervisorAccompanimentToggled());
    });
  });
  describe('supervisorAccompanimentToggledCPC', () => {
    it('should dispatch the action SupervisorAccompanimentToggledCPC', () => {
      basePageComponent.supervisorAccompanimentToggledCPC();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(SupervisorAccompanimentToggledCPC());
    });
  });
  describe('interpreterAccompanimentToggledCPC', () => {
    it('should dispatch the action InterpreterAccompanimentToggledCPC', () => {
      basePageComponent.interpreterAccompanimentToggledCPC();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(InterpreterAccompanimentToggledCPC());
    });
  });
  describe('interpreterAccompanimentToggled', () => {
    it('should dispatch the action InterpreterAccompanimentToggled', () => {
      basePageComponent.interpreterAccompanimentToggled();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(InterpreterAccompanimentToggled());
    });
  });
  describe('otherAccompanimentToggled', () => {
    it('should dispatch the action OtherAccompanimentToggled', () => {
      basePageComponent.otherAccompanimentToggled();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(OtherAccompanimentToggled());
    });
  });
  describe('vehicleRegistrationChanged', () => {
    it('should dispatch the action VehicleRegistrationChanged', () => {
      basePageComponent.vehicleRegistrationChanged('A1');
      expect(store$.dispatch)
        .toHaveBeenCalledWith(VehicleRegistrationChanged('A1'));
    });
  });
  describe('categoryCodeChanged', () => {
    it('should dispatch multiple actions around the category of test', () => {
      basePageComponent.testCategory = TestCategory.B;
      basePageComponent.categoryCodeChanged('EUAM2');
      expect(store$.dispatch)
        .toHaveBeenCalledWith(WaitingRoomToCarBikeCategorySelected('EUAM2'));
      expect(store$.dispatch)
        .toHaveBeenCalledWith(WaitingRoomToCarBikeCategoryChanged('EUAM2', TestCategory.B));
      expect(store$.dispatch)
        .toHaveBeenCalledWith(PopulateTestCategory('EUAM2'));
    });
  });
  describe('candidateDeclarationOutcomeChanged', () => {
    it('should dispatch the action SetDeclarationStatus with true', () => {
      basePageComponent.candidateDeclarationOutcomeChanged(true);
      expect(store$.dispatch)
        .toHaveBeenCalledWith(SetDeclarationStatus(true));
      expect(store$.dispatch)
        .toHaveBeenCalledWith(CandidateDeclarationSigned());
    });
  });
  describe('closeVehicleChecksModal', () => {
    it('should dispatch the action WaitingRoomToCarViewDidEnter', () => {
      basePageComponent.closeVehicleChecksModal();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(WaitingRoomToCarViewDidEnter());
    });
  });
  describe('schoolBikeToggled', () => {
    it('should dispatch the action SchoolBikeToggled', () => {
      basePageComponent.schoolBikeToggled();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(SchoolBikeToggled());
    });
  });
  describe('trainingRecordOutcomeChanged', () => {
    it('should dispatch the action TrainingRecordsChanged with false', () => {
      basePageComponent.trainingRecordOutcomeChanged(false);
      expect(store$.dispatch)
        .toHaveBeenCalledWith(TrainingRecordsChanged(false));
    });
  });
  describe('orditTrainedOutcomeChanged', () => {
    it('should dispatch the action OrditTrainedChanged with true', () => {
      basePageComponent.orditTrainedOutcomeChanged(true);
      expect(store$.dispatch)
        .toHaveBeenCalledWith(OrditTrainedChanged(true));
    });
  });
  describe('trainerRegistrationNumberChanged', () => {
    it('should dispatch the action TrainerRegistrationNumberChanged with 123', () => {
      basePageComponent.trainerRegistrationNumberChanged(123);
      expect(store$.dispatch)
        .toHaveBeenCalledWith(TrainerRegistrationNumberChanged(123));
    });
  });
  describe('schoolCarToggled', () => {
    it('should dispatch the action SchoolCarToggled', () => {
      basePageComponent.schoolCarToggled();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(SchoolCarToggled());
    });
  });
  describe('instructorRegistrationChanged', () => {
    it('should dispatch the action InstructorRegistrationNumberChanged', () => {
      basePageComponent.instructorRegistrationChanged(123);
      expect(store$.dispatch)
        .toHaveBeenCalledWith(InstructorRegistrationNumberChanged(123));
    });
  });
  describe('eyesightTestResultChanged', () => {
    it('should dispatch the action EyesightTestPassed', () => {
      basePageComponent.eyesightTestResultChanged(true);
      expect(store$.dispatch)
        .toHaveBeenCalledWith(EyesightTestPassed());
    });
    it('should dispatch the action EyesightTestFailed', () => {
      basePageComponent.eyesightTestResultChanged(false);
      expect(store$.dispatch)
        .toHaveBeenCalledWith(EyesightTestFailed());
    });
  });
  describe('onViewTestCentreJournal', () => {
    it('should navigate to TEST_CENTRE_JOURNAL_PAGE if not in practice made', async () => {
      spyOn(router, 'navigate');
      basePageComponent.isEndToEndPracticeMode = false;
      await basePageComponent.onViewTestCentreJournal();
      expect(router.navigate)
        .toHaveBeenCalledWith([TEST_CENTRE_JOURNAL_PAGE]);
    });

    it('should navigate to TEST_CENTRE_JOURNAL_PAGE if not in practice made', async () => {
      spyOn(router, 'navigate');
      basePageComponent.isEndToEndPracticeMode = true;
      await basePageComponent.onViewTestCentreJournal();
      expect(router.navigate)
        .not
        .toHaveBeenCalled();
    });
  });
  describe('getDebriefPage', () => {
    it('should call through to getNextPage and return value', () => {
      expect(basePageComponent.getDebriefPage())
        .toEqual(TestFlowPageNames.DEBRIEF_PAGE);
    });
  });
  describe('generateDelegatedQuestionResults', () => {
    it('should create a list X long with each outcome being the value passed in', () => {
      expect(basePageComponent.generateDelegatedQuestionResults(2, CompetencyOutcome.DF))
        .toEqual([
          {
            outcome: CompetencyOutcome.DF,
            code: 'DEL',
          },
          {
            outcome: CompetencyOutcome.DF,
            code: 'DEL',
          },
        ] as QuestionResult[]);
    });
  });
});
