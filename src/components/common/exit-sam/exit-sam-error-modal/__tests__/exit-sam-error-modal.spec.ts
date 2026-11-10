import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { ExitSamErrorModal } from '../exit-sam-error-modal';

describe('ExitSamErrorModal', () => {
  let fixture: ComponentFixture<ExitSamErrorModal>;
  let component: ExitSamErrorModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ExitSamErrorModal],
      providers: [{ provide: ModalController, useClass: ModalControllerMock }],
    });

    fixture = TestBed.createComponent(ExitSamErrorModal);
    component = fixture.componentInstance;
  });

  describe('onOk', () => {
    it('should dismiss the modal with CANCEL event', async () => {
      spyOn(component.modalController, 'dismiss').and.resolveTo(true);
      await component.onOk();
      expect(component.modalController.dismiss).toHaveBeenCalled();
    });
  });
});
