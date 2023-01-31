import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  IonicModule, ModalController, NavParams, Platform,
} from '@ionic/angular';
import { ModalControllerMock, NavParamsMock, PlatformMock } from '@mocks/index.mock';
import { MockComponent } from 'ng-mocks';

import { AppModule } from '@app/app.module';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { By } from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';
import { initialState } from '@store/tests/test-data/cat-b/test-data.reducer';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { TestReportValidatorProviderMock } from '@providers/test-report-validator/__mocks__/test-report-validator.mock';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { InsomniaMock } from '@shared/mocks/insomnia.mock';
import { ScreenOrientationMock } from '@shared/mocks/screen-orientation.mock';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import {
  SingleFaultCompetencyComponent,
} from '@pages/test-report/components/single-fault-competency/single-fault-competency';
import {
  SpeedCheckHeaderComponent,
} from '@pages/test-report/cat-a-mod1/components/speed-check-header/speed-check-header';
import { SpeedCheckComponent } from '@pages/test-report/cat-a-mod1/components/speed-check/speed-check';
import { Subscription } from 'rxjs';
import { EtaInvalidModal } from '@pages/test-report/components/eta-invalid-modal/eta-invalid-modal';
import { SpeedCheckState } from '@providers/test-report-validator/test-report-validator.constants';
import {
  ActivityCode4Modal,
} from '@pages/test-report/cat-a-mod1/components/activity-code-4-modal/activity-code-4-modal';
import {
  ModalReason,
} from '@pages/test-report/cat-a-mod1/components/activity-code-4-modal/activity-code-4-modal.constants';
import { StoreModel } from '@shared/models/store.model';
import {
  EmergencyStopDangerousFaultModelOpened, EmergencyStopSeriousFaultModelOpened,
  SpeedRequirementNotMetModalOpened,
} from '@pages/test-report/cat-a-mod1/test-report.cat-a-mod1.actions';
import { SpeedCheckModal } from '@pages/test-report/cat-a-mod1/components/speed-check-modal/speed-check-modal';
import { competencyLabels } from '@shared/constants/competencies/competencies';
import { EndTestModal } from '@pages/test-report/components/end-test-modal/end-test-modal';
import { ModalEvent } from '@pages/dashboard/components/practice-test-modal/practice-test-modal.constants';
import { OverlayEventDetail } from '@ionic/core';
import { EtaComponent } from '../../components/examiner-takes-action/eta';
import { LegalRequirementComponent } from '../../components/legal-requirement/legal-requirement';
import { testReportReducer } from '../../test-report.reducer';
import { ToolbarComponent } from '../../components/toolbar/toolbar';
import { DrivingFaultSummaryComponent } from '../../components/driving-fault-summary/driving-fault-summary';
import { CompetencyButtonComponent } from '../../components/competency-button/competency-button';
import { CompetencyComponent } from '../../components/competency/competency';
import { TestReportCatAMod1Page } from '../test-report.cat-a-mod1.page';
import { EcoComponent } from '../../components/eco/eco';
import Expected = jasmine.Expected;

