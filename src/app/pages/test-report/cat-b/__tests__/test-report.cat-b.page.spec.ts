import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KeepAwake as Insomnia } from '@capacitor-community/keep-awake';
import { IonicModule, ModalController, NavParams, Platform } from '@ionic/angular';
import { ModalControllerMock, NavParamsMock, PlatformMock } from '@mocks/index.mock';
import { MockComponent } from 'ng-mocks';

import { By } from '@angular/platform-browser';
import { AppModule } from '@app/app.module';
import { StatusBar } from '@capacitor/status-bar';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { StoreModule } from '@ngrx/store';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { TestReportValidatorProviderMock } from '@providers/test-report-validator/__mocks__/test-report-validator.mock';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { BasePageComponent } from '@shared/classes/base-page';
import { TestReportBasePageComponent } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { initialState } from '@store/tests/test-data/cat-b/test-data.reducer';
import { CompetencyButtonComponent } from '../../components/competency-button/competency-button';
import { CompetencyComponent } from '../../components/competency/competency';
import { ControlledStopComponent } from '../../components/controlled-stop/controlled-stop';
import { DrivingFaultSummaryComponent } from '../../components/driving-fault-summary/driving-fault-summary';
import { EcoComponent } from '../../components/eco/eco';
import { EtaComponent } from '../../components/examiner-takes-action/eta';
import { LegalRequirementComponent } from '../../components/legal-requirement/legal-requirement';
import { ManoeuvreCompetencyComponent } from '../../components/manoeuvre-competency/manoeuvre-competency';
import { ToolbarComponent } from '../../components/toolbar/toolbar';
import { ModalEvent } from '../../test-report.constants';
import { testReportReducer } from '../../test-report.reducer';
import { ManoeuvresPopoverComponent } from '../components/manoeuvres-popover/manoeuvres-popover';
import { ManoeuvresComponent } from '../components/manoeuvres/manoeuvres';
import { VehicleCheckComponent } from '../components/vehicle-check/vehicle-check';
import { TestReportCatBPage } from '../test-report.cat-b.page';

