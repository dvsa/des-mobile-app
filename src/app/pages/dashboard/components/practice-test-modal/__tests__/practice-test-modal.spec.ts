import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { configureTestSuite } from 'ng-bullet';
import { ModalController } from '@ionic/angular';
import { ModalEvent } from '@pages/journal/components/journal-early-start-modal/journal-early-start-modal.constants';
import { PracticeTestModal } from '../practice-test-modal';

describe('PracticeTestModal', () => {
  let fixture: ComponentFixture<PracticeTestModal>;
  let modalComponent: PracticeTestModal;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        PracticeTestModal,
      ],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
      ],
    });
  });

  beforeEach(async(() => {
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
        await modalComponent.onCancel();
        expect(modalComponent.modalController.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
      });
    });

    describe('onFault', () => {
      it('should invoke the correct event when modalController is dismissed - fault', async () => {
        await modalComponent.onCancel();
        expect(modalComponent.modalController.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
      });
    });
  });
});
