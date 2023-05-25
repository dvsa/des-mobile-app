import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule, NavParams, ModalController } from '@ionic/angular';
import { NavParamsMock, ModalControllerMock } from '@mocks/index.mock';
import { AppModule } from 'src/app/app.module';
import { By } from '@angular/platform-browser';
import { ModalEvent } from '@pages/test-report/test-report.constants';
import { MockComponent } from 'ng-mocks';
import { HeaderComponent } from '@components/common/header-component/header.component';
import { EndTestModal } from '../end-test-modal';

describe('EndTestModal', () => {
  let fixture: ComponentFixture<EndTestModal>;
  let component: EndTestModal;
  let modalController: ModalController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(HeaderComponent),
        EndTestModal,
      ],
      imports: [
        AppModule,
        IonicModule,
      ],
      providers: [
        { provide: NavParams, useClass: NavParamsMock },
        { provide: ModalController, useClass: ModalControllerMock },
      ],
    });

    fixture = TestBed.createComponent(EndTestModal);
    modalController = TestBed.inject(ModalController);
    component = fixture.componentInstance;
    spyOn(component.modalCtrl, 'dismiss');
  }));

  describe('DOM', () => {
    it('should call onContinue when the Continue to debrief button is clicked', () => {
      fixture.detectChanges();
      spyOn(component, 'onContinue');
      const button = fixture.debugElement.query(By.css('ion-button.mes-primary-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onContinue).toHaveBeenCalled();
    });

    it('should call onCancel when the Return to test button is clicked', () => {
      fixture.detectChanges();
      spyOn(component, 'onCancel');
      const button = fixture.debugElement.query(By.css('ion-button.return-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onCancel).toHaveBeenCalled();
    });

    it('should call onTerminate when the Terminate test button is clicked', () => {
      fixture.detectChanges();
      spyOn(component, 'onTerminate');
      const button = fixture.debugElement.query(By.css('ion-button.terminate-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onTerminate).toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('should dismiss the view controller with cancel event', async () => {
      await component.onCancel();
      expect(modalController.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
    });
  });
  describe('onContinue', () => {
    it('should dismiss the view controller with continue event', async () => {
      await component.onContinue();
      expect(modalController.dismiss).toHaveBeenCalledWith(ModalEvent.CONTINUE);
    });
  });
  describe('onTerminate', () => {
    it('should dismiss the view controller with terminate event', async () => {
      await component.onTerminate();
      expect(modalController.dismiss).toHaveBeenCalledWith(ModalEvent.TERMINATE);
    });
  });
});