describe('TestReportCatAMod1Page', () => {
  let fixture: ComponentFixture<TestReportCatAMod1Page>;
  let component: TestReportCatAMod1Page;
  let store$: Store<StoreModel>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestReportCatAMod1Page,
        MockComponent(TickIndicatorComponent),
        MockComponent(CompetencyComponent),
        MockComponent(CompetencyButtonComponent),
        MockComponent(LegalRequirementComponent),
        MockComponent(EtaComponent),
        MockComponent(DrivingFaultSummaryComponent),
        MockComponent(ToolbarComponent),
        MockComponent(EcoComponent),
        MockComponent(PracticeModeBanner),
        MockComponent(SingleFaultCompetencyComponent),
        MockComponent(SpeedCheckHeaderComponent),
        MockComponent(SpeedCheckComponent),
      ],
      imports: [
        IonicModule,
        AppModule,
        StoreModule.forFeature('tests', () => (
          {
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
        { provide: NavParams, useClass: NavParamsMock },
        { provide: Platform, useClass: PlatformMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: TestReportValidatorProvider, useClass: TestReportValidatorProviderMock },
        { provide: ScreenOrientation, useClass: ScreenOrientationMock },
        { provide: Insomnia, useClass: InsomniaMock },
      ],
    });

    fixture = TestBed.createComponent(TestReportCatAMod1Page);
    store$ = TestBed.inject(Store);
    component = fixture.componentInstance;
    spyOn(store$, 'dispatch');
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

  describe('createEtaInvalidModal', () => {
    it('should create a modal if isEtaValid is false', () => {
      component.isEtaValid = false;
      spyOn(component.modalController, 'create').and.callThrough();
      component.createEtaInvalidModal();
      expect(component.modalController.create).toHaveBeenCalledWith({
        component: EtaInvalidModal,
        componentProps: {},
        cssClass: 'mes-modal-alert text-zoom-regular',
      });
    });
    it('should return null if isEtaValid is true', () => {
      component.isEtaValid = true;
      expect(component.createEtaInvalidModal()).toEqual(null);
    });
  });

  describe('createEndTestModal', () => {
    it('should create a modal if speedCheckState is VALID', () => {
      component.speedCheckState = SpeedCheckState.VALID;
      spyOn(component.modalController, 'create').and.callThrough();
      component.createEndTestModal();
      expect(component.modalController.create).toHaveBeenCalledWith({
        component: EndTestModal,
        componentProps: {},
        cssClass: 'mes-modal-alert text-zoom-regular',
      });
    });
    it('should return null if isEtaValid is true', () => {
      component.speedCheckState = SpeedCheckState.AVOIDANCE_MISSING;
      expect(component.createEndTestModal()).toEqual(null);
    });
  });

  describe('createActivityCode4Modal', () => {
    it('should create a modal with a modalReason of SPEED_REQUIREMENTS if speedCheckState is NOT_MET', () => {
      component.speedCheckState = SpeedCheckState.NOT_MET;
      spyOn(component.modalController, 'create').and.callThrough();
      component.createActivityCode4Modal();
      expect(component.modalController.create).toHaveBeenCalledWith({
        component: ActivityCode4Modal,
        componentProps: { modalReason: ModalReason.SPEED_REQUIREMENTS },
        cssClass: 'mes-modal-alert text-zoom-regular',
      });
    });
    it('should dispatch SpeedRequirementNotMetModalOpened if speedCheckState is NOT_MET', () => {
      component.speedCheckState = SpeedCheckState.NOT_MET;
      component.createActivityCode4Modal();
      expect(store$.dispatch).toHaveBeenCalledWith(SpeedRequirementNotMetModalOpened());
    });
    it('should create a modal with a modalReason of EMERGENCY_STOP_DANGEROUS '
        + 'if speedCheckState is EMERGENCY_STOP_DANGEROUS_FAULT', () => {
      component.speedCheckState = SpeedCheckState.EMERGENCY_STOP_DANGEROUS_FAULT;
      spyOn(component.modalController, 'create').and.callThrough();
      component.createActivityCode4Modal();
      expect(component.modalController.create).toHaveBeenCalledWith({
        component: ActivityCode4Modal,
        componentProps: { modalReason: ModalReason.EMERGENCY_STOP_DANGEROUS },
        cssClass: 'mes-modal-alert text-zoom-regular',
      });
    });
    it('should dispatch SpeedRequirementNotMetModalOpened if speedCheckState is EMERGENCY_STOP_DANGEROUS_FAULT', () => {
      component.speedCheckState = SpeedCheckState.EMERGENCY_STOP_DANGEROUS_FAULT;
      component.createActivityCode4Modal();
      expect(store$.dispatch).toHaveBeenCalledWith(EmergencyStopDangerousFaultModelOpened());
    });
    it('should create a modal with a modalReason of EMERGENCY_STOP_SERIOUS '
        + 'if speedCheckState is EMERGENCY_STOP_SERIOUS_FAULT', () => {
      component.speedCheckState = SpeedCheckState.EMERGENCY_STOP_SERIOUS_FAULT;
      spyOn(component.modalController, 'create').and.callThrough();
      component.createActivityCode4Modal();
      expect(component.modalController.create).toHaveBeenCalledWith({
        component: ActivityCode4Modal,
        componentProps: { modalReason: ModalReason.EMERGENCY_STOP_SERIOUS },
        cssClass: 'mes-modal-alert text-zoom-regular',
      });
    });
    it('should dispatch EmergencyStopSeriousFaultModelOpened '
        + 'if speedCheckState is EMERGENCY_STOP_SERIOUS_FAULT', () => {
      component.speedCheckState = SpeedCheckState.EMERGENCY_STOP_SERIOUS_FAULT;
      component.createActivityCode4Modal();
      expect(store$.dispatch).toHaveBeenCalledWith(EmergencyStopSeriousFaultModelOpened());
    });
    it('should return null if speedCheckState is not applicable', () => {
      component.speedCheckState = SpeedCheckState.AVOIDANCE_MISSING;
      expect(component.createActivityCode4Modal()).toEqual(null);
    });
  });

  describe('createSpeedCheckModal', () => {
    it('should create a modal with a speedChecksNeedCompleting of '
        + 'speedCheckEmergency and speedCheckAvoidance if '
        + 'speedCheckState is EMERGENCY_STOP_AND_AVOIDANCE_MISSING', () => {
      component.speedCheckState = SpeedCheckState.EMERGENCY_STOP_AND_AVOIDANCE_MISSING;
      spyOn(component.modalController, 'create').and.callThrough();
      component.createSpeedCheckModal();
      expect(component.modalController.create).toHaveBeenCalledWith({
        component: SpeedCheckModal,
        componentProps: {
          speedChecksNeedCompleting: [competencyLabels.speedCheckEmergency, competencyLabels.speedCheckAvoidance],
        },
        cssClass: 'mes-modal-alert text-zoom-regular',
      });
    });
    it('should create a modal with a speedChecksNeedCompleting of speedCheckEmergency '
        + 'if speedCheckState is EMERGENCY_STOP_MISSING', () => {
      component.speedCheckState = SpeedCheckState.EMERGENCY_STOP_MISSING;
      spyOn(component.modalController, 'create').and.callThrough();
      component.createSpeedCheckModal();
      expect(component.modalController.create).toHaveBeenCalledWith({
        component: SpeedCheckModal,
        componentProps: {
          speedChecksNeedCompleting: [competencyLabels.speedCheckEmergency],
        },
        cssClass: 'mes-modal-alert text-zoom-regular',
      });
    });
    it('should create a modal with a speedChecksNeedCompleting of speedCheckAvoidance '
        + 'if speedCheckState is AVOIDANCE_MISSING', () => {
      component.speedCheckState = SpeedCheckState.AVOIDANCE_MISSING;
      spyOn(component.modalController, 'create').and.callThrough();
      component.createSpeedCheckModal();
      expect(component.modalController.create).toHaveBeenCalledWith({
        component: SpeedCheckModal,
        componentProps: { speedChecksNeedCompleting: [competencyLabels.speedCheckAvoidance] },
        cssClass: 'mes-modal-alert text-zoom-regular',
      });
    });
    it('should return null if speedCheckState is not applicable', () => {
      component.speedCheckState = SpeedCheckState.VALID;
      expect(component.createSpeedCheckModal()).toEqual(null);
    });
  });

  describe('ionViewDidLeave', () => {
    it('should unsubscribe from the subscription if there is one', () => {
      component.subscription = new Subscription();
      spyOn(component.subscription, 'unsubscribe');
      component.ionViewDidLeave();
      expect(component.subscription.unsubscribe)
        .toHaveBeenCalled();
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

  describe('onEndTestClick', () => {
    it('should call onModalDismiss with the data returned', async () => {
      component.isEtaValid = false;
      spyOn(component.modalController, 'create').and.returnValue(Promise.resolve({
        present: () => Promise.resolve(),
        onDidDismiss: () => ({
          data: ModalEvent.CANCEL,
        }) as OverlayEventDetail,
      } as HTMLIonModalElement));
      spyOn(component, 'onModalDismiss').and.callThrough();

      await component.onEndTestClick();
      expect(component.onModalDismiss).toHaveBeenCalledWith(ModalEvent.CANCEL as Expected<any>);
    });
    it('should call createSpeedCheckModal if modal is still null at that point', async () => {
      component.isEtaValid = true;
      component.speedCheckState = SpeedCheckState.EMERGENCY_STOP_AND_AVOIDANCE_MISSING;
      spyOn(component, 'createSpeedCheckModal').and.callThrough();

      await component.onEndTestClick();
      expect(component.createSpeedCheckModal).toHaveBeenCalled();
    });
    it('should call createActivityCode4Modal if modal is still null at that point', async () => {
      component.isEtaValid = true;
      component.speedCheckState = SpeedCheckState.NOT_MET;
      spyOn(component, 'createActivityCode4Modal').and.callThrough();

      await component.onEndTestClick();
      expect(component.createActivityCode4Modal).toHaveBeenCalled();
    });
    it('should call createEndTestModal if modal is still null at that point', async () => {
      component.isEtaValid = true;
      component.speedCheckState = SpeedCheckState.VALID;
      spyOn(component, 'createEndTestModal').and.callThrough();

      await component.onEndTestClick();
      expect(component.createEndTestModal).toHaveBeenCalled();
    });
  });

});
