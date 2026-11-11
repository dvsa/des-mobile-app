import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { Code4Modal } from '@pages/test-report/cat-adi-part3/components/code-4-modal/code-4-modal';
import { MockComponent } from 'ng-mocks';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Code4Modal', () => {
  let fixture: ComponentFixture<Code4Modal>;
  let component: Code4Modal;
  let modalController: ModalController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Code4Modal, MockComponent(ModalAlertTitleComponent)],
      providers: [{ provide: ModalController, useClass: ModalControllerMock }],
    });

    fixture = TestBed.createComponent(Code4Modal);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
  });

  describe('dismiss', () => {
    it('should call dismiss with the variable passed in', async () => {
      vi.spyOn(modalController, 'dismiss').mockReturnValue(Promise.resolve(true));
      await component.dismiss(false);
      expect(modalController.dismiss).toHaveBeenCalledWith(false);
    });
  });
});
