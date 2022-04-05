import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonicModule, ModalController, Config } from '@ionic/angular';
import { ModalControllerMock, ConfigMock } from 'ionic-mocks';
import { AppComponent } from '@app/app.component';
import { Store } from '@ngrx/store';
import { MockAppComponent } from '@app/__mocks__/app.component.mock';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { configureTestSuite } from 'ng-bullet';
import {
  VehicleChecksCatAMod2Modal,
} from '@pages/waiting-room-to-car/cat-a-mod2/components/vehicle-checks-modal/vehicle-checks-modal.cat-a-mod2.page';
import { VehicleChecksCatAMod2Component } from '../vehicle-checks';

class MockStore { }

describe('VehicleChecksCatAMod2Component', () => {
  let fixture: ComponentFixture<VehicleChecksCatAMod2Component>;
  let component: VehicleChecksCatAMod2Component;
  let modalController: ModalController;
  let appComponent: AppComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        VehicleChecksCatAMod2Component,
        SeriousFaultBadgeComponent,
        DrivingFaultsBadgeComponent,
        TickIndicatorComponent,
      ],
      imports: [
        IonicModule,
      ],
      providers: [
        { provide: ModalController, useFactory: () => ModalControllerMock.instance() },
        { provide: AppComponent, useClass: MockAppComponent },
        { provide: Store, useClass: MockStore },
        { provide: Config, useFactory: () => ConfigMock.instance() },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(VehicleChecksCatAMod2Component);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
    modalController = TestBed.inject(ModalController);
    appComponent = TestBed.inject(AppComponent);
  }));

  describe('Class', () => {
    describe('openVehicleChecksModal', () => {
      it('should create the correct model', async () => {
        spyOn(appComponent, 'getTextZoomClass').and.returnValue('regular');
        await component.openVehicleChecksModal();
        expect(modalController.create).toHaveBeenCalledTimes(1);
        expect(modalController.create).toHaveBeenCalledWith({
          component: VehicleChecksCatAMod2Modal,
          cssClass: 'modal-fullscreen regular',
        });
      });
    });

    describe('hasRidingFault', () => {
      it('should return true if safety and balance score has riding fault', () => {
        component.safetyAndBalanceQuestionsScore = {
          drivingFaults: 1,
        };
        expect(component.hasDrivingFault()).toBeTruthy();
      });

      it('should return false if safety and balance score does not have riding fault', () => {
        component.safetyAndBalanceQuestionsScore = {
          drivingFaults: 0,
        };
        expect(component.hasDrivingFault()).toBeFalsy();
      });
    });

    describe('everyQuestionHasOutcome', () => {
      it('should return false when not all safety and balance questions have outcome', () => {
        component.safetyAndBalanceQuestions = {
          safetyQuestions: [{}, {}, {}],
          balanceQuestions: [{}, {}],
        };
        expect(component.everyQuestionHasOutcome()).toBeFalsy();
      });

      it('should return false when not all safety questions have outcome', () => {
        component.safetyAndBalanceQuestions = {
          safetyQuestions: [{}, {}, {}],
          balanceQuestions: [{ outcome: 'P' }, { outcome: 'DF' }],
        };
        expect(component.everyQuestionHasOutcome()).toBeFalsy();
      });

      it('should return false when not all balance questions have outcome', () => {
        component.safetyAndBalanceQuestions = {
          safetyQuestions: [{ outcome: 'P' }, { outcome: 'DF' }, { outcome: 'P' }],
          balanceQuestions: [{}, {}],
        };
        expect(component.everyQuestionHasOutcome()).toBeFalsy();
      });

      it('should return true when all safety and balance questions have outcome', () => {
        component.safetyAndBalanceQuestions = {
          safetyQuestions: [{ outcome: 'P' }, { outcome: 'DF' }, { outcome: 'P' }],
          balanceQuestions: [{ outcome: 'P' }, { outcome: 'DF' }],
        };
        expect(component.everyQuestionHasOutcome()).toBeTruthy();
      });
    });

    describe('incompleteVehicleChecks', () => {
      it('should return vehicle checks as false', () => {
        const result = component.incompleteVehicleChecks();
        expect(result).toEqual({ vehicleChecks: false });
      });
    });

    describe('validateVehicleChecks', () => {
      it('should call incompleteVehicleChecks() if all questions have NOT been answered', () => {
        spyOn(component, 'everyQuestionHasOutcome').and.returnValue(false);
        spyOn(component, 'incompleteVehicleChecks');
        component.validateVehicleChecks();
        expect(component.incompleteVehicleChecks).toHaveBeenCalled();
      });

      it('should return null if all questions have been answered', () => {
        spyOn(component, 'everyQuestionHasOutcome').and.returnValue(true);
        spyOn(component, 'incompleteVehicleChecks');
        const result = component.validateVehicleChecks();
        expect(result).toEqual(null);
      });
    });

    describe('invalid', () => {
      beforeEach(() => {
        const formBuilder: FormBuilder = new FormBuilder();
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
          expect(result).toEqual(true);
        });

        it('should return FALSE if the form control is valid', () => {
          component.formControl.markAsDirty();
          const result = component.invalid;
          expect(result).toEqual(false);
        });
      });

      describe('when form is NOT dirty', () => {
        it('should return FALSE if the form control is invalid', () => {
          component.formControl.markAsPristine();
          const result = component.invalid;
          expect(result).toEqual(false);
        });
      });
    });

    describe('ngOnChanges', () => {
      it('should add the form control', () => {
        const formBuilder: FormBuilder = new FormBuilder();
        component.formGroup = formBuilder.group({
          vehicleChecksSelectQuestions: null,
        });
        spyOn(component, 'everyQuestionHasOutcome').and.returnValue(true);
        component.ngOnChanges();
        const result = component.formGroup.contains('vehicleChecksSelectQuestions');
        expect(result).toEqual(true);
      });

      it('should validate the vehicle checks', () => {
        const formBuilder: FormBuilder = new FormBuilder();
        component.formGroup = formBuilder.group({
          vehicleChecksSelectQuestions: null,
        });
        spyOn(component, 'everyQuestionHasOutcome').and.returnValue(true);
        spyOn(component, 'validateVehicleChecks');
        component.ngOnChanges();
        expect(component.validateVehicleChecks).toHaveBeenCalled();
      });

      it('should patch the form control value', () => {
        const formBuilder: FormBuilder = new FormBuilder();
        component.formGroup = formBuilder.group({
          vehicleChecksSelectQuestions: null,
        });
        component.formControl = formBuilder.control({});
        component.ngOnChanges();
        expect(component.formControl.value).toEqual('Select questions');
      });
    });
  });
});
