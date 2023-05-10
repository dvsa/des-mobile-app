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
import { StoreModule } from '@ngrx/store';
import { initialState } from '@store/tests/test-data/cat-b/test-data.reducer';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { TestReportValidatorProviderMock } from '@providers/test-report-validator/__mocks__/test-report-validator.mock';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { InsomniaMock } from '@shared/mocks/insomnia.mock';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import {
  SingleFaultCompetencyComponent,
} from '@pages/test-report/components/single-fault-competency/single-fault-competency';
import {
  SpeedCheckHeaderComponent,
} from '@pages/test-report/cat-a-mod1/components/speed-check-header/speed-check-header';
import { SpeedCheckComponent } from '@pages/test-report/cat-a-mod1/components/speed-check/speed-check';
import { EtaComponent } from '../../components/examiner-takes-action/eta';
import { LegalRequirementComponent } from '../../components/legal-requirement/legal-requirement';
import { testReportReducer } from '../../test-report.reducer';
import { ToolbarComponent } from '../../components/toolbar/toolbar';
import { DrivingFaultSummaryComponent } from '../../components/driving-fault-summary/driving-fault-summary';
import { CompetencyButtonComponent } from '../../components/competency-button/competency-button';
import { CompetencyComponent } from '../../components/competency/competency';
import { TestReportCatAMod1Page } from '../test-report.cat-a-mod1.page';
import { EcoComponent } from '../../components/eco/eco';

describe('TestReportCatAMod1Page', () => {
  let fixture: ComponentFixture<TestReportCatAMod1Page>;
  let component: TestReportCatAMod1Page;

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
        {
          provide: Insomnia,
          useClass: InsomniaMock,
        },
      ],
    });

    fixture = TestBed.createComponent(TestReportCatAMod1Page);
    component = fixture.componentInstance;
  });

  describe('DOM', () => {
    describe('Fault Modes Styling', () => {
      it('should not have any fault mode styles applied when serious and dangerous mode is disabled', () => {
        expect(fixture.debugElement.query(By.css('.serious-mode')))
          .toBeNull();
        expect(fixture.debugElement.query(By.css('.dangerous-mode')))
          .toBeNull();
      });
      it('should have serious fault mode styles applied when serious mode is enabled', () => {
        component.isSeriousMode = true;
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.serious-mode')))
          .toBeDefined();
        expect(fixture.debugElement.query(By.css('.dangerous-mode')))
          .toBeNull();
      });
      it('should have dangerous fault mode styles applied when dangerous mode is enabled', () => {
        component.isDangerousMode = true;
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.serious-mode')))
          .toBeNull();
        expect(fixture.debugElement.query(By.css('.dangerous-mode')))
          .toBeDefined();
      });
    });
  });

  describe('End Test Button', () => {
    it('should call the end test function', () => {
      spyOn(component, 'onEndTestClick');
      const endTestButton = fixture.debugElement.query(By.css('#end-test-button'));
      endTestButton.triggerEventHandler('click', null);
      expect(component.onEndTestClick)
        .toHaveBeenCalled();
    });
  });

});
