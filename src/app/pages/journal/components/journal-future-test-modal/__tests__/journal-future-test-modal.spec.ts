import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule, NavParams, ModalController } from '@ionic/angular';
import { ModalControllerMock, NavParamsMock } from '@mocks/index.mock';
import { By } from '@angular/platform-browser';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { ComponentsModule } from '@components/common/common-components.module';
import { LogHelper } from '@providers/logs/logs-helper';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { JournalFutureTestModal } from '../journal-future-test-modal';
import { ModalEvent } from '@pages/journal/components/journal-rekey-modal/journal-rekey-modal.constants';

describe('JournalRekeyModal', () => {
  let fixture: ComponentFixture<JournalFutureTestModal>;
  let component: JournalFutureTestModal;
  let modalController: ModalController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        JournalFutureTestModal,
      ],
      imports: [
        IonicModule,
        ComponentsModule,
      ],
      providers: [
        { provide: NavParams, useClass: NavParamsMock },
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: DeviceProvider, useClass: DeviceProviderMock },
        { provide: LogHelper, useClass: LogHelperMock },
      ],
    });

    fixture = TestBed.createComponent(JournalFutureTestModal);
    modalController = TestBed.inject(ModalController);
    component = fixture.componentInstance;
  }));

  describe('DOM', () => {
    it('should call onStartTest when the Start test button is clicked', () => {
      fixture.detectChanges();
      spyOn(component, 'onStartTest');
      const button = fixture.debugElement.query(By.css('ion-button.cancel-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onStartTest).toHaveBeenCalled();
    });

    it('should call onCancel when the Cancel button is clicked', () => {
      fixture.detectChanges();
      spyOn(component, 'onCancel');
      const button = fixture.debugElement.query(By.css('ion-button.start-test-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onCancel).toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('should call dismiss with CANCEL', async () => {
      spyOn(modalController, 'dismiss').and.callThrough();
      await component.onCancel();
      expect(modalController.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
    });
  });
  describe('onStartTest', () => {
    it('should call dismiss with START', async () => {
      spyOn(modalController, 'dismiss').and.callThrough();
      await component.onStartTest();
      expect(modalController.dismiss).toHaveBeenCalledWith(ModalEvent.START);
    });
  });
});
