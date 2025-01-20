import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { IonicModule, ModalController } from '@ionic/angular';
import { ExitSamDESUnlockedModal, LogoutModalEvent } from '../exit-sam-DES-unlocked-modal';

describe('LogoutModal', () => {
  let fixture: ComponentFixture<ExitSamDESUnlockedModal>;
  let component: ExitSamDESUnlockedModal;
  let modalController: ModalController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExitSamDESUnlockedModal],
      imports: [IonicModule, AppModule],
      providers: [ModalController],
    });

    fixture = TestBed.createComponent(ExitSamDESUnlockedModal);
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
