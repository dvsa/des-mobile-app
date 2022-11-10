import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule, NavParams, ModalController } from '@ionic/angular';
import { NavParamsMock, ModalControllerMock } from 'ionic-mocks';
import { AppModule } from 'src/app/app.module';
import { By } from '@angular/platform-browser';
import { ComponentsModule } from '@components/common/common-components.module';
import { SpecialLegalRequirementModal } from '../special-legal-requirement-modal';

describe('LegalRequirementsModal', () => {
  let fixture: ComponentFixture<SpecialLegalRequirementModal>;
  let component: SpecialLegalRequirementModal;

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
        { provide: NavParams, useFactory: () => NavParamsMock.instance() },
        { provide: ModalController, useFactory: () => ModalControllerMock.instance() },
      ],
    });

    fixture = TestBed.createComponent(SpecialLegalRequirementModal);
    component = fixture.componentInstance;
    component.onCancel = () => Promise.resolve();
    component.onTerminate = () => Promise.resolve();
    component.onProceed = () => Promise.resolve();
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
});
