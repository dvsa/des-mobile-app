import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';

import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { EarlyStartDidContinue, EarlyStartDidReturn } from '@store/journal/journal.actions';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule, NavParams, ModalController } from '@ionic/angular';
import { JournalEarlyStartModal } from '../journal-early-start-modal';
import { JournalEarlyStartModalMock } from '../__mocks__/journal-early-start-modal.mock';
import { NavParamsMock } from '../__mocks__/nav-params.mock';
import { ModalEvent } from '../journal-early-start-modal.constants';

describe('JournalEarlyStartModal', () => {
  let modalFixture: ComponentFixture<JournalEarlyStartModal>;
  let modalComponent: JournalEarlyStartModal;
  const mockFile: JournalEarlyStartModalMock = new JournalEarlyStartModalMock();
  const navMock: NavParamsMock = new NavParamsMock();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        JournalEarlyStartModal,
      ],
      imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ComponentsModule,
      ],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: NavParams, useFactory: () => navMock },
        provideMockStore({}),
      ],
    });
  });
  beforeEach(async(() => {
    const mockValue = mockFile.mockSlotDetail();
    spyOn(navMock, 'get').and.returnValue(mockValue);
    modalFixture = TestBed.createComponent(JournalEarlyStartModal);
    modalComponent = modalFixture.componentInstance;
    spyOn(modalComponent.store$, 'dispatch').and.callFake(() => {});
    spyOn(modalComponent.modalController, 'dismiss').and.returnValue(Promise.resolve(true));
  }));
  it('should return slot details from nav param', () => {
    modalFixture.detectChanges();
    const slotData = modalComponent.getSlotData();
    const mockValue = mockFile.mockSlotDetail();
    expect(slotData).toEqual(mockValue);
  });
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
