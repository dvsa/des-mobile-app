import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';

import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule, NavParams, ModalController } from '@ionic/angular';
import { SubmitModal } from '../submit-modal';
import { JournalEarlyStartModalMock } from '../__mocks__/journal-early-start-modal.mock';
import { NavParamsMock } from '../__mocks__/nav-params.mock';
import { ModalEvent } from '../submit-modal.constants';

describe('submitModal', () => {
  let modalFixture: ComponentFixture<SubmitModal>;
  let modalComponent: SubmitModal;
  const mockFile: JournalEarlyStartModalMock = new JournalEarlyStartModalMock();
  const navMock: NavParamsMock = new NavParamsMock();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        SubmitModal,
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
  beforeEach(waitForAsync(() => {
    const mockValue = mockFile.mockSlotDetail();
    spyOn(navMock, 'get').and.returnValue(mockValue);
    modalFixture = TestBed.createComponent(SubmitModal);
    modalComponent = modalFixture.componentInstance;
    spyOn(modalComponent.store$, 'dispatch').and.callFake(() => {});
    spyOn(modalComponent.modalController, 'dismiss').and.returnValue(Promise.resolve(true));
  }));

  it('should call onCancel when the Cancel button is clicked', () => {
    modalFixture.detectChanges();
    spyOn(modalComponent, 'onCancel').and.callThrough();
    const button = modalFixture.debugElement.query(By.css('.cancel-button'));
    button.triggerEventHandler('click', null);
    modalFixture.detectChanges();
    expect(modalComponent.onCancel).toHaveBeenCalled();
    expect(modalComponent.modalController.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
  });
});
