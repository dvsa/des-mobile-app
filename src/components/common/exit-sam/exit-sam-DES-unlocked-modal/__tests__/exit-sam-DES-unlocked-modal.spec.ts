import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { IonicModule, ModalController } from '@ionic/angular';
import { ExitSamDESUnlockedModal } from '../exit-sam-DES-unlocked-modal';

describe('ExitSamDESUnlockedModal', () => {
  let fixture: ComponentFixture<ExitSamDESUnlockedModal>;
  let component: ExitSamDESUnlockedModal;
  let modalController: ModalController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule, AppModule, ExitSamDESUnlockedModal],
      providers: [ModalController],
    });

    fixture = TestBed.createComponent(ExitSamDESUnlockedModal);
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
