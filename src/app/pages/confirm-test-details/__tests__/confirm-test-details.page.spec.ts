import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { TranslateModule } from '@ngx-translate/core';
import { TestSlotAttributes } from '@dvsa/mes-test-schema/categories/common';
import {
  AlertController, IonicModule, ModalController, NavController, Platform,
} from '@ionic/angular';
import { AppModule } from 'src/app/app.module';
import { ComponentsModule } from '@components/common/common-components.module';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { AlertControllerMock, NavControllerMock, PlatformMock } from '@mocks/index.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { Observable, Subscription } from 'rxjs';
import { TestOutcome } from '@store/tests/tests.constants';
import { PersistTests } from '@store/tests/tests.actions';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { SetTestStatusWriteUp } from '@store/tests/test-status/test-status.actions';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivityCodeModel } from '@shared/constants/activity-code/activity-code.constants';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { ADI3AssessmentProvider } from '@providers/adi3-assessment/adi3-assessment';
import { VehicleDetailsByCategoryProvider } from '@providers/vehicle-details-by-category/vehicle-details-by-category';
import { ConfirmTestDetailsPage } from '../confirm-test-details.page';
import { BackButtonClick, BackToDebrief, ConfirmTestDetailsViewDidEnter } from '../confirm-test-details.actions';
import { TestFlowPageNames } from '../../page-names.constants';

