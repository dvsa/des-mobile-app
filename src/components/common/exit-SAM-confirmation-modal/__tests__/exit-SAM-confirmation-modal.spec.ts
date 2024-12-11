import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { IonicModule, ModalController } from '@ionic/angular';
import {ExitSAMConfirmationModal, ExitSAMModalEvent} from '../exit-SAM-confirmation-modal';

describe('ExitSAMConfirmationModal', () => {
  let fixture: ComponentFixture<ExitSAMConfirmationModal>;
  let component: ExitSAMConfirmationModal;
  let modalController: ModalController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExitSAMConfirmationModal],
      imports: [IonicModule, AppModule],
      providers: [ModalController],
    });

    fixture = TestBed.createComponent(ExitSAMConfirmationModal);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
  }));

  describe('onCancel', () => {
    it('should dismiss the modal with CANCEL event', async () => {
      spyOn(component.modalController, 'dismiss').and.resolveTo(true);
      await component.onCancel();
      expect(modalController.dismiss).toHaveBeenCalledWith({ event: ExitSAMModalEvent.CANCEL });
    });
  });

  describe('onLogout', () => {
    it('should dismiss the modal with EXIT event', async () => {
      spyOn(modalController, 'dismiss').and.resolveTo(true);
      await component.onExit();
      expect(modalController.dismiss).toHaveBeenCalledWith({ event: ExitSAMModalEvent.EXIT });
    });
  });
});
