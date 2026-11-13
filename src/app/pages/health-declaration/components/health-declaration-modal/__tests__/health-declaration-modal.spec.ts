import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HealthDeclarationModal } from '../health-declaration-modal';

describe('healthDeclarationModal', () => {
  let modalFixture: ComponentFixture<HealthDeclarationModal>;
  let modalComponent: HealthDeclarationModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule, CommonModule, FormsModule, HealthDeclarationModal],
      providers: [
        {
          provide: ModalController,
          useClass: ModalControllerMock,
        },
        provideMockStore({}),
      ],
    });

    modalFixture = TestBed.createComponent(HealthDeclarationModal);
    modalComponent = modalFixture.componentInstance;
    vi.spyOn(modalComponent.modalController, 'dismiss').mockReturnValue(Promise.resolve(true));
  });

  it('should call onBack when the Cancel button is clicked', async () => {
    vi.spyOn(modalComponent.modalController, 'dismiss').mockReturnValue(undefined);
    const button = modalFixture.debugElement.query(By.css('#cancel-button'));
    button.triggerEventHandler('click', null);
    modalFixture.detectChanges();
    await modalComponent.onBack();
    expect(modalComponent.modalController.dismiss).toHaveBeenCalled();
  });

  it('should call onCompleteTest when the Submit button is clicked', () => {
    modalComponent.onTestDetailsConfirm = async () => {};
    modalFixture.detectChanges();
    vi.spyOn(modalComponent, 'onCompleteTest');
    const button = modalFixture.debugElement.query(By.css('#continue-button'));
    button.triggerEventHandler('click', null);
    modalFixture.detectChanges();
    expect(modalComponent.onCompleteTest).toHaveBeenCalled();
  });
});