describe('TestReportCatBPage', () => {
  let fixture: ComponentFixture<TestReportCatBPage>;
  let component: TestReportCatBPage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestReportCatBPage,
        MockComponent(ManoeuvresPopoverComponent),
        MockComponent(ManoeuvresComponent),
        MockComponent(TickIndicatorComponent),
        MockComponent(CompetencyComponent),
        MockComponent(CompetencyButtonComponent),
        MockComponent(LegalRequirementComponent),
        MockComponent(EtaComponent),
        MockComponent(DrivingFaultSummaryComponent),
        MockComponent(ToolbarComponent),
        MockComponent(ControlledStopComponent),
        MockComponent(ManoeuvreCompetencyComponent),
        MockComponent(VehicleCheckComponent),
        MockComponent(EcoComponent),
        MockComponent(PracticeModeBanner),
      ],
      imports: [
        IonicModule,
        AppModule,
        StoreModule.forFeature('tests', () => ({
          currentTest: {
            slotId: '123',
          },
          testStatus: {},
          startedTests: {
            123: {
              testData: initialState,
              journalData: {
                candidate: candidateMock,
              },
            },
          },
        })),
        StoreModule.forFeature('testReport', testReportReducer),
      ],
      providers: [
        {
          provide: NavParams,
          useClass: NavParamsMock,
        },
        {
          provide: Platform,
          useClass: PlatformMock,
        },
        {
          provide: AuthenticationProvider,
          useClass: AuthenticationProviderMock,
        },
        {
          provide: DateTimeProvider,
          useClass: DateTimeProviderMock,
        },
        {
          provide: ModalController,
          useClass: ModalControllerMock,
        },
        {
          provide: TestReportValidatorProvider,
          useClass: TestReportValidatorProviderMock,
        },
      ],
    });

    fixture = TestBed.createComponent(TestReportCatBPage);
    component = fixture.componentInstance;
    spyOn(BasePageComponent.prototype, 'isIos').and.returnValue(true);
    spyOn(ScreenOrientation, 'lock').and.returnValue(Promise.resolve());
  });

  describe('Class', () => {
    describe('onModalDismiss', () => {
      it('should navigate to debrief page when passed a CONTINUE event', () => {
        spyOn(component.router, 'navigate');
        component.onModalDismiss(ModalEvent.CONTINUE);
        expect(component.router.navigate).toHaveBeenCalledWith([TestFlowPageNames.DEBRIEF_PAGE]);
      });
    });

    describe('ionViewWillEnter', () => {
      beforeEach(() => {
        spyOn(Insomnia, 'keepAwake');
      });
      it('should not enable the plugins when the test is not a practice test', async () => {
        component.isPracticeMode = false;
        spyOn(TestReportCatBPage.prototype, 'isIos').and.returnValue(false);
        spyOn(StatusBar, 'show');
        await component.ionViewWillEnter();
        expect(Insomnia.keepAwake).not.toHaveBeenCalled();
        expect(StatusBar.show).not.toHaveBeenCalled();
      });
      it('should enable the plugins when the test is a practice test', async () => {
        component.isPracticeMode = true;
        spyOn(TestReportCatBPage.prototype, 'isIos').and.returnValue(true);
        spyOn(StatusBar, 'hide');
        await component.ionViewWillEnter();
        expect(Insomnia.keepAwake).toHaveBeenCalled();
        expect(StatusBar.hide).toHaveBeenCalled();
      });
    });
  });

  describe('DOM', () => {
    describe('Fault Modes Styling', () => {
      it('should not have any fault mode styles applied when serious and dangerous mode is disabled', () => {
        expect(fixture.debugElement.query(By.css('.serious-mode'))).toBeNull();
        expect(fixture.debugElement.query(By.css('.dangerous-mode'))).toBeNull();
      });
      it('should have serious fault mode styles applied when serious mode is enabled', () => {
        component.isSeriousMode = true;
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.serious-mode'))).toBeDefined();
        expect(fixture.debugElement.query(By.css('.dangerous-mode'))).toBeNull();
      });
      it('should have dangerous fault mode styles applied when dangerous mode is enabled', () => {
        component.isDangerousMode = true;
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.serious-mode'))).toBeNull();
        expect(fixture.debugElement.query(By.css('.dangerous-mode'))).toBeDefined();
      });
    });
  });

  describe('End Test Button', () => {
    it('should call the end test function', () => {
      spyOn(component, 'onEndTestClick');
      const endTestButton = fixture.debugElement.query(By.css('#end-test-button'));
      endTestButton.triggerEventHandler('click', null);
      expect(component.onEndTestClick).toHaveBeenCalled();
    });
  });

  describe('ionViewDidEnter', () => {
    it("should call the base page's ionViewDidEnter", () => {
      spyOn(TestReportBasePageComponent.prototype, 'ionViewDidEnter');
      component.ionViewDidEnter();
      expect(TestReportBasePageComponent.prototype.ionViewDidEnter).toHaveBeenCalled();
    });
  });

  describe('ionViewWillLeave', () => {
    it("should call the base page's ionViewWillLeave", async () => {
      spyOn(TestReportBasePageComponent.prototype, 'ionViewWillLeave');
      await component.ionViewWillLeave();
      expect(TestReportBasePageComponent.prototype.ionViewWillLeave).toHaveBeenCalled();
    });
  });

  describe('ionViewDidLeave', () => {
    it("should call the base page's ionViewDidLeave and cancelSubscription", () => {
      spyOn(TestReportBasePageComponent.prototype, 'ionViewDidLeave');
      spyOn(TestReportBasePageComponent.prototype, 'cancelSubscription');
      component.ionViewDidLeave();
      expect(TestReportBasePageComponent.prototype.ionViewDidLeave).toHaveBeenCalled();
      expect(TestReportBasePageComponent.prototype.cancelSubscription).toHaveBeenCalled();
    });
  });
});
