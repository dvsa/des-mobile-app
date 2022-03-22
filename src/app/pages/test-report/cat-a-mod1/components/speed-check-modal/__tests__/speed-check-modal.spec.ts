import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavParams, ModalController } from '@ionic/angular';
import { NavParamsMock } from 'ionic-mocks';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from '@app/app.module';
import { ComponentsModule } from '@components/common/common-components.module';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { SpeedCheckModal } from '../speed-check-modal';

describe('SpeedCheckModal', () => {
  let fixture: ComponentFixture<SpeedCheckModal>;
  let component: SpeedCheckModal;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        SpeedCheckModal,
      ],
      imports: [
        AppModule,
        IonicModule,
        ComponentsModule,
      ],
      providers: [
        { provide: NavParams, useFactory: () => NavParamsMock.instance() },
        { provide: ModalController, useClass: ModalControllerMock },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(SpeedCheckModal);
    component = fixture.componentInstance;
    component.onCancel = async () => {};
    component.onTerminate = async () => {};
  }));

  describe('DOM', () => {
    it('should call onCancel when the Return to test button is clicked', () => {
      component.speedChecksNeedCompleting = [];
      fixture.detectChanges();
      spyOn(component, 'onCancel');
      const button = fixture.debugElement.query(By.css('ion-button.modal-return-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onCancel).toHaveBeenCalled();
    });

    it('should call onTerminate when the Terminate test button is clicked', () => {
      component.speedChecksNeedCompleting = [];
      fixture.detectChanges();
      spyOn(component, 'onTerminate');
      const button = fixture.debugElement.query(By.css('ion-button.terminate-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onTerminate).toHaveBeenCalled();
    });
  });
});
