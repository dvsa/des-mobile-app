import {
  // ComponentFixture,
  waitForAsync, TestBed, ComponentFixture,
} from '@angular/core/testing';
import {
  IonicModule,
  NavController,
  Platform,
  ToastController, ModalController,
} from '@ionic/angular';
import {
  PlatformMock,
} from 'ionic-mocks';
import { NavControllerMock } from '@shared/mocks/nav-controller.mock';
import { Store, StoreModule } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { configureTestSuite } from 'ng-bullet';
import { ComponentsModule } from '@components/common/common-components.module';
import { AppModule } from 'src/app/app.module';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { StoreModel } from '@shared/models/store.model';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { WeatherConditionProvider } from '@providers/weather-conditions/weather-condition';
import { QuestionProvider } from '@providers/question/question';
import { QuestionProviderMock } from '@providers/question/__mocks__/question.mock';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { OutcomeBehaviourMapProviderMock } from '@providers/outcome-behaviour-map/__mocks__/outcome-behaviour-map.mock';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivityCodeModel, ActivityCodeDescription } from '@shared/constants/activity-code/activity-code.constants';
import { ActivityCodes } from '@shared/models/activity-codes';
import { ActivityCodeComponent } from '@components/common/activity-code/activity-code';
import { By } from '@angular/platform-browser';
import { Competencies, ExaminerActions } from '@store/tests/test-data/test-data.constants';
import { ToggleETA } from '@store/tests/test-data/common/eta/eta.actions';
import { TogglePlanningEco } from '@store/tests/test-data/common/eco/eco.actions';
import { AddDangerousFault } from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import { AddSeriousFault } from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import { of } from 'rxjs';
import { FaultSummary } from '@shared/models/fault-marking.model';
import { ToastControllerMock } from '@shared/mocks/toast-controller.mock';
import { VehicleChecksOfficeCardComponent } from '@pages/office/components/vehicle-checks/vehicle-checks-office-card';
import { DateOfTest } from '../../components/date-of-test/date-of-test';
import { CandidateSectionComponent } from '../../components/candidate-section/candidate-section';
import { OfficeCatCPage } from '../office.cat-c.page';
import { FaultCommentCardComponent } from '../../components/fault-comment-card/fault-comment-card';
import { IndependentDrivingComponent } from '../../components/independent-driving/independent-driving';
import { IdentificationComponent } from '../../components/identification/identification';
import { AdditionalInformationComponent } from '../../components/additional-information/additional-information';
import { WeatherConditionsComponent } from '../../components/weather-conditions/weather-conditions';
import { ShowMeQuestionComponent } from '../../components/show-me-question/show-me-question';
import { CandidateDescriptionComponent } from '../../components/candidate-description/candidate-description';
import { RouteNumberComponent } from '../../components/route-number/route-number';

