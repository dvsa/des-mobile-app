import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule, ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { FinishTestModal } from '@pages/office/components/finish-test-modal/finish-test-modal';

describe('FinishTestModal', () => {
  let modalFixture: ComponentFixture<FinishTestModal>;
  let modalComponent: FinishTestModal;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FinishTestModal],
      imports: [CommonModule, FormsModule, IonicModule, ComponentsModule],
      providers: [{ provide: ModalController, useClass: ModalControllerMock }],
    });

    modalFixture = TestBed.createComponent(FinishTestModal);
    modalComponent = modalFixture.componentInstance;
    spyOn(modalComponent.modalController, 'dismiss').and.returnValue(Promise.resolve(true));
    modalComponent.completeTest = jasmine.createSpy('completeTest');
    modalComponent.destroyTestSubs = jasmine.createSpy('destroyTestSubs');
  }));

  describe('onCompleteTest', () => {
    it('expect completeTest to be called', async () => {
      await modalComponent.onCompleteTest();
      expect(modalComponent.destroyTestSubs).toHaveBeenCalled();
      expect(modalComponent.completeTest).toHaveBeenCalled();
    });
  });

  describe('onBack', () => {
    it('expect modalController dismiss', async () => {
      await modalComponent.onBack();
      expect(modalComponent.modalController.dismiss).toHaveBeenCalled();
    });
  });
});
