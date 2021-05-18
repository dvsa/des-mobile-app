import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { SpecialLegalRequirementModal } from '../special-legal-requirement-modal';
import { IonicModule, NavParams, ViewController } from 'ionic-angular';
import { NavParamsMock, ViewControllerMock } from 'ionic-mocks';
import { AppModule } from '../../../../../app/app.module';
import { By } from '@angular/platform-browser';
import { ComponentsModule } from '../../../../../components/common/common-components.module';
import { configureTestSuite } from 'ng-bullet';

describe('LegalRequirementsModal', () => {
  let fixture: ComponentFixture<SpecialLegalRequirementModal>;
  let component: SpecialLegalRequirementModal;

  configureTestSuite(() => {
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
        { provide: ViewController, useFactory: () => ViewControllerMock.instance() },
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SpecialLegalRequirementModal);
    component = fixture.componentInstance;
    component.onCancel = () => {
    };
    component.onTerminate = () => {
    };
    component.onProceed = () => {
    };
  }));

  describe('Class', () => {
  });

  describe('DOM', () => {
    it('should call onCancel when the Return to test button is clicked', () => {
      fixture.detectChanges();
      spyOn(component, 'onCancel');
      const button = fixture.debugElement.query(By.css('button.return-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onCancel).toHaveBeenCalled();
    });

    it('should call onTerminate when the Terminate test button is clicked', () => {
      fixture.detectChanges();
      spyOn(component, 'onTerminate');
      const button = fixture.debugElement.query(By.css('button.terminate-button'));
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
