import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { PracticeModeOptionsBar } from '@components/common/practice-mode-options-bar/practice-mode-options-bar';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonicModule, ModalController, Platform } from '@ionic/angular';
import { ModalControllerMock, PlatformMock } from '@mocks/index.mock';
import { StoreModule } from '@ngrx/store';
import { VehicleChecksComponent } from '@pages/test-report/cat-c/components/vehicle-checks/vehicle-checks';
import { ReverseLeftPopoverComponent } from '@pages/test-report/components/reverse-left-popover/reverse-left-popover';
import { ReverseLeftComponent } from '@pages/test-report/components/reverse-left/reverse-left';
import { UncoupleRecoupleComponent } from '@pages/test-report/components/uncouple-recouple/uncouple-recouple';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { TestReportValidatorProviderMock } from '@providers/test-report-validator/__mocks__/test-report-validator.mock';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { TestReportBasePageComponent } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { initialState } from '@store/tests/test-data/cat-b/test-data.reducer';
import { MockComponent } from 'ng-mocks';
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
import { TestReportCatCPage } from '../test-report.cat-c.page';

describe('TestReportCatCPage', () => {
  let fixture: ComponentFixture<TestReportCatCPage>;
  let component: TestReportCatCPage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestReportCatCPage,
        MockComponent(ReverseLeftPopoverComponent),
        MockComponent(ReverseLeftComponent),
        MockComponent(TickIndicatorComponent),
        MockComponent(CompetencyComponent),
        MockComponent(CompetencyButtonComponent),
        MockComponent(LegalRequirementComponent),
        MockComponent(EtaComponent),
        MockComponent(DrivingFaultSummaryComponent),
        MockComponent(ToolbarComponent),
        MockComponent(ControlledStopComponent),
        MockComponent(ManoeuvreCompetencyComponent),
        MockComponent(VehicleChecksComponent),
        MockComponent(EcoComponent),
        MockComponent(PracticeModeOptionsBar),
        MockComponent(TestFlowHeaderComponent),
        MockComponent(UncoupleRecoupleComponent),
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
          useClas: ModalControllerMock,
        },
        {
          provide: TestReportValidatorProvider,
          useClass: TestReportValidatorProviderMock,
        },
      ],
    });

    fixture = TestBed.createComponent(TestReportCatCPage);
    component = fixture.componentInstance;
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

    describe('showUncoupleRecouple', () => {
      it('should not show uncouple/recouple when not delegated', () => {
        component.isDelegated = false;
        expect(component.showUncoupleRecouple()).toEqual(false);
      });
      [
        {
          cat: TestCategory.C,
          show: false,
        },
        {
          cat: TestCategory.C1,
          show: false,
        },
        {
          cat: TestCategory.CE,
          show: true,
        },
        {
          cat: TestCategory.C1E,
          show: true,
        },
      ].forEach(({ cat, show }) => {
        it(`should ${show ? 'show' : 'not show'} uncouple/recouple for cat ${cat}`, () => {
          component.isDelegated = true;
          component.testCategory = cat;
          expect(component.showUncoupleRecouple()).toEqual(show);
        });
      });
    });
  });
});
