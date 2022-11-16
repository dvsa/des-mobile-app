import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule, NavParams, ModalController } from '@ionic/angular';
import { NavParamsMock, ModalControllerMock } from '@mocks/index.mock';
import { AppModule } from 'src/app/app.module';
import { By } from '@angular/platform-browser';
import { EndTestModal } from '../end-test-modal';

describe('EndTestModal', () => {
  let fixture: ComponentFixture<EndTestModal>;
  let component: EndTestModal;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
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
    component = fixture.componentInstance;
    component.onContinue = () => Promise.resolve();
    component.onCancel = () => Promise.resolve();
    component.onTerminate = () => Promise.resolve();
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
});
