import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/index.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LogoutModal, LogoutModalEvent } from '../logout-modal';

describe('LogoutModal', () => {
  let fixture: ComponentFixture<LogoutModal>;
  let component: LogoutModal;
  let modalController: ModalController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LogoutModal],
      providers: [{ provide: ModalController, useClass: ModalControllerMock }],
    });

    fixture = TestBed.createComponent(LogoutModal);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
  });

  describe('onCancel', () => {
    it('should dismiss the modal with CANCEL event', async () => {
      vi.spyOn(modalController, 'dismiss').mockResolvedValue(true);
      await component.onCancel();
      expect(modalController.dismiss).toHaveBeenCalledWith({ event: LogoutModalEvent.CANCEL });
    });
  });

  describe('onLogout', () => {
    it('should dismiss the modal with LOGOUT event', async () => {
      vi.spyOn(modalController, 'dismiss').mockResolvedValue(true);
      await component.onLogout();
      expect(modalController.dismiss).toHaveBeenCalledWith({ event: LogoutModalEvent.LOGOUT });
    });
  });
});
