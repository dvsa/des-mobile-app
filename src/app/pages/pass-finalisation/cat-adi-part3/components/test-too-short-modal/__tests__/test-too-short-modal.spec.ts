import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { TestTooShortModal } from '../test-too-short-modal';

xdescribe('TestTooShortModal', () => {
  let fixture: ComponentFixture<TestTooShortModal>;
  let component: TestTooShortModal;
  let modalController: ModalController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestTooShortModal, AppModule],
      providers: [{ provide: ModalController, useClass: ModalControllerMock }],
    });

    fixture = TestBed.createComponent(TestTooShortModal);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
  });

  describe('TestTooShortModal', () => {
    describe('clickReturn', () => {
      it('should dismiss the modal with false', async () => {
        spyOn(modalController, 'dismiss').and.resolveTo(false);
        await component.clickReturn();
        expect(modalController.dismiss).toHaveBeenCalledWith(false);
      });
    });

    describe('clickContinue', () => {
      it('should dismiss the modal with true', async () => {
        spyOn(modalController, 'dismiss').and.resolveTo(true);
        await component.clickContinue();
        expect(modalController.dismiss).toHaveBeenCalledWith(true);
      });
    });
  });
});
