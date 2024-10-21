import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/index.mock';
import { AppModule } from 'src/app/app.module';
import { RecordsExplanationModal } from '../records-explanation-modal';

describe('RecordsExplanationModal', () => {
  let fixture: ComponentFixture<RecordsExplanationModal>;
  let component: RecordsExplanationModal;
  let modalController: ModalController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RecordsExplanationModal],
      imports: [AppModule, IonicModule],
      providers: [{ provide: ModalController, useClass: ModalControllerMock }],
    });

    fixture = TestBed.createComponent(RecordsExplanationModal);
    modalController = TestBed.inject(ModalController);
    component = fixture.componentInstance;
    spyOn(component.modalCtrl, 'dismiss');
  }));

  describe('onDismiss', () => {
    it('should dismiss the view controller', async () => {
      await component.onDismiss();
      expect(modalController.dismiss).toHaveBeenCalled();
    });
  });
});
