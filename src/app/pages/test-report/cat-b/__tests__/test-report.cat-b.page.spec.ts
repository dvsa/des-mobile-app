import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController, Platform } from '@ionic/angular';
import { ModalControllerMock, PlatformMock } from '@mocks/index.mock';
import { MockComponent } from 'ng-mocks';

import { AppModule } from '@app/app.module';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { PracticeModeOptionsBar } from '@components/common/practice-mode-options-bar/practice-mode-options-bar';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { TestReportValidatorProviderMock } from '@providers/test-report-validator/__mocks__/test-report-validator.mock';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { BasePageComponent } from '@shared/classes/base-page';
import { TestReportBasePageComponent } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { StoreModel } from '@shared/models/store.model';
import { AppInfoStateModel } from '@store/app-info/app-info.model';
import { TestsModel } from '@store/tests/tests.model';
import { testsReducer } from '@store/tests/tests.reducer';
import { CompetencyButtonComponent } from '../../components/competency-button/competency-button';
import { CompetencyComponent } from '../../components/competency/competency';
import { ControlledStopComponent } from '../../components/controlled-stop/controlled-stop';
import { DrivingFaultSummaryComponent } from '../../components/driving-fault-summary/driving-fault-summary';
import { EcoComponent } from '../../components/eco/eco';
import { EtaComponent } from '../../components/examiner-takes-action/eta';
import { LegalRequirementComponent } from '../../components/legal-requirement/legal-requirement';
import { ManoeuvreCompetencyComponent } from '../../components/manoeuvre-competency/manoeuvre-competency';
import { ToolbarComponent } from '../../components/toolbar/toolbar';
import { testReportReducer } from '../../test-report.reducer';
import { ManoeuvresPopoverComponent } from '../components/manoeuvres-popover/manoeuvres-popover';
import { ManoeuvresComponent } from '../components/manoeuvres/manoeuvres';
import { VehicleCheckComponent } from '../components/vehicle-check/vehicle-check';
import { TestReportCatBPage } from '../test-report.cat-b.page';

describe('TestReportCatBPage', () => {
  let fixture: ComponentFixture<TestReportCatBPage>;
  let component: TestReportCatBPage;

  const initialState = {
    appInfo: { versionNumber: '4.0' } as AppInfoStateModel,
    tests: {
      currentTest: { slotId: '123' },
      testStatus: {},
      startedTests: {
        123: {
          vehicleDetails: {},
          accompaniment: {},
          instructorDetails: {},
          testData: {
            vehicleChecks: {
              tellMeQuestion: { code: 'T1', description: 'desc', outcome: CompetencyOutcome.P },
            },
            eyesightTest: {},
            seriousFaults: {},
          },
          journalData: {
            candidate: { candidateName: { firstName: 'Joe', lastName: 'Bloggs' } },
          },
        } as TestResultSchemasUnion,
      },
    } as TestsModel,
  } as StoreModel;

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
        MockComponent(PracticeModeOptionsBar),
      ],
      imports: [
        IonicModule,
        AppModule,
        StoreModule.forRoot({
          tests: testsReducer,
        }),
        StoreModule.forFeature('testReport', testReportReducer),
        MockComponent(TestFlowHeaderComponent),
      ],
      providers: [
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
        provideMockStore({ initialState }),
      ],
    });

    fixture = TestBed.createComponent(TestReportCatBPage);
    component = fixture.componentInstance;
    spyOn(BasePageComponent.prototype, 'isIos').and.returnValue(true);
    spyOn(ScreenOrientation, 'lock').and.returnValue(Promise.resolve());
  });

  describe('Class', () => {
    describe('ngOnInit', () => {
      it('should call setupSubscription on ngOnInit', () => {
        spyOn(component, 'setupSubscription');
        component.ngOnInit();
        expect(component.setupSubscription).toHaveBeenCalled();
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
});
