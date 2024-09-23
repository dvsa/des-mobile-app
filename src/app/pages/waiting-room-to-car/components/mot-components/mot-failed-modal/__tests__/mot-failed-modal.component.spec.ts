import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CommonModule } from '@angular/common';
import { UntypedFormControl } from '@angular/forms';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { MockComponent } from 'ng-mocks';
import { MotFailedModal } from '../mot-failed-modal.component';
import {Store, StoreModule} from '@ngrx/store';
import {StoreModel} from '@shared/models/store.model';

describe('MotFailedModal', () => {
  let component: MotFailedModal;
  let fixture: ComponentFixture<MotFailedModal>;
  let store$: Store<StoreModel>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MotFailedModal, MockComponent(ModalAlertTitleComponent)],
      imports: [
        IonicModule,
        CommonModule,
        StoreModule.forRoot(),
      ],
      providers: [
        Store,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MotFailedModal);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    fixture.detectChanges();
  }));

  describe('onConfirm', () => {
    it(
      'should call dismiss with an uppercase version of the data inputted into the modal ' +
        'if the new vrn and the old vrn match',
      () => {
        spyOn(component.modalCtrl, 'dismiss');
        component.formControl = new UntypedFormControl('string');
        component.originalRegistration = 'string';
        component.onConfirm();
        expect(component.modalCtrl.dismiss).toHaveBeenCalledWith('STRING');
      }
    );
    it('should not call and set ifMatches to false if the new vrn and the old vrn do not match', () => {
      spyOn(component.modalCtrl, 'dismiss');
      component.formControl = new UntypedFormControl('aaaaaaaaaa');
      component.originalRegistration = 'string';
      component.onConfirm();
      expect(component.modalCtrl.dismiss).not.toHaveBeenCalled();
      expect(component.ifMatches).toEqual(false);
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
