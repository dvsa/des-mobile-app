import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';

import { ComponentsModule } from '@components/common/common-components.module';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { ModalEvent } from '@pages/fake-journal/components/preview-mode-modal/preview-mode-modal.constants';
import { MockComponent } from 'ng-mocks';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { HeaderComponent } from '@components/common/header-component/header.component';
import { PreviewModeModal } from '../preview-mode-modal';

describe('PreviewModeModal', () => {
  let fixture: ComponentFixture<PreviewModeModal>;
  let component: PreviewModeModal;
  let modalController: ModalController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        PreviewModeModal,
        MockComponent(HeaderComponent),
        MockComponent(ModalAlertTitleComponent),
      ],
      imports: [
        IonicModule,
        ComponentsModule,
      ],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
      ],
    });

    fixture = TestBed.createComponent(PreviewModeModal);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
    spyOn(modalController, 'dismiss');
  }));

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Class', () => {
    describe('onCancel', () => {
      it('should dismiss modal with `cancel` callback', async () => {
        await component.onCancel();
        expect(modalController.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
      });
    });
    describe('onContinue', () => {
      it('should dismiss modal with `start` callback', async () => {
        await component.onContinue();
        expect(modalController.dismiss).toHaveBeenCalledWith(ModalEvent.START);
      });
    });
  });

  describe('DOM', () => {
    it('should call onCancel when the Cancel button is clicked', () => {
      fixture.detectChanges();
      spyOn(component, 'onCancel');
      const button = fixture.debugElement.query(By.css('#preview-mode-return-to-journal-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onCancel).toHaveBeenCalled();
    });
    it('should call onContinue when the Continue button is clicked', () => {
      fixture.detectChanges();
      spyOn(component, 'onContinue');
      const button = fixture.debugElement.query(By.css('#preview-mode-continue-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onContinue).toHaveBeenCalled();
    });
  });
});
