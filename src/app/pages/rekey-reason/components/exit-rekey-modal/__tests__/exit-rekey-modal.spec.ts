import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { ExitRekeyModal } from '@pages/rekey-reason/components/exit-rekey-modal/exit-rekey-modal';
import { ExitRekeyModalEvent } from '@pages/rekey-reason/components/exit-rekey-modal/exit-rekey-modal.constants';
import { ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';

describe('ExitRekeyModal', () => {
  let fixture: ComponentFixture<ExitRekeyModal>;
  let component: ExitRekeyModal;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ExitRekeyModal,
      ],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
      ],
    });

    fixture = TestBed.createComponent(ExitRekeyModal);
    component = fixture.componentInstance;
    spyOn(component['modalCtrl'], 'dismiss');
  }));

  describe('DOM', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });
  describe('onCancel', () => {
    it('should invoke the correct event when modalController is dismissed - cancel', async () => {
      await component.onCancel();
      expect(component['modalCtrl'].dismiss).toHaveBeenCalledWith(ExitRekeyModalEvent.CANCEL);
    });
  });
  describe('onExitRekey', () => {
    it('should invoke the correct event when modalController is dismissed - exitRekey', async () => {
      await component.onExitRekey();
      expect(component['modalCtrl'].dismiss).toHaveBeenCalledWith(ExitRekeyModalEvent.EXIT_REKEY);
    });
  });
});
