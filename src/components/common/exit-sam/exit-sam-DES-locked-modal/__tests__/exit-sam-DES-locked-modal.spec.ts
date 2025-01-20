import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { IonicModule, ModalController } from '@ionic/angular';
import { ExitSamDESLockedModal, LogoutModalEvent } from '../exit-sam-DES-locked-modal';

describe('LogoutModal', () => {
  let fixture: ComponentFixture<ExitSamDESLockedModal>;
  let component: ExitSamDESLockedModal;
  let modalController: ModalController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExitSamDESLockedModal],
      imports: [IonicModule, AppModule],
      providers: [ModalController],
    });

    fixture = TestBed.createComponent(ExitSamDESLockedModal);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
  }));

  describe('onCancel', () => {
    it('should dismiss the modal with CANCEL event', async () => {
      spyOn(component.modalController, 'dismiss').and.resolveTo(true);
      await component.onCancel();
      expect(modalController.dismiss).toHaveBeenCalledWith({ event: LogoutModalEvent.CANCEL });
    });
  });

  describe('onLogout', () => {
    it('should dismiss the modal with LOGOUT event', async () => {
      spyOn(modalController, 'dismiss').and.resolveTo(true);
      await component.onLogout();
      expect(modalController.dismiss).toHaveBeenCalledWith({ event: LogoutModalEvent.LOGOUT });
    });
  });
});
