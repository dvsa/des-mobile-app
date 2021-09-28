import {
  waitForAsync,
  TestBed,
} from '@angular/core/testing';
import {
  ModalController,
  NavController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { Store } from '@ngrx/store';
import { PlatformMock } from 'ionic-mocks';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';

import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { StoreModel } from '@shared/models/store.model';
import { TestsModel } from '@store/tests/tests.model';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { ActivityCodeModel, activityCodeModelList } from '@shared/constants/activity-code/activity-code.constants';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { WeatherConditionProvider } from '@providers/weather-conditions/weather-condition';
import { NavControllerMock } from '@shared/mocks/nav-controller-mock';
import { ToastControllerMock } from '@pages/office/__mocks__/toast-controller-mock';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { OutcomeBehaviourMapProviderMock } from '@providers/outcome-behaviour-map/__mocks__/outcome-behaviour-map.mock';
import { WeatherConditions } from '@dvsa/mes-test-schema/categories/common';
import { WeatherConditionsChanged } from '@store/tests/test-summary/test-summary.actions';
import { SetActivityCode } from '@store/tests/activity-code/activity-code.actions';
import { CompleteTest, SavingWriteUpForLater } from '@pages/office/office.actions';
import { PersistTests } from '@store/tests/tests.actions';
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

  let basePageComponent: OfficeBasePageComponent;
  const initialState = {
    tests: {
      currentTest: { slotId: '1234' },
      startedTests: {
        1234: {
          activityCode: '1',
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
        provideMockStore({ initialState }),
        { provide: NavController, useClass: NavControllerMock },
        { provide: ToastController, useClass: ToastControllerMock },
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: OutcomeBehaviourMapProvider, useClass: OutcomeBehaviourMapProviderMock },
        WeatherConditionProvider,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    platform = TestBed.inject(Platform);
    authenticationProvider = TestBed.inject(AuthenticationProvider);
    router = TestBed.inject(Router);
    store$ = TestBed.inject(MockStore);
    navController = TestBed.inject(NavController);
    toastController = TestBed.inject(ToastController);
    modalController = TestBed.inject(ModalController);
    outcomeBehaviourProvider = TestBed.inject(OutcomeBehaviourMapProvider);
    weatherConditionProvider = TestBed.inject(WeatherConditionProvider);
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
      ) {
        super(plat, auth, rout, sto$, nav, toa, mod, beh, wea);
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
    );
  }));

  describe('onInitialisation', () => {
    it('should resolve state variables', () => {
      basePageComponent.onInitialisation();
      basePageComponent.commonPageState.activityCode$
        .subscribe((res: ActivityCodeModel) => expect(res.activityCode).toEqual('1'));
    });
  });

  // describe('onSubmit', () => {
  //   it('should show modal if form is valid', async () => {
  //     spyOn(basePageComponent, 'isFormValid').and.returnValue(Promise.resolve(true));
  //     await basePageComponent.onSubmit();
  //     expect(basePageComponent.showFinishTestModal).toHaveBeenCalled();
  //   });
  // });

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
    it('should dispatch a SetActivityCode action with the activity code', () => {
      basePageComponent.activityCodeChanged(activityCodeModelList[0]);
      expect(store$.dispatch).toHaveBeenCalledWith(SetActivityCode(activityCodeModelList[0].activityCode));
    });
  });

  describe('completeTest', () => {
    it('should successfully end the test', () => {
      basePageComponent.completeTest();
      expect(store$.dispatch).toHaveBeenCalledWith(CompleteTest());
    });

    it('should not dispatch complete test if in practice mode', () => {
      basePageComponent.isPracticeMode = true;
      basePageComponent.completeTest();
      expect(store$.dispatch).not.toHaveBeenCalledWith(CompleteTest());
    });
  });

  describe('popToRoot', () => {
    it('should call the navigateBack method in the navcontroller if not in practice mode', () => {
      basePageComponent.popToRoot();
      expect(basePageComponent.navController.navigateBack).toHaveBeenCalled();
    });
    it('should call the navigateBack method in the navcontroller if in practice mode.', () => {
      basePageComponent.isPracticeMode = true;
      basePageComponent.popToRoot();
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
});
