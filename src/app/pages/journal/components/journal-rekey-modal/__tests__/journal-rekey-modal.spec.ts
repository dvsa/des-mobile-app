import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule, NavParams, ModalController } from '@ionic/angular';
import { NavParamsMock } from 'ionic-mocks';
import { By } from '@angular/platform-browser';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { configureTestSuite } from 'ng-bullet';
import { ComponentsModule } from '@components/common/common-components.module';
import { LogHelper } from '@providers/logs/logs-helper';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { JournalRekeyModal } from '../journal-rekey-modal';

describe('JournalRekeyModal', () => {
  let fixture: ComponentFixture<JournalRekeyModal>;
  let component: JournalRekeyModal;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        JournalRekeyModal,
      ],
      imports: [
        IonicModule,
        ComponentsModule,
      ],
      providers: [
        { provide: NavParams, useFactory: () => NavParamsMock.instance() },
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: DeviceProvider, useClass: DeviceProviderMock },
        { provide: LogHelper, useClass: LogHelperMock },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(JournalRekeyModal);
    component = fixture.componentInstance;
    component.onStartTest = async () => {};
    component.onRekeyTest = async () => {};
    component.onCancel = async () => {};
  }));

  describe('DOM', () => {
    it('should call onStartTest when the Start test button is clicked', () => {
      fixture.detectChanges();
      spyOn(component, 'onStartTest');
      const button = fixture.debugElement.query(By.css('ion-button.start-test-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onStartTest).toHaveBeenCalled();
    });

    it('should call onRekeyTest when the Rekey a paper test button is clicked', () => {
      fixture.detectChanges();
      spyOn(component, 'onRekeyTest');
      const button = fixture.debugElement.query(By.css('ion-button.rekey-test-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onRekeyTest).toHaveBeenCalled();
    });

    it('should call onCancel when the Cancel button is clicked', () => {
      fixture.detectChanges();
      spyOn(component, 'onCancel');
      const button = fixture.debugElement.query(By.css('ion-button.cancel-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onCancel).toHaveBeenCalled();
    });
  });
});
