import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule, NavParams, ModalController } from '@ionic/angular';
import { NavParamsMock, ModalControllerMock } from 'ionic-mocks';
import { AppModule } from 'src/app/app.module';
import { By } from '@angular/platform-browser';
import { ComponentsModule } from '@components/common/common-components.module';
import { configureTestSuite } from 'ng-bullet';
import { LegalRequirementsModal } from '../legal-requirements-modal';

describe('LegalRequirementsModal', () => {
  let fixture: ComponentFixture<LegalRequirementsModal>;
  let component: LegalRequirementsModal;

  configureTestSuite(() => {
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
        { provide: NavParams, useFactory: () => NavParamsMock.instance() },
        { provide: ModalController, useFactory: () => ModalControllerMock.instance() },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(LegalRequirementsModal);
    component = fixture.componentInstance;
    component.onCancel = () => Promise.resolve();
    component.onTerminate = () => Promise.resolve();
  }));

  describe('Class', () => {
  });

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
});
