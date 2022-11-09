import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { IonicModule, ModalController } from '@ionic/angular';
import { ModalEvent } from '@pages/dashboard/components/practice-test-modal/practice-test-modal.constants';
import { PracticeTestModal } from '../practice-test-modal';

fdescribe('PracticeTestModal', () => {
  let fixture: ComponentFixture<PracticeTestModal>;
  let modalComponent: PracticeTestModal;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PracticeTestModal],
      imports: [IonicModule],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
      ],
    });

    fixture = TestBed.createComponent(PracticeTestModal);
    modalComponent = fixture.componentInstance;
    spyOn(modalComponent.modalController, 'dismiss').and.returnValue(Promise.resolve(true));
  }));

  describe('Class', () => {
    describe('onCancel', () => {
      it('should invoke the correct event when modalController is dismissed - cancel', async () => {
        await modalComponent.onCancel();
        expect(modalComponent.modalController.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
      });
    });

    describe('onNoFault', () => {
      it('should invoke the correct event when modalController is dismissed - no fault', async () => {
        await modalComponent.onNoFault();
        expect(modalComponent.modalController.dismiss).toHaveBeenCalledWith(ModalEvent.NO_FAULT);
      });
    });

    describe('onFault', () => {
      it('should invoke the correct event when modalController is dismissed - fault', async () => {
        await modalComponent.onFault();
        expect(modalComponent.modalController.dismiss).toHaveBeenCalledWith(ModalEvent.FAULT);
      });
    });
  });
});
