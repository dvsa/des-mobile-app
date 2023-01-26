import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { ComponentsModule } from '@components/common/common-components.module';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { ModalEvent } from '@pages/fake-journal/components/preview-mode-modal/preview-mode-modal.constants';
import { JournalForceCheckModal } from '../journal-force-check-modal';

describe('JournalForceCheckModal', () => {
  let fixture: ComponentFixture<JournalForceCheckModal>;
  let component: JournalForceCheckModal;
  let modalController: ModalController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        JournalForceCheckModal,
      ],
      imports: [
        IonicModule,
        ComponentsModule,
      ],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
      ],
    });

    fixture = TestBed.createComponent(JournalForceCheckModal);
    modalController = TestBed.inject(ModalController);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });

  describe('onCancel', () => {
    it('should dismiss modal with `cancel` callback', async () => {
      spyOn(modalController, 'dismiss');
      await component.onCancel();
      expect(modalController.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
    });
  });

  describe('DOM', () => {
    it('should call onCancel when the Cancel button is clicked', () => {
      fixture.detectChanges();
      spyOn(component, 'onCancel');
      const button = fixture.debugElement.query(By.css('#return-to-journal-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onCancel).toHaveBeenCalled();
    });
  });
});
