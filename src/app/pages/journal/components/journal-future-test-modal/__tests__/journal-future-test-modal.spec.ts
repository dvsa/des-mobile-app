import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/index.mock';
import { Store, StoreModule } from '@ngrx/store';
import { ModalEvent } from '@pages/journal/components/journal-rekey-modal/journal-rekey-modal.constants';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DeviceProvider } from '@providers/device/device';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { StoreModel } from '@shared/models/store.model';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { JournalFutureTestModal } from '../journal-future-test-modal';

describe('JournalRekeyModal', () => {
  let fixture: ComponentFixture<JournalFutureTestModal>;
  let component: JournalFutureTestModal;
  let modalController: ModalController;
  let store$: Store<StoreModel>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), JournalFutureTestModal],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: DeviceProvider, useClass: DeviceProviderMock },
        { provide: LogHelper, useClass: LogHelperMock },
      ],
    });

    fixture = TestBed.createComponent(JournalFutureTestModal);
    modalController = TestBed.inject(ModalController);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);

    vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
  });

  describe('DOM', () => {
    it('should call onStartTest when the Start test button is clicked', () => {
      fixture.detectChanges();
      vi.spyOn(component, 'onStartTest').mockReturnValue(undefined);
      const button = fixture.debugElement.query(By.css('ion-button.cancel-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onStartTest).toHaveBeenCalled();
    });

    it('should call onCancel when the Cancel button is clicked', () => {
      fixture.detectChanges();
      vi.spyOn(component, 'onCancel').mockReturnValue(undefined);
      const button = fixture.debugElement.query(By.css('ion-button.start-test-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onCancel).toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('should call dismiss with CANCEL', async () => {
      vi.spyOn(modalController, 'dismiss');
      await component.onCancel();
      expect(modalController.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
    });
  });
  describe('onStartTest', () => {
    it('should call dismiss with START', async () => {
      vi.spyOn(modalController, 'dismiss');
      await component.onStartTest();
      expect(modalController.dismiss).toHaveBeenCalledWith(ModalEvent.START);
    });
  });
});
