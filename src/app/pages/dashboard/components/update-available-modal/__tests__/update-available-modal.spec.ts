import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';

import {
  UpdateAvailable,
  UpdateAvailableModal,
} from '@pages/dashboard/components/update-available-modal/update-available-modal';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';

describe('UpdateAvailableModal', () => {
  let component: UpdateAvailableModal;
  let fixture: ComponentFixture<UpdateAvailableModal>;
  let modalController: ModalController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        UpdateAvailableModal,
        MockComponent(ModalAlertTitleComponent),
      ],
      imports: [IonicModule],
      providers: [
        {
          provide: ModalController,
          useClass: ModalControllerMock,
        },
      ],
    });

    fixture = TestBed.createComponent(UpdateAvailableModal);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
    spyOn(modalController, 'dismiss');
  }));

  describe('Class', () => {
    describe('clickRemindMeLater', () => {
      it('should call modal dismiss with `REMIND_ME_LATER`', async () => {
        await component.clickRemindMeLater();
        expect(modalController.dismiss)
          .toHaveBeenCalledWith(UpdateAvailable.REMIND_ME_LATER);
      });
    });
    describe('clickOK', () => {
      it('should call modal dismiss with `OK`', async () => {
        await component.clickOK();
        expect(modalController.dismiss)
          .toHaveBeenCalledWith(UpdateAvailable.OK);
      });
    });
  });
});
