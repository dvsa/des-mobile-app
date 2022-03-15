import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { IonicModule, ModalController, Config } from '@ionic/angular';
import { ModalControllerMock, ConfigMock } from 'ionic-mocks';
import { CAT_ADI_PART2 } from '@pages/page-names.constants';
import { AppComponent } from '@app/app.component';
import { Store } from '@ngrx/store';
import { MockAppComponent } from '@app/__mocks__/app.component.mock';
import { SeriousFaultBadgeComponent }
  from '@components/common/serious-fault-badge/serious-fault-badge';
import { DrivingFaultsBadgeComponent }
  from '@components/common/driving-faults-badge/driving-faults-badge';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { configureTestSuite } from 'ng-bullet';
import { VehicleChecksCatADIPart2Component } from '../vehicle-checks.cat-adi-part2';

class MockStore { }

describe('VehicleChecksCatBEComponent', () => {
  let fixture: ComponentFixture<VehicleChecksCatADIPart2Component>;
  let component: VehicleChecksCatADIPart2Component;
  let modalController: ModalController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        VehicleChecksCatADIPart2Component,
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

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VehicleChecksCatADIPart2Component);
    component = fixture.componentInstance;
    modalController = TestBed.get(ModalController);
  }));

  describe('Class', () => {
    describe('openVehicleChecksModal', () => {
      it('should create the correct model', () => {
        component.openVehicleChecksModal();
        expect(modalController.create).toHaveBeenCalledTimes(1);
        expect(modalController.create).toHaveBeenCalledWith(
          CAT_ADI_PART2.VEHICLE_CHECKS_MODAL,
          {},
          { cssClass: 'modal-fullscreen text-zoom-regular' },
        );
      });
    });

    describe('hasSeriousFault', () => {
      it('should return true if vehicle checks score has serious fault', () => {
        component.vehicleChecksScore = {
          seriousFaults: 1,
          drivingFaults: 4,
        };

        expect(component.hasSeriousFault()).toBeTruthy();
      });

      it('should return false if vehicle checks score does not have serious fault', () => {
        component.vehicleChecksScore = {
          seriousFaults: 0,
          drivingFaults: 3,
        };

        expect(component.hasSeriousFault()).toBeFalsy();
      });
    });

    describe('hasDrivingFault', () => {
      it('should return true if vehicle checks score has driving fault', () => {
        component.vehicleChecksScore = {
          seriousFaults: 0,
          drivingFaults: 1,
        };

        expect(component.hasDrivingFault()).toBeTruthy();
      });

      it('should return false if vehicle checks score does not have driving fault', () => {
        component.vehicleChecksScore = {
          seriousFaults: 0,
          drivingFaults: 0,
        };

        expect(component.hasDrivingFault()).toBeFalsy();
      });
    });

    describe('everyQuestionHasOutcome', () => {
      it('should return false when not all tell me questions have outcome', () => {
        component.vehicleChecks = {
          tellMeQuestions: [{}, {}],
        };

        expect(component.everyQuestionHasOutcome()).toBeFalsy();
      });

      it('should return true when all tell me questions have outcome', () => {
        component.vehicleChecks = {
          tellMeQuestions: [{ outcome: 'P' }, { outcome: 'DF' }],
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
        component.validateVehicleChecks(null);
        expect(component.incompleteVehicleChecks).toHaveBeenCalled();
      });

      it('should return null if all questions have been answered', () => {
        spyOn(component, 'everyQuestionHasOutcome').and.returnValue(true);
        spyOn(component, 'incompleteVehicleChecks');
        const result = component.validateVehicleChecks(null);
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