describe('ConfirmTestDetailsPage', () => {
  let fixture: ComponentFixture<ConfirmTestDetailsPage>;
  let component: ConfirmTestDetailsPage;
  let modalController: ModalController;
  let store$: Store<StoreModel>;
  let router: Router;

  const testSlotAttributes: TestSlotAttributes = {
    welshTest: false,
    extendedTest: false,
    slotId: 123,
    specialNeeds: false,
    start: '',
    vehicleTypeCode: '',
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ConfirmTestDetailsPage],
      imports: [
        IonicModule,
        AppModule,
        ComponentsModule,
        StoreModule.forRoot({
          tests: () => ({
            currentTest: {
              slotId: '123',
            },
            testStatus: {},
            startedTests: {
              123: {
                postTestDeclarations: {
                  healthDeclarationAccepted: false,
                  passCertificateNumberReceived: false,
                  postTestSignature: '',
                },
                journalData: {
                  testSlotAttributes,
                  candidate: candidateMock,
                },
              },
            },
          }),
        }),
        TranslateModule,
      ],
      providers: [
        {
          provide: Platform,
          useClass: PlatformMock,
        },
        {
          provide: NavController,
          useClass: NavControllerMock,
        },
        {
          provide: AuthenticationProvider,
          useClass: AuthenticationProviderMock,
        },
        {
          provide: AlertController,
          useClass: AlertControllerMock,
        },
        {
          provide: ModalController,
          useClass: ModalControllerMock,
        },
        {
          provide: ADI3AssessmentProvider,
          useClass: ADI3AssessmentProvider,
        },
        VehicleDetailsByCategoryProvider,
      ],
    });

    fixture = TestBed.createComponent(ConfirmTestDetailsPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    store$ = TestBed.inject(Store);
    modalController = TestBed.inject(ModalController);
    spyOn(store$, 'dispatch');
    spyOn(router, 'navigate');
    component.subscription = new Subscription();
  }));

  describe('ionViewDidEnter', () => {
    it('should dispatch ConfirmTestDetailsViewDidEnter and call backButtonClick', () => {
      component.ionViewDidEnter();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(ConfirmTestDetailsViewDidEnter());
    });
  });

  describe('isPassed', () => {
    it('should return true if test outcome is Passed', () => {
      expect(component.isPassed(TestOutcome.Passed))
        .toEqual(true);
    });
    it('should return false if test outcome is not Passed', () => {
      expect(component.isPassed(TestOutcome.Terminated))
        .toEqual(false);
    });
  });

  describe('getActivityCode', () => {
    it('should return the activity code and description', () => {
      const activityCode = {
        activityCode: '1',
        description: 'Pass',
      } as ActivityCodeModel;
      expect(component.getActivityCode(activityCode))
        .toEqual('1 - Pass');
    });
  });

  describe('getProvisionalText', () => {
    it('should return appropriate string if true', () => {
      expect(component.getProvisionalText(true))
        .toEqual('Yes - Please retain the candidates licence.');
    });
    it('should return appropriate string if false', () => {
      expect(component.getProvisionalText(false))
        .toEqual('No - Please ensure that the licence is kept by the candidate.');
    });
  });

  describe('getD255Text', () => {
    it('should return appropriate string if true', () => {
      expect(component.getD255Text(true))
        .toEqual('Yes - Please complete a D255.');
    });
    it('should return appropriate string if false', () => {
      expect(component.getD255Text(false))
        .toEqual('No');
    });
  });

  describe('onSubmit', () => {
    it('should call showConfirmTestDetailsModal', async () => {
      spyOn(component, 'showConfirmTestDetailsModal');
      await component.onSubmit();
      expect(component.showConfirmTestDetailsModal)
        .toHaveBeenCalled();
    });
  });

  describe('showConfirmTestDetailsModal', () => {
    it('should call alertController.create', async () => {
      spyOn(modalController, 'create')
        .and
        .returnValue(Promise.resolve({
          present: () => Promise.resolve(),
        } as HTMLIonModalElement));
      await component.showConfirmTestDetailsModal();
      expect(modalController.create)
        .toHaveBeenCalled();
    });
  });

  describe('onTestDetailsConfirm', () => {
    it('should call device auth provider triggerLockScreen', async () => {
      component.testOutcome = TestOutcome.Passed;
      component.slotId = '123';
      await component.onTestDetailsConfirm();
      expect(router.navigate)
        .toHaveBeenCalledWith([TestFlowPageNames.BACK_TO_OFFICE_PAGE], { replaceUrl: true });
    });

    it('should call dispatch for  PersistTests', async () => {
      component.testOutcome = TestOutcome.Passed;
      component.slotId = '123';
      await component.onTestDetailsConfirm();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(SetTestStatusWriteUp('123'));
      expect(store$.dispatch)
        .toHaveBeenCalledWith(PersistTests());
    });
  });

  describe('ionViewWillEnter', () => {
    it('should setup subscription if merged is present', () => {
      component.merged$ = new Observable<string | boolean>();
      component.ionViewWillEnter();

      expect(component.subscription)
        .toBeDefined();
    });
  });

  describe('ionViewDidLeave', () => {
    it('should unsubscribe from subscription if there is one', () => {
      component.subscription = new Subscription();
      spyOn(component.subscription, 'unsubscribe');
      component.ionViewDidLeave();
      expect(component.subscription.unsubscribe)
        .toHaveBeenCalled();
    });
  });

  describe('displayForCategory', () => {
    [
      TestCategory.ADI2,
      TestCategory.ADI3,
      TestCategory.SC,
      TestCategory.CM, TestCategory.C1M, TestCategory.CEM, TestCategory.C1EM,
      TestCategory.DM, TestCategory.D1M, TestCategory.DEM, TestCategory.D1EM,
      TestCategory.CCPC, TestCategory.DCPC,
    ].forEach((value) => {
      it(`should return true if the category is ${value}`, () => {
        expect(component.displayForCategory(value))
          .toEqual(true);
      });
    });
    it('should return false if the category passed in is not present in the function check-list', () => {
      expect(component.displayForCategory(TestCategory.A))
        .toEqual(false);
    });
  });

  describe('displayD255', () => {
    [
      TestCategory.ADI2,
      TestCategory.ADI3,
      TestCategory.SC,
      TestCategory.CM, TestCategory.C1M, TestCategory.CEM, TestCategory.C1EM,
      TestCategory.DM, TestCategory.D1M, TestCategory.DEM, TestCategory.D1EM,
      TestCategory.CCPC, TestCategory.DCPC,
    ].forEach((value) => {
      it(`should return true if the category is ${value}`, () => {
        expect(component.displayD255(value))
          .toEqual(true);
      });
    });
    it('should return false if the category passed in is not present in the function check-list', () => {
      expect(component.displayD255(TestCategory.A))
        .toEqual(false);
    });
  });

  describe('backButtonClick', () => {
    it('should dispatch BackButtonClick', () => {
      component.backButtonClick();
      expect(component.store$.dispatch)
        .toHaveBeenCalledWith(BackButtonClick());
    });
  });

  describe('goBackToDebrief', () => {
    it('should dispatch BackToDebrief', async () => {
      spyOn(component.navController, 'navigateBack')
        .and
        .callThrough();
      await component.goBackToDebrief();

      expect(component.store$.dispatch)
        .toHaveBeenCalledWith(BackToDebrief());
      expect(component.navController.navigateBack)
        .toHaveBeenCalledWith(TestFlowPageNames.DEBRIEF_PAGE);
    });
  });

  describe('isADI3', () => {
    [TestCategory.ADI3,
      TestCategory.SC,
    ].forEach((value) => {
      it(`should return true if category is ${value}`, () => {
        expect(component.isADI3(value))
          .toEqual(true);
      });
    });
    it('should return false if category is B', () => {
      expect(component.isADI3(TestCategory.B))
        .toEqual(false);
    });
  });
});
