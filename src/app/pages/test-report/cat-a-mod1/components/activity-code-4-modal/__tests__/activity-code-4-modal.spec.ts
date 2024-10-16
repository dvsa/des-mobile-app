import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppModule } from '@app/app.module';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { NavParamsMock } from '@pages/journal/components/journal-early-start-modal/__mocks__/nav-params.mock';
import { ModalEvent } from '../../../../test-report.constants';
import { ActivityCode4Modal } from '../activity-code-4-modal';

describe('ActivityCode4Modal', () => {
  let fixture: ComponentFixture<ActivityCode4Modal>;
  let component: ActivityCode4Modal;
  let modalController: ModalController;
  const navMock: NavParamsMock = new NavParamsMock();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityCode4Modal],
      imports: [AppModule, IonicModule, ComponentsModule],
      providers: [
        { provide: NavParams, useFactory: () => navMock },
        { provide: ModalController, useClass: ModalControllerMock },
      ],
    });

    fixture = TestBed.createComponent(ActivityCode4Modal);
    modalController = TestBed.inject(ModalController);
    component = fixture.componentInstance;
  }));

  describe('DOM', () => {
    it('should call onCancel when the return to journal button is clicked', () => {
      fixture.detectChanges();
      spyOn(component, 'onCancel');
      const button = fixture.debugElement.query(By.css('ion-button.return-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onCancel).toHaveBeenCalled();
    });

    it('should call onEndTest when the return to journal button is clicked', () => {
      fixture.detectChanges();
      spyOn(component, 'onEndTest');
      const button = fixture.debugElement.query(By.css('ion-button.end-test-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onEndTest).toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('should call dismiss with CANCEL', async () => {
      spyOn(modalController, 'dismiss');
      await component.onCancel();
      expect(await modalController.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
    });
  });
  describe('onEndTest', () => {
    it('should call dismiss with END_WITH_ACTIVITY_CODE_4', async () => {
      spyOn(modalController, 'dismiss');
      await component.onEndTest();
      expect(await modalController.dismiss).toHaveBeenCalledWith(ModalEvent.END_WITH_ACTIVITY_CODE_4);
    });
  });
});
