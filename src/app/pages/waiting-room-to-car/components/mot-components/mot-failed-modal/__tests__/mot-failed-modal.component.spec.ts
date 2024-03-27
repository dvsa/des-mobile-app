import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UntypedFormControl } from '@angular/forms';
import { MotFailedModal } from '../mot-failed-modal.component';

describe('MotFailedModal', () => {
  let component: MotFailedModal;
  let fixture: ComponentFixture<MotFailedModal>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MotFailedModal],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(MotFailedModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe('onConfirm', () => {
    it('should call dismiss with an uppercase version of the data inputted into the modal', () => {
      spyOn(component.modalCtrl, 'dismiss');
      component.formControl = new UntypedFormControl('string');
      component.onConfirm();
      expect(component.modalCtrl.dismiss).toHaveBeenCalledWith('STRING');
    });
  });
  describe('vehicleRegistrationChanged', () => {
    it('should set vehicleRegistration to an uppercase version of the data inputted into the modal', () => {
      component.vehicleRegistration = '';
      component.vehicleRegistrationChanged({ target: { value: 'string' } });
      expect(component.vehicleRegistration).toEqual('STRING');
    });
    it('should remove all non alphanumeric characters from the passed parameter', () => {
      component.vehicleRegistration = '';
      component.vehicleRegistrationChanged({ target: { value: '!s!t!r!i!n!g!' } });
      expect(component.vehicleRegistration).toEqual('STRING');
    });
  });
});
