import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { IonicModule, ModalController } from '@ionic/angular';
import { ExitSamErrorModal } from '../exit-sam-error-modal';

describe('ExitSamErrorModal', () => {
  let fixture: ComponentFixture<ExitSamErrorModal>;
  let component: ExitSamErrorModal;
  let modalController: ModalController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule, AppModule, ExitSamErrorModal],
      providers: [ModalController],
    });

    fixture = TestBed.createComponent(ExitSamErrorModal);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
  }));

  describe('onOk', () => {
    it('should dismiss the modal with CANCEL event', async () => {
      spyOn(modalController, 'dismiss').and.resolveTo(true);
      await component.onOk();
      expect(modalController.dismiss).toHaveBeenCalled();
    });
  });
});
