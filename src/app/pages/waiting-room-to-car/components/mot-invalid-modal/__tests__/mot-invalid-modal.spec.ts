import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';
import { AppModule } from '@app/app.module';
import { MotInvalidModal } from '@pages/waiting-room-to-car/components/mot-invalid-modal/mot-invalid-modal';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';

describe('MotInvalidModal', () => {
  let fixture: ComponentFixture<MotInvalidModal>;
  let component: MotInvalidModal;
  let modalController: ModalController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MotInvalidModal,
        MockComponent(ModalAlertTitleComponent),
      ],
      providers: [
        {
          provide: ModalController,
          useClass: ModalControllerMock,
        },
      ],
      imports: [
        IonicModule,
        AppModule,
      ],
    });

    fixture = TestBed.createComponent(MotInvalidModal);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
  }));

  describe('ngOnInit', () => {
    it('should create component', () => {
      component.ngOnInit();
      expect(component.formGroup.contains('vehicleRegistrationConfirmVrn'))
        .toBe(true);
    });
  });
  describe('onChange', () => {
    beforeEach(() => {
      component.ngOnInit();
      spyOn(component.formControl, 'patchValue');
      spyOn(component.formControl, 'updateValueAndValidity');
    });
    it('should sanitise and uppercase the input', () => {
      component.onChange('some val');
      expect(component.formControl.patchValue)
        .toHaveBeenCalledWith('SOMEVAL');
      expect(component.formControl.updateValueAndValidity)
        .toHaveBeenCalled();
    });
    it('should not patch a null', () => {
      component.onChange(null);
      expect(component.formControl.patchValue)
        .not
        .toHaveBeenCalled();
      expect(component.formControl.updateValueAndValidity)
        .toHaveBeenCalled();
    });
  });
  describe('clickConfirm', () => {
    beforeEach(() => {
      spyOn(modalController, 'dismiss')
        .and
        .returnValue(Promise.resolve(true));
    });
    it('should call dismiss when valid', async () => {
      component.ngOnInit();
      component.formControl.patchValue('ABC123');
      await component.clickConfirm();
      expect(modalController.dismiss)
        .toHaveBeenCalledWith('ABC123');
    });
    it('should not call dismiss when invalid', async () => {
      component.ngOnInit();
      component.formControl.patchValue(null);
      await component.clickConfirm();
      expect(modalController.dismiss)
        .not
        .toHaveBeenCalled();
    });
  });
});
