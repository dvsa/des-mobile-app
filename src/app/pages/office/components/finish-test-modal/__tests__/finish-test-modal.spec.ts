import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FinishTestModal } from '@pages/office/components/finish-test-modal/finish-test-modal';
import { IonicModule, ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { ComponentsModule } from '@components/common/common-components.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('FinishTestModal', () => {
  let modalFixture: ComponentFixture<FinishTestModal>;
  let modalComponent: FinishTestModal;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        FinishTestModal,
      ],
      imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ComponentsModule,
      ],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
      ],
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
