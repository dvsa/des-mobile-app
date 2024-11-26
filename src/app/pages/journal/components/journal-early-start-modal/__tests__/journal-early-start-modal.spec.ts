import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';

import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule, ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { EarlyStartDidContinue, EarlyStartDidReturn } from '@store/journal/journal.actions';
import { JournalEarlyStartModal } from '../journal-early-start-modal';
import { ModalEvent } from '../journal-early-start-modal.constants';

describe('JournalEarlyStartModal', () => {
  let modalFixture: ComponentFixture<JournalEarlyStartModal>;
  let modalComponent: JournalEarlyStartModal;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [JournalEarlyStartModal],
      imports: [CommonModule, FormsModule, IonicModule, ComponentsModule],
      providers: [{ provide: ModalController, useClass: ModalControllerMock }, provideMockStore({})],
    });
    modalFixture = TestBed.createComponent(JournalEarlyStartModal);
    modalComponent = modalFixture.componentInstance;
    spyOn(modalComponent, 'getStartTime');
    spyOn(modalComponent.store$, 'dispatch').and.callFake(() => {});
    spyOn(modalComponent.modalController, 'dismiss').and.returnValue(Promise.resolve(true));
  }));

  describe('DOM', () => {
    it('should call onStart when the Start test button is clicked', () => {
      modalFixture.detectChanges();
      spyOn(modalComponent, 'onStart').and.callThrough();
      const button = modalFixture.debugElement.query(By.css('.start-test-button'));
      button.triggerEventHandler('click', null);
      modalFixture.detectChanges();
      expect(modalComponent.onStart).toHaveBeenCalled();
      expect(modalComponent.store$.dispatch).toHaveBeenCalledWith(EarlyStartDidContinue());
      expect(modalComponent.modalController.dismiss).toHaveBeenCalledWith(ModalEvent.START);
    });
    it('should call onCancel when the Cancel button is clicked', () => {
      modalFixture.detectChanges();
      spyOn(modalComponent, 'onCancel').and.callThrough();
      const button = modalFixture.debugElement.query(By.css('.cancel-button'));
      button.triggerEventHandler('click', null);
      modalFixture.detectChanges();
      expect(modalComponent.onCancel).toHaveBeenCalled();
      expect(modalComponent.store$.dispatch).toHaveBeenCalledWith(EarlyStartDidReturn());
      expect(modalComponent.modalController.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
    });
  });
});
