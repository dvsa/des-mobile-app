import { async, TestBed } from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { Store } from '@ngrx/store';
import { PlatformMock } from 'ionic-mocks';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Subscription } from 'rxjs';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { StoreModel } from '@shared/models/store.model';
import { TestsModel } from '@store/tests/tests.model';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { PersistTests } from '@store/tests/tests.actions';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { WaitingRoomToCarViewDidEnter } from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import {
  DualControlsToggled, GearboxCategoryChanged, SchoolCarToggled, VehicleRegistrationChanged,
} from '@store/tests/vehicle-details/vehicle-details.actions';
import {
  InstructorAccompanimentToggled, InterpreterAccompanimentToggled, OtherAccompanimentToggled,
  SupervisorAccompanimentToggled,
} from '@store/tests/accompaniment/accompaniment.actions';
import { InstructorRegistrationNumberChanged } from '@store/tests/instructor-details/instructor-details.actions';
import {
  EyesightTestFailed, EyesightTestPassed,
} from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import { TEST_CENTRE_JOURNAL_PAGE } from '@pages/page-names.constants';
import { WaitingRoomToCarBasePageComponent } from '../waiting-room-to-car-base-page';

describe('WaitingRoomToCarBasePageComponent', () => {
  let platform: Platform;
  let authenticationProvider: AuthenticationProvider;
  let router: Router;
  let store$: Store<StoreModel>;
  let routeByCat: RouteByCategoryProvider;

  let basePageComponent: WaitingRoomToCarBasePageComponent;
  const initialState = {
    tests: {
      currentTest: { slotId: '1234' },
      startedTests: {
        1234: {
          journalData: {
            candidate: {
              candidateName: { title: 'Mrs', firstName: 'Marge', lastName: 'Simpson' },
            },
          },
          category: TestCategory.B,
          testData: {},
          accompaniment: {
            interpreter: true, ADI: false, supervisor: true, other: false,
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

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: Router, useClass: RouterMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
        provideMockStore({ initialState }),
      ],
    });
  });

  beforeEach(async(() => {
    platform = TestBed.inject(Platform);
    authenticationProvider = TestBed.inject(AuthenticationProvider);
    router = TestBed.inject(Router);
    store$ = TestBed.inject(MockStore);
    routeByCat = TestBed.inject(RouteByCategoryProvider);

    spyOn(store$, 'dispatch');

    class BasePageClass extends WaitingRoomToCarBasePageComponent {
      constructor(
        sto$: Store<StoreModel>,
        plat: Platform,
        auth: AuthenticationProvider,
        rout: Router,
        routeByCategory: RouteByCategoryProvider,
      ) {
        super(sto$, plat, auth, rout, routeByCategory);
      }
    }

    basePageComponent = new BasePageClass(store$, platform, authenticationProvider, router, routeByCat);
  }));

  describe('onInitialisation', () => {
    it('should resolve state variables', () => {
      basePageComponent.onInitialisation();
      basePageComponent.commonPageState.candidateName$
        .subscribe((res) => expect(res).toEqual('Marge Simpson'));
      basePageComponent.commonPageState.registrationNumber$
        .subscribe((res) => expect(res).toEqual('ABC123'));
      basePageComponent.commonPageState.transmission$
        .subscribe((res) => expect(res).toEqual('Manual'));
      basePageComponent.commonPageState.category$
        .subscribe((res) => expect(res).toEqual(TestCategory.B));
      basePageComponent.commonPageState.showEyesight$
        .subscribe((res) => expect(res).toEqual(true));
      basePageComponent.commonPageState.eyesightTestComplete$
        .subscribe((res) => expect(res).toEqual(false));
      basePageComponent.commonPageState.eyesightTestFailed$
        .subscribe((res) => expect(res).toEqual(false));
      basePageComponent.commonPageState.schoolCar$
        .subscribe((res) => expect(res).toEqual(true));
      basePageComponent.commonPageState.dualControls$
        .subscribe((res) => expect(res).toEqual(true));
      basePageComponent.commonPageState.instructorAccompaniment$
        .subscribe((res) => expect(res).toEqual(false));
      basePageComponent.commonPageState.supervisorAccompaniment$
        .subscribe((res) => expect(res).toEqual(true));
      basePageComponent.commonPageState.otherAccompaniment$
        .subscribe((res) => expect(res).toEqual(false));
      basePageComponent.commonPageState.interpreterAccompaniment$
        .subscribe((res) => expect(res).toEqual(true));
    });
  });
  describe('ionViewDidEnter', () => {
    it('should dispatch the WaitingRoomToCarViewDidEnter on ion view did enter', () => {
      basePageComponent.ionViewDidEnter();
      expect(store$.dispatch).toHaveBeenCalledWith(WaitingRoomToCarViewDidEnter());
    });
  });
  describe('ionViewWillLeave', () => {
    it('should dispatch the PersistTests action on ion view will leave', () => {
      basePageComponent.ionViewWillLeave();
      expect(store$.dispatch).toHaveBeenCalledWith(PersistTests());
    });
  });
  describe('ionViewDidLeave', () => {
    it('should unsubscribe when subscription is defined', () => {
      basePageComponent.subscription = new Subscription();
      spyOn(basePageComponent.subscription, 'unsubscribe');
      basePageComponent.ionViewDidLeave();
      expect(basePageComponent.subscription.unsubscribe).toHaveBeenCalled();
    });
  });
  describe('dualControlsToggled', () => {
    it('should dispatch the action DualControlsToggled', () => {
      basePageComponent.dualControlsToggled();
      expect(store$.dispatch).toHaveBeenCalledWith(DualControlsToggled());
    });
  });
  describe('transmissionChanged', () => {
    it('should dispatch the action GearboxCategoryChanged', () => {
      basePageComponent.transmissionChanged('Manual');
      expect(store$.dispatch).toHaveBeenCalledWith(GearboxCategoryChanged('Manual'));
    });
  });
  describe('instructorAccompanimentToggled', () => {
    it('should dispatch the action InstructorAccompanimentToggled', () => {
      basePageComponent.instructorAccompanimentToggled();
      expect(store$.dispatch).toHaveBeenCalledWith(InstructorAccompanimentToggled());
    });
  });
  describe('supervisorAccompanimentToggled', () => {
    it('should dispatch the action SupervisorAccompanimentToggled', () => {
      basePageComponent.supervisorAccompanimentToggled();
      expect(store$.dispatch).toHaveBeenCalledWith(SupervisorAccompanimentToggled());
    });
  });
  describe('interpreterAccompanimentToggled', () => {
    it('should dispatch the action InterpreterAccompanimentToggled', () => {
      basePageComponent.interpreterAccompanimentToggled();
      expect(store$.dispatch).toHaveBeenCalledWith(InterpreterAccompanimentToggled());
    });
  });
  describe('otherAccompanimentToggled', () => {
    it('should dispatch the action OtherAccompanimentToggled', () => {
      basePageComponent.otherAccompanimentToggled();
      expect(store$.dispatch).toHaveBeenCalledWith(OtherAccompanimentToggled());
    });
  });
  describe('vehicleRegistrationChanged', () => {
    it('should dispatch the action VehicleRegistrationChanged', () => {
      basePageComponent.vehicleRegistrationChanged('A1');
      expect(store$.dispatch).toHaveBeenCalledWith(VehicleRegistrationChanged('A1'));
    });
  });
  describe('schoolCarToggled', () => {
    it('should dispatch the action SchoolCarToggled', () => {
      basePageComponent.schoolCarToggled();
      expect(store$.dispatch).toHaveBeenCalledWith(SchoolCarToggled());
    });
  });
  describe('instructorRegistrationChanged', () => {
    it('should dispatch the action InstructorRegistrationNumberChanged', () => {
      basePageComponent.instructorRegistrationChanged(123);
      expect(store$.dispatch).toHaveBeenCalledWith(InstructorRegistrationNumberChanged(123));
    });
  });
  describe('eyesightTestResultChanged', () => {
    it('should dispatch the action EyesightTestPassed', () => {
      basePageComponent.eyesightTestResultChanged(true);
      expect(store$.dispatch).toHaveBeenCalledWith(EyesightTestPassed());
    });
    it('should dispatch the action EyesightTestFailed', () => {
      basePageComponent.eyesightTestResultChanged(false);
      expect(store$.dispatch).toHaveBeenCalledWith(EyesightTestFailed());
    });
  });
  describe('onViewTestCentreJournal', () => {
    it('should navigate to TEST_CENTRE_JOURNAL_PAGE', async () => {
      spyOn(router, 'navigate');
      await basePageComponent.onViewTestCentreJournal();
      expect(router.navigate).toHaveBeenCalledWith([TEST_CENTRE_JOURNAL_PAGE]);
    });
  });
  describe('getDebriefPage', () => {
    it('should call through to getNextPage and return value', () => {
      spyOn(routeByCat, 'getNextPage').and.returnValue('Some page');
      expect(basePageComponent.getDebriefPage()).toEqual('Some page');
    });
  });
});
