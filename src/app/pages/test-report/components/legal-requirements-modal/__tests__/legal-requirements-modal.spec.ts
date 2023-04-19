import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule, NavParams, ModalController } from '@ionic/angular';
import { NavParamsMock, ModalControllerMock } from '@mocks/index.mock';
import { AppModule } from 'src/app/app.module';
import { By } from '@angular/platform-browser';
import { ComponentsModule } from '@components/common/common-components.module';
import { LegalRequirementsModal } from '../legal-requirements-modal';
import { ModalEvent } from '../../../test-report.constants';

describe('LegalRequirementsModal', () => {
  let fixture: ComponentFixture<LegalRequirementsModal>;
  let component: LegalRequirementsModal;
  let modalCtrl: ModalController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        LegalRequirementsModal,
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

    fixture = TestBed.createComponent(LegalRequirementsModal);
    component = fixture.componentInstance;
    modalCtrl = TestBed.inject(ModalController);
  }));

  describe('DOM', () => {
    it('should call onCancel when the Return to test button is clicked', () => {
      component.legalRequirements = [];
      fixture.detectChanges();
      spyOn(component, 'onCancel');
      const button = fixture.debugElement.query(By.css('ion-button.modal-return-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onCancel).toHaveBeenCalled();
    });

    it('should call onTerminate when the Terminate test button is clicked', () => {
      component.legalRequirements = [];
      fixture.detectChanges();
      spyOn(component, 'onTerminate');
      const button = fixture.debugElement.query(By.css('ion-button.terminate-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onTerminate).toHaveBeenCalled();
    });
  });
  describe('onCancel', () => {
    it('should call dismiss with CANCEL', async () => {
      spyOn(modalCtrl, 'dismiss');
      await component.onCancel();
      expect(await modalCtrl.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
    });
  });
  describe('onContinue', () => {
    it('should call dismiss with CONTINUE', async () => {
      spyOn(modalCtrl, 'dismiss');
      await component.onContinue();
      expect(await modalCtrl.dismiss).toHaveBeenCalledWith(ModalEvent.CONTINUE);
    });
  });
  describe('onTerminate', () => {
    it('should call dismiss with TERMINATE', async () => {
      spyOn(modalCtrl, 'dismiss');
      await component.onTerminate();
      expect(await modalCtrl.dismiss).toHaveBeenCalledWith(ModalEvent.TERMINATE);
    });
  });
});
