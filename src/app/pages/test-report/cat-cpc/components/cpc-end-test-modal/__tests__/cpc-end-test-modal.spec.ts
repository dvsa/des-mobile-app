import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { NavParamsMock } from '@mocks/index.mock';
import { AppModule } from '@app/app.module';
import { By } from '@angular/platform-browser';
import { ActivityCodes } from '@shared/models/activity-codes';
import { TestOutcome } from '@store/tests/tests.constants';
import { MockComponent } from 'ng-mocks';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { ModalEvent } from '../../../../test-report.constants';
import { ModalResultItemComponent } from '../components/modal-result-item/modal-result-item';
import { CPCEndTestModal } from '../cpc-end-test-modal';

describe('CPCEndTestModal', () => {
  let fixture: ComponentFixture<CPCEndTestModal>;
  let component: CPCEndTestModal;
  let modalController: ModalController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CPCEndTestModal,
        MockComponent(ModalResultItemComponent),
      ],
      imports: [
        AppModule,
        IonicModule,
      ],
      providers: [
        {
          provide: NavParams,
          useClass: NavParamsMock,
        },
        {
          provide: ModalController,
          useClass: ModalControllerMock,
        },
      ],
    });

    fixture = TestBed.createComponent(CPCEndTestModal);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
    spyOn(modalController, 'dismiss');
  }));

  describe('DOM', () => {
    it('should call onContinue when the Continue to debrief button is clicked', () => {
      fixture.detectChanges();
      spyOn(component, 'onContinue');
      const button = fixture.debugElement.query(By.css('ion-button.mes-primary-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onContinue)
        .toHaveBeenCalled();
    });

    it('should call onCancel when the Return to test button is clicked', () => {
      fixture.detectChanges();
      spyOn(component, 'onCancel');
      const button = fixture.debugElement.query(By.css('ion-button.return-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onCancel)
        .toHaveBeenCalled();
    });

    it('should call onTerminate when the Terminate test button is clicked', () => {
      fixture.detectChanges();
      spyOn(component, 'onTerminate');
      const button = fixture.debugElement.query(By.css('ion-button.terminate-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onTerminate)
        .toHaveBeenCalled();
    });
  });

  describe('Class', () => {
    describe('onCancel', () => {
      it('should dismiss the view controller with cancel event', async () => {
        await component.onCancel();
        expect(modalController.dismiss)
          .toHaveBeenCalledWith(ModalEvent.CANCEL);
      });
    });
    describe('onContinue', () => {
      it('should dismiss the view controller with continue event', async () => {
        await component.onContinue();
        expect(modalController.dismiss)
          .toHaveBeenCalledWith(ModalEvent.CONTINUE);
      });
    });
    describe('onTerminate', () => {
      it('should dismiss the view controller with terminate event', async () => {
        await component.onTerminate();
        expect(modalController.dismiss)
          .toHaveBeenCalledWith(ModalEvent.TERMINATE);
      });
    });
    describe('getTestResultLabel', () => {
      let label: string;
      it('should return the correct label for a pass', () => {
        component.testResult = ActivityCodes.PASS;
        label = component.getTestResultLabel();
        expect(label)
          .toEqual(TestOutcome.Passed);
      });
      it('should return the correct label for a fail', () => {
        component.testResult = ActivityCodes.FAIL;
        label = component.getTestResultLabel();
        expect(label)
          .toEqual(TestOutcome.Failed);
      });
    });
    describe('getTestResultClass', () => {
      let cssClass: string;
      it('should return the correct class for a pass', () => {
        component.testResult = ActivityCodes.PASS;
        cssClass = component.getTestResultClass();
        expect(cssClass)
          .toEqual('test-result-pass-label');
      });
      it('should return the correct class for a fail', () => {
        component.testResult = ActivityCodes.FAIL;
        cssClass = component.getTestResultClass();
        expect(cssClass)
          .toEqual('test-result-fail-label');
      });
    });
  });

});
