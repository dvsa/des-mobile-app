import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { EarlyStartDidContinue, EarlyStartDidReturn } from '@store/journal/journal.actions';
import { JournalEarlyStartModal } from '../journal-early-start-modal';
import { ModalEvent } from '../journal-early-start-modal.constants';

describe('JournalEarlyStartModal', () => {
  let modalFixture: ComponentFixture<JournalEarlyStartModal>;
  let modalComponent: JournalEarlyStartModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, JournalEarlyStartModal],
      providers: [{ provide: ModalController, useClass: ModalControllerMock }, provideMockStore({})],
    });
    modalFixture = TestBed.createComponent(JournalEarlyStartModal);
    modalComponent = modalFixture.componentInstance;
    vi.spyOn(modalComponent, 'getStartTime').mockReturnValue(undefined);
    vi.spyOn(modalComponent.store$, 'dispatch');
    vi.spyOn(modalComponent.modalController, 'dismiss').mockReturnValue(Promise.resolve(true));
  });

  describe('DOM', () => {
    it('should call onStart when the Start test button is clicked', () => {
      modalFixture.detectChanges();
      vi.spyOn(modalComponent, 'onStart');
      const button = modalFixture.debugElement.query(By.css('.start-test-button'));
      button.triggerEventHandler('click', null);
      modalFixture.detectChanges();
      expect(modalComponent.onStart).toHaveBeenCalled();
      expect(modalComponent.store$.dispatch).toHaveBeenCalledWith(EarlyStartDidContinue());
      expect(modalComponent.modalController.dismiss).toHaveBeenCalledWith(ModalEvent.START);
    });
    it('should call onCancel when the Cancel button is clicked', () => {
      modalFixture.detectChanges();
      vi.spyOn(modalComponent, 'onCancel');
      const button = modalFixture.debugElement.query(By.css('.cancel-button'));
      button.triggerEventHandler('click', null);
      modalFixture.detectChanges();
      expect(modalComponent.onCancel).toHaveBeenCalled();
      expect(modalComponent.store$.dispatch).toHaveBeenCalledWith(EarlyStartDidReturn());
      expect(modalComponent.modalController.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
    });
  });
});
