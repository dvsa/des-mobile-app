import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/index.mock';
import { AppModule } from 'src/app/app.module';
import { CustomDateRangeModal } from '../custom-date-range-modal';

describe('RecordsExplanationModal', () => {
  let fixture: ComponentFixture<CustomDateRangeModal>;
  let component: CustomDateRangeModal;
  let modalController: ModalController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CustomDateRangeModal],
      imports: [AppModule, IonicModule],
      providers: [{ provide: ModalController, useClass: ModalControllerMock }],
    });

    fixture = TestBed.createComponent(CustomDateRangeModal);
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
