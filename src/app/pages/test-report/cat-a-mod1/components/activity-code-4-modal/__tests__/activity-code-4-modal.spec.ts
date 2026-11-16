import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { ModalEvent } from '../../../../test-report.constants';
import { ActivityCode4Modal } from '../activity-code-4-modal';

describe('ActivityCode4Modal', () => {
  let fixture: ComponentFixture<ActivityCode4Modal>;
  let component: ActivityCode4Modal;
  let modalController: ModalController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ActivityCode4Modal],
      providers: [{ provide: ModalController, useClass: ModalControllerMock }],
    });

    fixture = TestBed.createComponent(ActivityCode4Modal);
    modalController = TestBed.inject(ModalController);
    component = fixture.componentInstance;
  });

  describe('DOM', () => {
    it('should call onCancel when the return to journal button is clicked', () => {
      fixture.detectChanges();
      vi.spyOn(component, 'onCancel').mockReturnValue(undefined);
      const button = fixture.debugElement.query(By.css('ion-button.return-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onCancel).toHaveBeenCalled();
    });

    it('should call onEndTest when the return to journal button is clicked', () => {
      fixture.detectChanges();
      vi.spyOn(component, 'onEndTest').mockReturnValue(undefined);
      const button = fixture.debugElement.query(By.css('ion-button.end-test-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onEndTest).toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('should call dismiss with CANCEL', async () => {
      vi.spyOn(modalController, 'dismiss').mockReturnValue(undefined);
      await component.onCancel();
      expect(await modalController.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
    });
  });
  describe('onEndTest', () => {
    it('should call dismiss with END_WITH_ACTIVITY_CODE_4', async () => {
      vi.spyOn(modalController, 'dismiss').mockReturnValue(undefined);
      await component.onEndTest();
      expect(await modalController.dismiss).toHaveBeenCalledWith(ModalEvent.END_WITH_ACTIVITY_CODE_4);
    });
  });
});
