import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';

import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { TestTooShortModal } from '@pages/pass-finalisation/cat-adi-part3/components/test-too-short-modal/test-too-short-modal';

describe('TestTooShortModal', () => {
  let component: TestTooShortModal;
  let fixture: ComponentFixture<TestTooShortModal>;
  let modalController: ModalController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestTooShortModal, MockComponent(ModalAlertTitleComponent)],
      imports: [IonicModule],
      providers: [
        {
          provide: ModalController,
          useClass: ModalControllerMock,
        },
      ],
    });

    fixture = TestBed.createComponent(TestTooShortModal);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
    spyOn(modalController, 'dismiss');
  });

  describe('Class', () => {
    describe('clickReturn', () => {
      it('should call modal dismiss with false', async () => {
        await component.clickReturn();
        expect(modalController.dismiss).toHaveBeenCalledWith(false);
      });
    });
    describe('clickContinue', () => {
      it('should call modal dismiss with true', async () => {
        await component.clickContinue();
        expect(modalController.dismiss).toHaveBeenCalledWith(true);
      });
    });
  });
});
