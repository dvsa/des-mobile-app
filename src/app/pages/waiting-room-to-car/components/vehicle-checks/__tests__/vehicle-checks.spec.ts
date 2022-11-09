import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {
  Config, IonicModule, ModalController, NavParams,
} from '@ionic/angular';
import { ConfigMock, ModalControllerMock, NavParamsMock } from 'ionic-mocks';
import { AppComponent } from '@app/app.component';
import { Store, StoreModule } from '@ngrx/store';
import { MockAppComponent } from '@app/__mocks__/app.component.mock';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { testsReducer } from '@store/tests/tests.reducer';
import { StartTest } from '@store/tests/tests.actions';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { StoreModel } from '@shared/models/store.model';
import { configureTestSuite } from 'ng-bullet';
import {
  VehicleChecksCatCModal,
} from '@pages/waiting-room-to-car/cat-c/components/vehicle-checks-modal/vehicle-checks-modal.cat-c.page';
import { OverlayEventDetail } from '@ionic/core';
import {
  VehicleChecksCatDModal,
} from '@pages/waiting-room-to-car/cat-d/components/vehicle-checks-modal/vehicle-checks-modal.cat-d.page';
import {
  VehicleChecksCatHomeTestModal,
} from '@pages/waiting-room-to-car/cat-home-test/components/vehicle-checks-modal/vehicle-checks-modal.cat-home.page';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import { SafetyQuestionsScore } from '@shared/models/safety-questions-score.model';
import { VehicleChecksCatADIPart2Modal }
  from '../../../cat-adi-part2/components/vehicle-checks-modal/vehicle-checks-modal.cat-adi-part2.page';
import { VehicleChecksComponent } from '../vehicle-checks';

