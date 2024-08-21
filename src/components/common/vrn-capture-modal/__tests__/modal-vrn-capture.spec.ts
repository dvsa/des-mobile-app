import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockAppComponent } from '@app/__mocks__/app.component.mock';
import { AppComponent } from '@app/app.component';
import { VRNCaptureModal } from '@components/common/vrn-capture-modal/vrn-capture-modal';
import { IonicModule, NavParams } from '@ionic/angular';
import { NavParamsMock } from '@mocks/index.mock';
import { Store } from '@ngrx/store';

describe('VRNCaptureModal', () => {
  let fixture: ComponentFixture<VRNCaptureModal>;
  let component: VRNCaptureModal;

  class StoreMock {}

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VRNCaptureModal],
      imports: [FormsModule, ReactiveFormsModule, IonicModule, CommonModule],
      providers: [
        { provide: NavParams, useClass: NavParamsMock },
        { provide: Store, useClass: StoreMock },
        { provide: AppComponent, useClass: MockAppComponent },
      ],
    });

    fixture = TestBed.createComponent(VRNCaptureModal);
    component = fixture.componentInstance;
  }));

  describe('class', () => {
    describe('validateThenDismiss', () => {
      it('should test the parameter against the validation before saving', () => {
        spyOn(component.registrationNumberValidator.pattern, 'test');
        component.vehicleRegistrationNumber = 'X12345X';
        component.validateThenDismiss();
        expect(component.registrationNumberValidator.pattern.test).toHaveBeenCalledWith('X12345X');
      });
      it('should call modalController.dismiss after being passed a valid parameter', () => {
        spyOn(component.modalController, 'dismiss');
        component.vehicleRegistrationNumber = 'X12345X';
        component.validateThenDismiss();
        expect(component.modalController.dismiss).toHaveBeenCalledWith({ vehicleRegNumber: 'X12345X' });
      });
      it('should not call modalController.dismiss when passed an invalid parameter', () => {
        spyOn(component.modalController, 'dismiss');
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
