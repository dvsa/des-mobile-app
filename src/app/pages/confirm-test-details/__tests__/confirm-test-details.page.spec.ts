import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { TranslateModule } from '@ngx-translate/core';
import { TestSlotAttributes } from '@dvsa/mes-test-schema/categories/common';
import { configureTestSuite } from 'ng-bullet';
import {
  AlertController,
  IonicModule,
  NavController,
  Platform,
} from '@ionic/angular';
import { AppModule } from 'src/app/app.module';
import { ComponentsModule } from '@components/common/common-components.module';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { NavControllerMock, PlatformMock } from 'ionic-mocks';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { Subscription } from 'rxjs';
import { TestOutcome } from '@store/tests/tests.constants';
import { PersistTests } from '@store/tests/tests.actions';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { SetTestStatusWriteUp } from '@store/tests/test-status/test-status.actions';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConfirmTestDetailsPage } from '../confirm-test-details.page';
import { ConfirmTestDetailsViewDidEnter } from '../confirm-test-details.actions';
import { ActivityCodeModel } from '../../office/components/activity-code/activity-code.constants';
import { TestFlowPageNames } from '../../page-names.constants';

describe('ConfirmTestDetailsPage', () => {
  let fixture: ComponentFixture<ConfirmTestDetailsPage>;
  let component: ConfirmTestDetailsPage;
  let store$: Store<StoreModel>;
  let router: Router;

  const mockAlertCtrl = {
    create: () => {
      return {
        present: () => {
        },
      };
    },
  };

  const testSlotAttributes: TestSlotAttributes = {
    welshTest: false,
    extendedTest: false,
    slotId: 123,
    specialNeeds: false,
    start: '',
    vehicleTypeCode: '',
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        ConfirmTestDetailsPage,
      ],
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
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: NavController, useFactory: () => NavControllerMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: AlertController, useValue: mockAlertCtrl },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ConfirmTestDetailsPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch').and.callThrough();
    component.subscription = new Subscription();
  }));

  describe('ionViewDidEnter', () => {
    it('should dispatch ConfirmTestDetailsViewDidEnter and call backButtonClick', () => {
      component.ionViewDidEnter();
      expect(store$.dispatch).toHaveBeenCalledWith(ConfirmTestDetailsViewDidEnter());
    });
  });

  describe('isTerminated', () => {
    it('should return true if test outcome is terminated', () => {
      expect(component.isTerminated(TestOutcome.Terminated)).toEqual(true);
    });
    it('should return false if test outcome is not terminated', () => {
      expect(component.isTerminated(TestOutcome.Passed)).toEqual(false);
    });
  });

  describe('isPassed', () => {
    it('should return true if test outcome is Passed', () => {
      expect(component.isPassed(TestOutcome.Passed)).toEqual(true);
    });
    it('should return false if test outcome is not Passed', () => {
      expect(component.isPassed(TestOutcome.Terminated)).toEqual(false);
    });
  });

  describe('getActivityCode', () => {
    it('should return true if test outcome is Passed', () => {
      const activityCode = {
        activityCode: '1',
      } as ActivityCodeModel;
      expect(component.getActivityCode(activityCode)).toEqual('1');
    });
  });

  describe('getProvisionalText', () => {
    it('should return appropriate string if true', () => {
      expect(component.getProvisionalText(true)).toEqual('Yes - Please retain the candidates licence');
    });
    it('should return appropriate string if false', () => {
      // tslint:disable-next-line:max-line-length
      expect(component.getProvisionalText(false))
        .toEqual('No - Please ensure that the licence is kept by the candidate');
    });
  });

  describe('getD255Text', () => {
    it('should return appropriate string if true', () => {
      expect(component.getD255Text(true)).toEqual('Yes - Please complete a D255');
    });
    it('should return appropriate string if false', () => {
      expect(component.getD255Text(false)).toEqual('No');
    });
  });

  describe('onSubmit', () => {
    it('should call showConfirmTestDetailsModal', async () => {
      spyOn(component, 'showConfirmTestDetailsModal');
      await component.onSubmit();
      expect(component.showConfirmTestDetailsModal).toHaveBeenCalled();
    });
  });

  describe('showConfirmTestDetailsModal', () => {
    it('should call alertController.create', async () => {
      spyOn(component.alertController, 'create').and.callThrough();
      await component.showConfirmTestDetailsModal();
      expect(component.alertController.create).toHaveBeenCalled();
    });
  });

  describe('onTestDetailsConfirm', () => {
    it('should call device auth provider triggerLockScreen', async () => {
      component.testOutcome = TestOutcome.Passed;
      component.slotId = '123';
      spyOn(router, 'navigate');
      await component.onTestDetailsConfirm();
      expect(router.navigate).toHaveBeenCalledWith([TestFlowPageNames.BACK_TO_OFFICE_PAGE], { replaceUrl: true });
    });

    it('should call dispatch for  PersistTests', async () => {
      component.testOutcome = TestOutcome.Passed;
      component.slotId = '123';
      await component.onTestDetailsConfirm();
      expect(store$.dispatch).toHaveBeenCalledWith(SetTestStatusWriteUp('123'));
      expect(store$.dispatch).toHaveBeenCalledWith(PersistTests());
    });
  });

  describe('ionViewDidLeave', () => {
    it('should unsubscribe when subscription', () => {
      component.subscription = new Subscription();
      spyOn(component.subscription, 'unsubscribe');
      component.ionViewDidLeave();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('isADI2', () => {
    it('should return true if test outcome is Passed', () => {
      expect(component.isADI2(TestCategory.ADI2)).toEqual(true);
    });
    it('should return false if test outcome is not Passed', () => {
      expect(component.isADI2(TestCategory.B)).toEqual(false);
    });
  });

});
