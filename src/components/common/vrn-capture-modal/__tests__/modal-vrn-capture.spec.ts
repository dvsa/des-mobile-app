import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VRNCaptureModal } from '@components/common/vrn-capture-modal/vrn-capture-modal';
import { ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/index.mock';
import { Store } from '@ngrx/store';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('VRNCaptureModal', () => {
  let fixture: ComponentFixture<VRNCaptureModal>;
  let component: VRNCaptureModal;

  class StoreMock {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, CommonModule, VRNCaptureModal],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: Store, useClass: StoreMock },
      ],
    });

    fixture = TestBed.createComponent(VRNCaptureModal);
    component = fixture.componentInstance;
  });

  describe('class', () => {
    it('should create without an AppComponent provider', () => {
      expect(component).toBeTruthy();
    });

    describe('validateThenDismiss', () => {
      it('should test the parameter against the validation before saving', () => {
        vi.spyOn(component.registrationNumberValidator.pattern, 'test').mockReturnValue(undefined);
        component.vehicleRegistrationNumber = 'X12345X';
        component.validateThenDismiss();
        expect(component.registrationNumberValidator.pattern.test).toHaveBeenCalledWith('X12345X');
      });
      it('should call modalController.dismiss after being passed a valid parameter', () => {
        vi.spyOn(component.modalController, 'dismiss').mockReturnValue(undefined);
        component.vehicleRegistrationNumber = 'X12345X';
        component.validateThenDismiss();
        expect(component.modalController.dismiss).toHaveBeenCalledWith({ vehicleRegNumber: 'X12345X' });
      });
      it('should not call modalController.dismiss when passed an invalid parameter', () => {
        vi.spyOn(component.modalController, 'dismiss').mockReturnValue(undefined);
        component.vehicleRegistrationNumber = 'X123456X';
        component.validateThenDismiss();
        expect(component.modalController.dismiss).not.toHaveBeenCalled();
      });
    });
    describe('inputChange', () => {
      it('should mark the form as invalid if passed an invalid vrn', () => {
        component.formInvalid = false;
        component.vehicleRegistrationFormControl.markAsDirty();
        component.inputChange('X123456X');
        expect(component.formInvalid).toEqual(true);
      });
    });
  });
});
