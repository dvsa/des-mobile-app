import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Code4Modal } from '@pages/test-report/cat-adi-part3/components/code-4-modal/code-4-modal';
import { ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { MockComponent } from 'ng-mocks';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';

describe('Code4Modal', () => {
  let fixture: ComponentFixture<Code4Modal>;
  let component: Code4Modal;
  let modalController: ModalController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        Code4Modal,
        MockComponent(ModalAlertTitleComponent),
      ],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
      ],
    });

    fixture = TestBed.createComponent(Code4Modal);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
  }));

  describe('dismiss', () => {
    it('should call dismiss with the variable passed in', async () => {
      spyOn(modalController, 'dismiss').and.returnValue(Promise.resolve(true));
      await component.dismiss(false);
      expect(modalController.dismiss).toHaveBeenCalledWith(false);
    });
  });
});