describe('VehicleChecksComponent', () => {
  let fixture: ComponentFixture<VehicleChecksComponent>;
  let component: VehicleChecksComponent;
  let modalController: ModalController;
  let store$: Store<StoreModel>;
  let appComponent: AppComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        VehicleChecksComponent,
        SeriousFaultBadgeComponent,
        DrivingFaultsBadgeComponent,
        TickIndicatorComponent,
      ],
      imports: [
        IonicModule,
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        {
          provide: ModalController,
          useFactory: () => ModalControllerMock.instance(),
        },
        {
          provide: AppComponent,
          useClass: MockAppComponent,
        },
        {
          provide: Config,
          useFactory: () => ConfigMock.instance(),
        },
        {
          provide: NavParams,
          useFactory: () => NavParamsMock.instance(),
        },
        Store,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(VehicleChecksComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    modalController = TestBed.inject(ModalController);
    store$ = TestBed.inject(Store);
    appComponent = TestBed.inject(AppComponent);
  }));

  describe('Class', () => {
    describe('openVehicleChecksModal', () => {
      it('should create the correct model', async () => {
        spyOn(appComponent, 'getTextZoomClass')
          .and
          .returnValue('regular');
        component.category = TestCategory.C1E;
        await component.openVehicleChecksModal();
        expect(modalController.create)
          .toHaveBeenCalledTimes(1);
        expect(modalController.create)
          .toHaveBeenCalledWith({
            component: VehicleChecksCatCModal,
            componentProps: { category: TestCategory.C1E },
            cssClass: 'modal-fullscreen regular',
          });
      });
      it('should emit onCloseVehicleChecksModal when onDidDismiss', async () => {
        spyOn(component.onCloseVehicleChecksModal, 'emit');
        spyOn(modalController, 'create')
          .and
          .returnValue(Promise.resolve({
            present: async () => {
            },
            onDidDismiss: () => ({ data: '' }) as OverlayEventDetail,
          } as HTMLIonModalElement));
        component.category = TestCategory.C1E;
        await component.openVehicleChecksModal();
        expect(component.onCloseVehicleChecksModal.emit)
          .toHaveBeenCalled();
      });
    });
    describe('hasSeriousFault', () => {
      it('should return true if vehicle checks score has serious fault', () => {
        store$.dispatch(StartTest(12345, TestCategory.C));
        component.vehicleChecksScore = {
          seriousFaults: 1,
          drivingFaults: 4,
        };
        expect(component.hasSeriousFault())
          .toBeTruthy();
      });

      it('should return false if vehicle checks score does not have serious fault', () => {
        store$.dispatch(StartTest(12345, TestCategory.C));
        component.vehicleChecksScore = {
          seriousFaults: 0,
          drivingFaults: 3,
        };
        expect(component.hasSeriousFault())
          .toBeFalsy();
      });
    });

    describe('getVehicleCheckModal', () => {
      it('should return an error on default', () => {
        expect(() => {
          component.category = TestCategory.A;
          component.getVehicleCheckModal();
        })
          .toThrowError('Cannot getVehicleCheckModal for category A');
      });
      it('should return VehicleChecksCatADIPart2Modal for ADI2', () => {
        component.category = TestCategory.ADI2;
        expect(component.getVehicleCheckModal())
          .toEqual(VehicleChecksCatADIPart2Modal);
      });
      [TestCategory.C, TestCategory.C1, TestCategory.CE, TestCategory.C1E].forEach((category) => {
        it(`should return VehicleChecksCatCModal for Cat${category}`, () => {
          component.category = category;
          expect(component.getVehicleCheckModal())
            .toEqual(VehicleChecksCatCModal);
        });
      });
      [TestCategory.F, TestCategory.G, TestCategory.H, TestCategory.K].forEach((category) => {
        it('should return VehicleChecksCatHomeTestModal for Home Test', () => {
          component.category = category;
          expect(component.getVehicleCheckModal())
            .toEqual(VehicleChecksCatHomeTestModal);
        });
      });
      [TestCategory.D, TestCategory.D1, TestCategory.DE, TestCategory.D1E].forEach((category) => {
        it(`should return VehicleChecksCatDModal for Cat${category}`, () => {
          component.category = category;
          expect(component.getVehicleCheckModal())
            .toEqual(VehicleChecksCatDModal);
        });
      });
    });

    describe('hasDrivingFault', () => {
      it('should return true when Cat D and vehicleChecksScore has a drivingFault', () => {
        component.category = TestCategory.D;
        component.vehicleChecksScore = { drivingFaults: 1 } as VehicleChecksScore;
        component.safetyQuestionsScore = { drivingFaults: 0 } as SafetyQuestionsScore;
        expect(component.hasDrivingFault())
          .toEqual(true);
      });
      it('should return true when Cat D and safetyQuestionsScore has a drivingFault', () => {
        component.category = TestCategory.D;
        component.vehicleChecksScore = { drivingFaults: 0 } as VehicleChecksScore;
        component.safetyQuestionsScore = { drivingFaults: 1 } as SafetyQuestionsScore;
        expect(component.hasDrivingFault())
          .toEqual(true);
      });
      it('should return false when Cat B and vehicleChecksScore has no drivingFaults', () => {
        component.category = TestCategory.B;
        component.vehicleChecksScore = { drivingFaults: 0 } as VehicleChecksScore;
        expect(component.hasDrivingFault())
          .toEqual(false);
      });

      it('should return true if vehicle checks score has driving fault', () => {
        store$.dispatch(StartTest(12345, TestCategory.C));
        component.vehicleChecksScore = {
          seriousFaults: 0,
          drivingFaults: 1,
        };
        expect(component.hasDrivingFault())
          .toBeTruthy();
      });

      it('should return false if vehicle checks score does not have driving fault', () => {
        store$.dispatch(StartTest(12345, TestCategory.C));
        component.vehicleChecksScore = {
          seriousFaults: 0,
          drivingFaults: 0,
        };
        expect(component.hasDrivingFault())
          .toBeFalsy();
      });
    });

    describe('everyQuestionHasOutcome', () => {
      it('should return false when not all show me and tell me questions have outcome', () => {
        store$.dispatch(StartTest(12345, TestCategory.C));
        component.vehicleChecks = {
          showMeQuestions: [{}, {}, {}],
          tellMeQuestions: [{}, {}],
        };
        expect(component.everyQuestionHasOutcome())
          .toBeFalsy();
      });

      it('should return false when not all show me questions have outcome', () => {
        store$.dispatch(StartTest(12345, TestCategory.C));
        component.vehicleChecks = {
          showMeQuestions: [{}, {}, {}],
          tellMeQuestions: [{ outcome: 'P' }, { outcome: 'DF' }],
        };
        expect(component.everyQuestionHasOutcome())
          .toBeFalsy();
      });

      it('should return false when not all tell me questions have outcome', () => {
        store$.dispatch(StartTest(12345, TestCategory.C));
        component.vehicleChecks = {
          showMeQuestions: [{ outcome: 'P' }, { outcome: 'DF' }, { outcome: 'P' }],
          tellMeQuestions: [{}, {}],
        };
        expect(component.everyQuestionHasOutcome())
          .toBeFalsy();
      });

      it('should return true when all show / tell me questions have outcome', () => {
        store$.dispatch(StartTest(12345, TestCategory.C));
        component.vehicleChecks = {
          showMeQuestions: [{ outcome: 'P' }, { outcome: 'DF' }, { outcome: 'P' }],
          tellMeQuestions: [{ outcome: 'P' }, { outcome: 'DF' }],
        };

        component.safetyQuestions = { questions: [{ outcome: 'P' }, { outcome: 'P' }, { outcome: 'P' }] };
        expect(component.everyQuestionHasOutcome())
          .toBeTruthy();
      });
    });

    describe('incompleteVehicleChecks', () => {
      it('should return vehicle checks as false', () => {
        store$.dispatch(StartTest(12345, TestCategory.C));
        const result = component.incompleteVehicleChecks();
        expect(result)
          .toEqual({ vehicleChecks: false });
      });
    });

    describe('validateVehicleChecks', () => {
      it('should call incompleteVehicleChecks() if all questions have NOT been answered', () => {
        store$.dispatch(StartTest(12345, TestCategory.C));
        spyOn(component, 'everyQuestionHasOutcome')
          .and
          .returnValue(false);
        spyOn(component, 'incompleteVehicleChecks');
        component.validateVehicleChecks();
        expect(component.incompleteVehicleChecks)
          .toHaveBeenCalled();
      });

      it('should return null if all questions have been answered', () => {
        store$.dispatch(StartTest(12345, TestCategory.C));
        spyOn(component, 'everyQuestionHasOutcome')
          .and
          .returnValue(true);
        spyOn(component, 'incompleteVehicleChecks');
        const result = component.validateVehicleChecks();
        expect(result)
          .toEqual(null);
      });
    });

    describe('invalid', () => {
      beforeEach(() => {
        store$.dispatch(StartTest(12345, TestCategory.C));
        const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();
        component.formGroup = formBuilder.group({
          vehicleChecksSelectQuestions: null,
        });
        component.formControl = formBuilder.control({});
      });

      describe('when form is dirty', () => {
        it('should return TRUE if the form control is invalid', () => {
          component.formControl.markAsDirty();
          component.formControl.setErrors({ vehicleChecks: false });
          const result = component.invalid;
          expect(result)
            .toEqual(true);
        });

        it('should return FALSE if the form control is valid', () => {
          component.formControl.markAsDirty();
          const result = component.invalid;
          expect(result)
            .toEqual(false);
        });
      });

      describe('when form is NOT dirty', () => {
        it('should return FALSE if the form control is invalid', () => {
          component.formControl.markAsPristine();
          const result = component.invalid;
          expect(result)
            .toEqual(false);
        });
      });
    });

    describe('ngOnChanges', () => {
      it('should add the form control', () => {
        const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();
        component.formGroup = formBuilder.group({
          vehicleChecksSelectQuestions: null,
        });
        spyOn(component, 'everyQuestionHasOutcome')
          .and
          .returnValue(true);
        component.ngOnChanges();
        const result = component.formGroup.contains('vehicleChecksSelectQuestions');
        expect(result)
          .toEqual(true);
      });

      it('should validate the vehicle checks', () => {
        const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();
        component.formGroup = formBuilder.group({
          vehicleChecksSelectQuestions: null,
        });
        spyOn(component, 'everyQuestionHasOutcome')
          .and
          .returnValue(true);
        spyOn(component, 'validateVehicleChecks');
        component.ngOnChanges();
        expect(component.validateVehicleChecks)
          .toHaveBeenCalled();
      });

      it('should patch the form control value', () => {
        const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();
        component.formGroup = formBuilder.group({
          vehicleChecksSelectQuestions: null,
        });
        component.formControl = formBuilder.control({});
        component.ngOnChanges();
        expect(component.formControl.value)
          .toEqual('Select questions');
      });
    });
  });
});
