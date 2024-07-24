import { TestBed, waitForAsync } from '@angular/core/testing';
import { ModalController, Platform } from '@ionic/angular';
import { ActivatedRouteMock, ModalControllerMock, PlatformMock, RouterMock } from '@mocks/index.mock';
import { ActivatedRoute, Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';

import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { StoreModel } from '@shared/models/store.model';
import { TestsModel } from '@store/tests/tests.model';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { Subscription } from 'rxjs';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Injector } from '@angular/core';
import { TestReportBasePageComponent } from '../test-report-base-page';
import { TestReportValidatorProviderMock } from '@providers/test-report-validator/__mocks__/test-report-validator.mock';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import {
  CalculateTestResult,
  ReturnToTest,
  TerminateTestFromTestReport,
  TestReportViewDidEnter,
} from '@pages/test-report/test-report.actions';
import { ModalEvent } from '@pages/test-report/test-report.constants';
import { SetActivityCode } from '@store/tests/activity-code/activity-code.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';

describe('TestReportBasePageComponent', () => {
  let injector: Injector;
  let basePageComponent: TestReportBasePageComponent;
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
          provide: ModalController,
          useClass: ModalControllerMock,
        },
        {
          provide: TestReportValidatorProvider,
          useClass: TestReportValidatorProviderMock,
        },
        {
          provide: DeviceProvider,
          useClass: DeviceProviderMock,
        },
        {
          provide: ActivatedRoute,
          useClass: ActivatedRouteMock,
        },
        {
          provide: LogHelper,
          useClass: LogHelperMock,
        },
        provideMockStore({ initialState }),
      ],
    });

    injector = TestBed.inject(Injector);

    class BasePageClass extends TestReportBasePageComponent {
      constructor(inj: Injector) {
        super(inj);
      }
    }

    basePageComponent = new BasePageClass(injector);
  }));

  describe('onInitialisation', () => {
    it('should resolve state variables', () => {
      basePageComponent.onInitialisation();
      basePageComponent.commonPageState.candidateUntitledName$
        .subscribe((res) => expect(res)
          .toEqual('Marge Simpson'));
    });
  });

  describe('getTestRequirements', () => {
    it('should return correct value from getTestRequirementsCatB if the category is B', () => {
      expect(basePageComponent.getTestRequirements({
        testRequirements: { normalStart1: true },
      }, TestCategory.B))
        .toEqual({ normalStart1: true });
    });
    it('should return correct value from getTestRequirementsCatB if the switch defaults', () => {
      expect(basePageComponent.getTestRequirements({
        testRequirements: { normalStart1: true },
      }, TestCategory.EUA1M1))
        .toEqual({ normalStart1: true });
    });

    [
      TestCategory.C1E,
      TestCategory.C1,
      TestCategory.C,
    ].forEach((value) => {
      it(`should return correct value from getTestRequirementsCatC if category is ${value}`, () => {
        basePageComponent.getTestRequirements({ testRequirements: { angledStart: true } }, value);
        expect(basePageComponent.getTestRequirements({ testRequirements: { angledStart: true } }, value))

          .toEqual({ angledStart: true });
      });
    });
    [
      TestCategory.D1E,
      TestCategory.D1,
      TestCategory.DE,
      TestCategory.D,
    ].forEach((value) => {
      it(`should return correct value from getTestRequirementsCatD if category is ${value}`, () => {
        basePageComponent.getTestRequirements({ testRequirements: { angledStart: true } }, value);
        expect(basePageComponent.getTestRequirements({ testRequirements: { angledStart: true } }, value))
          .toEqual({ angledStart: true });
      });
    });
    [
      TestCategory.F,
      TestCategory.G,
      TestCategory.H,
      TestCategory.K,
    ].forEach((value) => {
      it(`should return correct value from getTestRequirementsCatHome if category is ${value}`, () => {
        basePageComponent.getTestRequirements({ testRequirements: { angledStart: true } }, value);
        expect(basePageComponent.getTestRequirements({ testRequirements: { angledStart: true } }, value))
          .toEqual({ angledStart: true });
      });
    });
  });

  describe('hasManoeuvreBeenCompleted', () => {
    it('should call hasManoeuvreBeenCompletedCatADIPart2 if the category is ADI2', () => {
      expect(basePageComponent.hasManoeuvreBeenCompleted({
        manoeuvres: [
          { forwardPark: { selected: true } },
          { reverseParkCarpark: { selected: true } }
        ],
      } as CatADI2UniqueTypes.TestData, TestCategory.ADI2))
        .toEqual(true);
    });
    it('should call hasManoeuvreBeenCompletedCatB if the category is B', () => {
      expect(basePageComponent.hasManoeuvreBeenCompleted({
        manoeuvres: {forwardPark: {selected: true}}
      }, TestCategory.B))
        .toEqual(true);
    });
    it('should return null if the switch defaults', () => {
      expect(basePageComponent.hasManoeuvreBeenCompleted({}, TestCategory.EUA1M1))
        .toEqual(null);
    });

    [
      TestCategory.C1E,
      TestCategory.C1,
      TestCategory.C,
    ].forEach((value) => {
      it(`should return correct value from hasManoeuvreBeenCompletedCatC if category is ${value}`, () => {
        expect(basePageComponent.hasManoeuvreBeenCompleted({
          manoeuvres: {reverseLeft: {selected: true}},
        }, value))
          .toEqual(true);
      });
    });
    [
      TestCategory.D1E,
      TestCategory.D1,
      TestCategory.DE,
      TestCategory.D,
    ].forEach((value) => {
      it(`should return correct value from hasManoeuvreBeenCompletedCatD if category is ${value}`, () => {
        expect(basePageComponent.hasManoeuvreBeenCompleted({
          manoeuvres: {reverseLeft: {selected: true}},
        }, value))
          .toEqual(true);
      });
    });
    [
      TestCategory.F,
      TestCategory.G,
      TestCategory.H,
      TestCategory.K,
    ].forEach((value) => {
      it(`should return correct value from hasManoeuvreBeenCompletedCatHomeTest if category is ${value}`, () => {
        expect(basePageComponent.hasManoeuvreBeenCompleted({
          manoeuvres: {reverseLeft: {selected: true}},
        }, value))
          .toEqual(true);
      });
    });
  });

  describe('cancelSubscription', () => {
    it('should unsubscribe from the subscription if there is one', () => {
      basePageComponent.subscription = new Subscription();
      spyOn(basePageComponent.subscription, 'unsubscribe');
      basePageComponent.cancelSubscription();
      expect(basePageComponent.subscription.unsubscribe)
        .toHaveBeenCalled();
    });
  });

  describe('toggleReportOverlay', () => {
    it('should toggle displayOverlay', () => {
      basePageComponent.displayOverlay = false;
      basePageComponent.toggleReportOverlay();
      expect(basePageComponent.displayOverlay)
        .toEqual(true);
    });
  });

  describe('onModalDismiss', () => {

    it('should navigate to DEBRIEF_PAGE on CONTINUE event when test is not delegated', async () => {
      basePageComponent.delegatedTest = false
      spyOn(basePageComponent.router, 'navigate');
      await basePageComponent.onModalDismiss(ModalEvent.CONTINUE);
      expect(basePageComponent.router.navigate).toHaveBeenCalledWith([TestFlowPageNames.DEBRIEF_PAGE]);
    });

    it('should dispatch CalculateTestResult action on CONTINUE event', async () => {
      spyOn(basePageComponent.store$, 'dispatch');
      await basePageComponent.onModalDismiss(ModalEvent.CONTINUE);
      expect(basePageComponent.store$.dispatch).toHaveBeenCalledWith(CalculateTestResult());
    });

    it('should navigate to OFFICE_PAGE on CONTINUE event when test is delegated', async () => {
      basePageComponent.delegatedTest = true
      spyOn(basePageComponent['routeByCategory'], 'getNextPage').and.returnValue(TestFlowPageNames.OFFICE_PAGE);
      spyOn(basePageComponent.router, 'navigate');
      await basePageComponent.onModalDismiss(ModalEvent.CONTINUE);
      expect(basePageComponent.router.navigate).toHaveBeenCalledWith([TestFlowPageNames.OFFICE_PAGE]);
    });

    it('should dispatch TerminateTestFromTestReport action on TERMINATE event', async () => {
      spyOn(basePageComponent.store$, 'dispatch');
      await basePageComponent.onModalDismiss(ModalEvent.TERMINATE);
      expect(basePageComponent.store$.dispatch).toHaveBeenCalledWith(TerminateTestFromTestReport());
    });

    it('should dispatch SetActivityCode action with code "4" on END_WITH_ACTIVITY_CODE_4 event', async () => {
      spyOn(basePageComponent.store$, 'dispatch');
      await basePageComponent.onModalDismiss(ModalEvent.END_WITH_ACTIVITY_CODE_4);
      expect(basePageComponent.store$.dispatch).toHaveBeenCalledWith(SetActivityCode('4'));
    });

    it('should dispatch ReturnToTest action on CANCEL event', async () => {
      spyOn(basePageComponent.store$, 'dispatch');
      await basePageComponent.onModalDismiss(ModalEvent.CANCEL);
      expect(basePageComponent.store$.dispatch).toHaveBeenCalledWith(ReturnToTest());
    });

    it('should not navigate or dispatch any action on default case', async () => {
      spyOn(basePageComponent.store$, 'dispatch');
      spyOn(basePageComponent.router, 'navigate');
      await basePageComponent.onModalDismiss(null);
      expect(basePageComponent.store$.dispatch).not.toHaveBeenCalled();
      expect(basePageComponent.router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('ionViewDidEnter', () => {
    it('should setup subscription if none exists', () => {
      basePageComponent.subscription = null;
      spyOn(basePageComponent, 'setupSubscription');
      basePageComponent.ionViewDidEnter();
      expect(basePageComponent.setupSubscription).toHaveBeenCalled();
    });
    it('should setup subscription if existing subscription is closed', () => {
      basePageComponent.subscription = new Subscription();
      basePageComponent.subscription.unsubscribe(); // Manually close the subscription
      spyOn(basePageComponent, 'setupSubscription');
      basePageComponent.ionViewDidEnter();
      expect(basePageComponent.setupSubscription).toHaveBeenCalled();
    });
    it('should dispatch TestReportViewDidEnter action', () => {
      basePageComponent.subscription = new Subscription();
      spyOn(basePageComponent.store$, 'dispatch');
      basePageComponent.ionViewDidEnter();
      expect(basePageComponent.store$.dispatch).toHaveBeenCalledWith(TestReportViewDidEnter());
    });
  });
});