describe('OfficeCatCPage', () => {
  let fixture: ComponentFixture<OfficeCatCPage>;
  let component: OfficeCatCPage;
  let store$: Store<StoreModel>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        OfficeCatCPage,
        MockComponent(RouteNumberComponent),
        MockComponent(CandidateDescriptionComponent),
        MockComponent(IdentificationComponent),
        MockComponent(ShowMeQuestionComponent),
        MockComponent(WeatherConditionsComponent),
        MockComponent(AdditionalInformationComponent),
        MockComponent(IndependentDrivingComponent),
        MockComponent(FaultCommentCardComponent),
        MockComponent(CandidateSectionComponent),
        MockComponent(DateOfTest),
        MockComponent(VehicleChecksOfficeCardComponent),
      ],
      imports: [
        IonicModule,
        AppModule,
        ComponentsModule,
        StoreModule.forRoot({
          tests: () => ({
            currentTest: {
              slotId: '123',
            },
            testStatus: {},
            startedTests: {
              123: {
                category: TestCategory.C,
                vehicleDetails: {},
                accompaniment: {},
                testData: {
                  dangerousFaults: {},
                  drivingFaults: {},
                  manoeuvres: {},
                  seriousFaults: {},
                  testRequirements: {},
                  ETA: {},
                  eco: {},
                  vehicleChecks: {
                    showMeQuestions: [],
                    tellMeQuestions: [],
                  },
                },
                activityCode: '28',
                journalData: {
                  candidate: {
                    candidateName: 'Joe Bloggs',
                    driverNumber: '123',
                  },
                },
                rekey: false,
              },
            },
          }),
        }),
        ReactiveFormsModule,
      ],
      providers: [
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: NavController, useClass: NavControllerMock },
        { provide: ToastController, useClass: ToastControllerMock },
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: OutcomeBehaviourMapProvider, useClass: OutcomeBehaviourMapProviderMock },
        WeatherConditionProvider,
        { provide: QuestionProvider, useClass: QuestionProviderMock },
        { provide: FaultSummaryProvider, useClass: FaultSummaryProvider },
        { provide: FaultCountProvider, useClass: FaultCountProvider },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(OfficeCatCPage);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
  }));

  describe('DOM', () => {
    it('should pass the selected activity code to the activity code subcomponent', () => {
      const activityCodeModel: ActivityCodeModel = {
        activityCode: ActivityCodes.ACCIDENT,
        description: ActivityCodeDescription.ACCIDENT,
      };
      fixture.detectChanges();
      const activityCodeElement = fixture.debugElement.query(By.css('activity-code'))
        .componentInstance as ActivityCodeComponent;
      expect(activityCodeElement.activityCodeModel).toEqual(activityCodeModel);
    });
    it('should hide ETA faults container if there are none', () => {
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#ETA'))).toBeNull();
    });
    it('should display ETA faults container if there are any', () => {
      store$.dispatch(ToggleETA(ExaminerActions.verbal));
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#ETA'))).toBeDefined();
    });
    it('should hide eco faults container if there are none', () => {
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#eco'))).toBeNull();
    });
    it('should display eco faults container if there are any', () => {
      store$.dispatch(TogglePlanningEco());
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#eco'))).toBeDefined();
    });
    it('should display eta fault details if there are any', () => {
      store$.dispatch(ToggleETA(ExaminerActions.verbal));
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#etaFaults'))).toBeDefined();
    });
    it('should display eco fault details if there are any', () => {
      store$.dispatch(TogglePlanningEco());
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#ecoFaults'))).toBeDefined();
    });
    it('should not display dangerous fault comment textbox if there are not any', () => {
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#dangerousFaultComment'))).toBeNull();
    });
    it('should display dangerous fault comment textbox if there are any', () => {
      store$.dispatch(AddDangerousFault(Competencies.judgementCrossing));
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#dangerousFaultComment'))).toBeDefined();
    });
    it('should not display serious fault comment textbox if there are not any', () => {
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#seriousFaultComment'))).toBeNull();
    });
    it('should display serious fault comment textbox if there are any', () => {
      store$.dispatch(AddSeriousFault(Competencies.judgementOvertaking));
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#seriousFaultComment'))).toBeDefined();
    });

    describe('deferring the write up', () => {
      it('should dispatch an action to persist tests + pop navstack to root when pressing save and continue', () => {
        spyOn(component, 'popToRoot');
        fixture.detectChanges();
        const saveAndContinueButton = fixture.debugElement.query(By.css('#office-save-button'));
        saveAndContinueButton.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(component.popToRoot).toHaveBeenCalled();
      });
    });

    describe('driving fault commentary', () => {
      it('should pass whether to render driving fault commentary to fault-comment-card', () => {
        const drivingFaultCommentCard: FaultCommentCardComponent = fixture.debugElement
          .query(By.css('#driving-fault-comment-card')).componentInstance;
        fixture.detectChanges();

        component.pageState.displayDrivingFaultComments$ = of(true);
        component.pageState.displayDrivingFault$ = of(true);
        fixture.detectChanges();
        expect(drivingFaultCommentCard.shouldRender).toBeTruthy();
        component.pageState.displayDrivingFaultComments$ = of(false);
        fixture.detectChanges();
        expect(drivingFaultCommentCard.shouldRender).toBeFalsy();
      });
    });

    describe('driving fault overview', () => {
      const drivingFaults: FaultSummary[] = [
        {
          competencyIdentifier: 'signalsTimed',
          competencyDisplayName: 'Signals - Timed',
          faultCount: 3,
          comment: 'dummy',
        },
        {
          competencyIdentifier: 'useOfSpeed',
          competencyDisplayName: 'Use of speed',
          faultCount: 1,
          comment: 'dummy',
        },
      ];
      it('should display a driving faults badge with the count for each type of driving fault on the test', () => {
        fixture.detectChanges();
        component.pageState.drivingFaults$ = of(drivingFaults);
        component.pageState.drivingFaultCount$ = of(4);
        component.pageState.displayDrivingFaultComments$ = of(false);
        component.pageState.displayDrivingFault$ = of(true);

        fixture.detectChanges();

        const drivingFaultBadges = fixture.debugElement.queryAll(By.css('driving-faults-badge'));
        expect(drivingFaultBadges.length).toBe(2);
        expect(drivingFaultBadges[0].componentInstance.count).toBe(3);
        expect(drivingFaultBadges[1].componentInstance.count).toBe(1);
      });
      it('should render the display name for each driving fault', () => {
        fixture.detectChanges();
        component.pageState.drivingFaults$ = of(drivingFaults);
        component.pageState.drivingFaultCount$ = of(4);
        component.pageState.displayDrivingFaultComments$ = of(false);
        component.pageState.displayDrivingFault$ = of(true);

        fixture.detectChanges();

        const faultLabels = fixture.debugElement.queryAll(By.css('.fault-label'));
        expect(faultLabels.length).toBe(2);
        expect(faultLabels[0].nativeElement.innerHTML).toBe('Signals - Timed');
        expect(faultLabels[1].nativeElement.innerHTML).toBe('Use of speed');
      });
    });
  });

});
