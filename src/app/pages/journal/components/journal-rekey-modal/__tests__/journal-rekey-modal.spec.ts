import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/index.mock';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DeviceProvider } from '@providers/device/device';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { JournalRekeyModal } from '../journal-rekey-modal';
import { ModalEvent } from '../journal-rekey-modal.constants';

describe('JournalRekeyModal', () => {
  let fixture: ComponentFixture<JournalRekeyModal>;
  let component: JournalRekeyModal;
  let modalController: ModalController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JournalRekeyModal],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: DeviceProvider, useClass: DeviceProviderMock },
        { provide: LogHelper, useClass: LogHelperMock },
      ],
    });

    fixture = TestBed.createComponent(JournalRekeyModal);
    modalController = TestBed.inject(ModalController);
    component = fixture.componentInstance;
  });

  describe('DOM', () => {
    it('should call onStartTest when the Start test button is clicked', () => {
      fixture.detectChanges();
      vi.spyOn(component, 'onStartTest').mockReturnValue(undefined);
      const button = fixture.debugElement.query(By.css('ion-button.start-test-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onStartTest).toHaveBeenCalled();
    });

    it('should call onRekeyTest when the Rekey a paper test button is clicked', () => {
      fixture.detectChanges();
      vi.spyOn(component, 'onRekeyTest').mockReturnValue(undefined);
      const button = fixture.debugElement.query(By.css('ion-button.rekey-test-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onRekeyTest).toHaveBeenCalled();
    });

    it('should call onCancel when the Cancel button is clicked', () => {
      fixture.detectChanges();
      vi.spyOn(component, 'onCancel').mockReturnValue(undefined);
      const button = fixture.debugElement.query(By.css('ion-button.cancel-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onCancel).toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('should call dismiss with CANCEL', async () => {
      vi.spyOn(modalController, 'dismiss').mockReturnValue(undefined);
      await component.onCancel();
      expect(await modalController.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
    });
  });
  describe('onStartTest', () => {
    it('should call dismiss with START', async () => {
      vi.spyOn(modalController, 'dismiss').mockReturnValue(undefined);
      await component.onStartTest();
      expect(await modalController.dismiss).toHaveBeenCalledWith(ModalEvent.START);
    });
  });
  describe('onRekeyTest', () => {
    it('should call dismiss with REKEY', async () => {
      vi.spyOn(modalController, 'dismiss').mockReturnValue(undefined);
      await component.onRekeyTest();
      expect(await modalController.dismiss).toHaveBeenCalledWith(ModalEvent.REKEY);
    });
  });
});
