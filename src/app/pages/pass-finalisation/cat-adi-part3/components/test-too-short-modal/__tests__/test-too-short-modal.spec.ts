import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { IonicModule, ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { TestTooShortModal } from '../test-too-short-modal';

describe('TestTooShortModal', () => {
  let fixture: ComponentFixture<TestTooShortModal>;
  let component: TestTooShortModal;
  let modalController: ModalController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestTooShortModal, IonicModule, AppModule],
      providers: [{ provide: ModalController, useClass: ModalControllerMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    fixture = TestBed.createComponent(TestTooShortModal);
    modalController = TestBed.inject(ModalController);
    component = fixture.componentInstance;
    component.modalCtrl = modalController;
    fixture.detectChanges();
  });

  it('should dismiss the modal with false', async () => {
    await component.clickReturn();
    expect(modalController.dismiss).toHaveBeenCalledWith(false);
  });

  it('should dismiss the modal with true', async () => {
    await component.clickContinue();
    expect(modalController.dismiss).toHaveBeenCalledWith(true);
  });
});
