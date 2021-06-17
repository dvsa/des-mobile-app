import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { VRNCaptureModal } from '@components/common/vrn-capture-modal/vrn-capture-modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavParams } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NavParamsMock } from 'ionic-mocks';

fdescribe('VRNCaptureModal', () => {
  let fixture: ComponentFixture<VRNCaptureModal>;
  let component: VRNCaptureModal;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        VRNCaptureModal,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        CommonModule,
      ],
      providers: [
        { provide: NavParams, useFactory: () => NavParamsMock.instance() },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(VRNCaptureModal);
    component = fixture.componentInstance;
  }));

  describe('class', () => {

    describe('validateThenSave', () => {
      it('should test the parameter against the validation before saving', () => {
        spyOn(component.registrationNumberValidator.pattern, 'test');
        component.vehicleRegistrationNumber = 'X12345X';
        component.validateThenSave();
        expect(component.registrationNumberValidator.pattern.test).toHaveBeenCalledWith('X12345X');
      });
      it('should save after being passed a valid parameter', () => {
        component.onSave = (): void => {};
        spyOn(component, 'onSave');
        component.vehicleRegistrationNumber = 'X12345X';
        component.validateThenSave();
        expect(component.onSave).toHaveBeenCalled();
      });
      it('should not save when passed an invalid parameter', () => {
        component.onSave = (): void => {};
        spyOn(component, 'onSave');
        component.vehicleRegistrationNumber = 'X123456X';
        component.validateThenSave();
        expect(component.onSave).not.toHaveBeenCalled();
      })
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
