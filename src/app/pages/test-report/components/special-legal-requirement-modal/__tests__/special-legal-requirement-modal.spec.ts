import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule, NavParams, ModalController } from '@ionic/angular';
import { NavParamsMock, ModalControllerMock } from '@mocks/index.mock';
import { AppModule } from 'src/app/app.module';
import { By } from '@angular/platform-browser';
import { ComponentsModule } from '@components/common/common-components.module';
import { ModalEvent } from '@pages/test-report/test-report.constants';
import { SpecialLegalRequirementModal } from '../special-legal-requirement-modal';

describe('LegalRequirementsModal', () => {
  let fixture: ComponentFixture<SpecialLegalRequirementModal>;
  let component: SpecialLegalRequirementModal;
  let modalController: ModalController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SpecialLegalRequirementModal,
      ],
      imports: [
        AppModule,
        IonicModule,
        ComponentsModule,
      ],
      providers: [
        { provide: NavParams, useClass: NavParamsMock },
        { provide: ModalController, useClass: ModalControllerMock },
      ],
    });

    fixture = TestBed.createComponent(SpecialLegalRequirementModal);
    modalController = TestBed.inject(ModalController);
    component = fixture.componentInstance;
    spyOn(component.modalCtrl, 'dismiss');
  }));

  describe('DOM', () => {
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

    it('should call onProceed when the Continue test button is clicked', () => {
      fixture.detectChanges();
      spyOn(component, 'onProceed');
      const button = fixture.debugElement.query(By.css('.mes-primary-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onProceed).toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('should dismiss the view controller with cancel event', async () => {
      await component.onCancel();
      expect(modalController.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
    });
  });
  describe('onProceed', () => {
    it('should dismiss the view controller with continue event', async () => {
      await component.onProceed();
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
