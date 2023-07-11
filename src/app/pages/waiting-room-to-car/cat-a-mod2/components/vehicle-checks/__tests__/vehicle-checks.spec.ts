import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/index.mock';
import { MockComponent } from 'ng-mocks';
import { Store } from '@ngrx/store';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import {
  VehicleChecksCatAMod2Modal,
} from '@pages/waiting-room-to-car/cat-a-mod2/components/vehicle-checks-modal/vehicle-checks-modal.cat-a-mod2.page';
import { OverlayEventDetail } from '@ionic/core';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { AccessibilityServiceMock } from '@providers/accessibility/__mocks__/accessibility-service.mock';
import { VehicleChecksCatAMod2Component } from '../vehicle-checks';

class MockStore { }

describe('VehicleChecksCatAMod2Component', () => {
  let fixture: ComponentFixture<VehicleChecksCatAMod2Component>;
  let component: VehicleChecksCatAMod2Component;
  let modalController: ModalController;
  let accessibilityService: AccessibilityService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        VehicleChecksCatAMod2Component,
        MockComponent(SeriousFaultBadgeComponent),
        MockComponent(DrivingFaultsBadgeComponent),
        MockComponent(TickIndicatorComponent),
      ],
      imports: [IonicModule],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: AccessibilityService, useClass: AccessibilityServiceMock },
        { provide: Store, useClass: MockStore },
      ],
    });

    fixture = TestBed.createComponent(VehicleChecksCatAMod2Component);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    modalController = TestBed.inject(ModalController);
    accessibilityService = TestBed.inject(AccessibilityService);

    spyOn(accessibilityService, 'getTextZoomClass').and.returnValue('regular');
    spyOn(modalController, 'create').and.returnValue(Promise.resolve({
      present: async () => {},
      onDidDismiss: () => ({ data: '' }) as OverlayEventDetail,
    } as HTMLIonModalElement));
  }));

  describe('Class', () => {
    describe('openVehicleChecksModal', () => {
      it('should call through to the create method of modalController', async () => {
        await component.openVehicleChecksModal();
        expect(modalController.create).toHaveBeenCalledWith({
          component: VehicleChecksCatAMod2Modal,
          componentProps: { zoom: component['accessibilityService'].getTextZoomClass() },
          cssClass: 'modal-fullscreen regular',
        });
      });
      it('should emit onCloseVehicleChecksModal when onDidDismiss', async () => {
        spyOn(component.onCloseVehicleChecksModal, 'emit');
        await component.openVehicleChecksModal();
        expect(component.onCloseVehicleChecksModal.emit).toHaveBeenCalled();
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
        const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();
        component.formGroup = formBuilder.group({
          vehicleChecksSelectQuestions: null,
        });
        spyOn(component, 'everyQuestionHasOutcome').and.returnValue(true);
        component.ngOnChanges();
        const result = component.formGroup.contains('vehicleChecksSelectQuestions');
        expect(result).toEqual(true);
      });

      it('should validate the vehicle checks', () => {
        const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();
        component.formGroup = formBuilder.group({
          vehicleChecksSelectQuestions: null,
        });
        spyOn(component, 'everyQuestionHasOutcome').and.returnValue(true);
        spyOn(component, 'validateVehicleChecks');
        component.ngOnChanges();
        expect(component.validateVehicleChecks).toHaveBeenCalled();
      });

      it('should patch the form control value', () => {
        const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();
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
