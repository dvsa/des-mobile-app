import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { IonicModule, ModalController } from '@ionic/angular';
import { ExitSamDESLockedModal } from '../exit-sam-DES-locked-modal';

describe('LogoutModal', () => {
  let fixture: ComponentFixture<ExitSamDESLockedModal>;
  let component: ExitSamDESLockedModal;
  let modalController: ModalController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule, AppModule, ExitSamDESLockedModal],
      providers: [ModalController],
    });

    fixture = TestBed.createComponent(ExitSamDESLockedModal);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
  }));

  describe('onOk', () => {
    it('should dismiss the modal with CANCEL event', async () => {
      spyOn(component.modalController, 'dismiss').and.resolveTo(true);
      await component.onOk();
      expect(modalController.dismiss).toHaveBeenCalled();
    });
  });
});
