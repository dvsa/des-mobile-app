import {
  ComponentFixture, waitForAsync, TestBed, fakeAsync, tick,
} from '@angular/core/testing';
import {
  IonicModule,
  NavController,
  Config,
  Platform,
  AlertController,
  ToastController,
} from '@ionic/angular';
import {
  ConfigMock,
  PlatformMock,
  AlertControllerMock,
} from 'ionic-mocks';
import { NavControllerMock } from '@shared/mocks/nav-controller-mock';
import { Store, StoreModule } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { WeatherConditions } from '@dvsa/mes-test-schema/categories/common';
import { of } from 'rxjs';
import { MockComponent } from 'ng-mocks';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { configureTestSuite } from 'ng-bullet';
import { ComponentsModule } from '@components/common/common-components.module';
import { AppModule } from 'src/app/app.module';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { StoreModel } from '@shared/models/store.model';
import { ToggleETA } from '@store/tests/test-data/common/eta/eta.actions';
import { TogglePlanningEco } from '@store/tests/test-data/common/eco/eco.actions';
import {
  AddDangerousFault,
} from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import { AddSeriousFault } from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import {
  ShowMeQuestionSelected,
} from '@store/tests/test-data/cat-b/vehicle-checks/vehicle-checks.actions';
import { EyesightTestFailed } from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import { ExaminerActions, Competencies } from '@store/tests/test-data/test-data.constants';
import { PersistTests } from '@store/tests/tests.actions';
import {
  WeatherConditionsChanged,
} from '@store/tests/test-summary/test-summary.actions';
import { FaultSummary } from '@shared/models/fault-marking.model';
import { ActivityCodes } from '@shared/models/activity-codes';
import { NavigationStateProvider } from '@providers/navigation-state/navigation-state';
import { NavigationStateProviderMock } from '@providers/navigation-state/__mocks__/navigation-state.mock';
import { SetActivityCode } from '@store/tests/activity-code/activity-code.actions';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { WeatherConditionProvider } from '@providers/weather-conditions/weather-condition';
import { QuestionProvider } from '@providers/question/question';
import { QuestionProviderMock } from '@providers/question/__mocks__/question.mock';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { OutcomeBehaviourMapProviderMock } from '@providers/outcome-behaviour-map/__mocks__/outcome-behaviour-map.mock';
import { RouteNumberComponent } from '../../components/route-number/route-number';
import { CandidateDescriptionComponent } from '../../components/candidate-description/candidate-description';
import { ShowMeQuestionComponent } from '../../components/show-me-question/show-me-question';
import { WeatherConditionsComponent } from '../../components/weather-conditions/weather-conditions';
import { AdditionalInformationComponent } from '../../components/additional-information/additional-information';
import { IdentificationComponent } from '../../components/identification/identification';
import { IndependentDrivingComponent } from '../../components/independent-driving/independent-driving';
import { FaultCommentCardComponent } from '../../components/fault-comment-card/fault-comment-card';
import { OfficeCatBPage } from '../office.cat-b.page';
import { ActivityCodeComponent } from '../../components/activity-code/activity-code';
import {
  ActivityCodeModel,
  activityCodeModelList,
  ActivityCodeDescription,
} from '../../components/activity-code/activity-code.constants';
import { CompleteTest, OfficeValidationError } from '../../office.actions';
import { ToastControllerMock } from '../../__mocks__/toast-controller-mock';
import { CandidateSectionComponent } from '../../components/candidate-section/candidate-section';
import { DateOfTest } from '../../components/date-of-test/date-of-test';

describe('OfficePage', () => {
  let fixture: ComponentFixture<OfficeCatBPage>;
  let component: OfficeCatBPage;
  let navController: NavController;
  let store$: Store<StoreModel>;
  let faultCountProvider: FaultCountProvider;

  const mockAlertCtrl = {
    create: () => {
      return {
        present: () => {
        },
      };
    },
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        OfficeCatBPage,
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
                category: TestCategory.B,
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
                    showMeQuestion: {
                      code: 'S3',
                      description: '',
                      outcome: '',
                    },
                    tellMeQuestion: {
                      code: '',
                      description: '',
                      outcome: '',
                    },
                  },
                  eyesightTest: {},
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
      ],
      providers: [
        WeatherConditionProvider,
        { provide: OutcomeBehaviourMapProvider, useClass: OutcomeBehaviourMapProviderMock },
        { provide: QuestionProvider, useClass: QuestionProviderMock },
        { provide: NavController, useClass: NavControllerMock },
        { provide: Config, useFactory: () => ConfigMock.instance() },
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: AlertController, useClass: AlertControllerMock },
        { provide: ToastController, useClass: ToastControllerMock },
        { provide: NavigationStateProvider, useClass: NavigationStateProviderMock },
        { provide: FaultCountProvider, useClass: FaultCountProvider },
        { provide: FaultSummaryProvider, useClass: FaultSummaryProvider },
        { provide: AlertController, useValue: mockAlertCtrl },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(OfficeCatBPage);
    component = fixture.componentInstance;
    navController = TestBed.inject(NavController);
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
    faultCountProvider = TestBed.inject(FaultCountProvider);
  }));

  describe('Class', () => {

    describe('weatherConditionsChanged', () => {
      it('should dispatch a weather conditions changed action with the weather condition values', () => {
        const conditions: WeatherConditions[] = ['Showers'];
        component.weatherConditionsChanged(conditions);
        expect(store$.dispatch).toHaveBeenCalledWith(WeatherConditionsChanged(conditions));
      });
    });
    describe('selecting a show me question', () => {
      it('should dispatch an action when show me question change handler is called', () => {
        const question: VehicleChecksQuestion = {
          code: 'S1',
          description: 'desc',
          shortName: 'name',
        };
        component.showMeQuestionChanged(question);
        expect(store$.dispatch).toHaveBeenCalledWith(ShowMeQuestionSelected(question));
      });
    });
    describe('selecting a activity code', () => {
      it('should dispatch a SetActivityCode action with the activity code', () => {
        component.activityCodeChanged(activityCodeModelList[0]);
        expect(store$.dispatch).toHaveBeenCalledWith(SetActivityCode(activityCodeModelList[0].activityCode));
      });
    });
    describe('completeTest', () => {
      it('should successfully end the test', () => {
        component.completeTest();

        expect(store$.dispatch).toHaveBeenCalledWith(CompleteTest());
      });
      it('should not dispatch complete test if in practice mode', () => {
        component.isPracticeMode = true;
        component.completeTest();

        expect(store$.dispatch).not.toHaveBeenCalledWith(CompleteTest());
      });
    });

    describe('shouldDisplayDrivingFaultComments', () => {
      it('should return false if there are less than 16 driving faults', () => {
        spyOn(faultCountProvider, 'getDrivingFaultSumCount').and.returnValue(15);
        spyOn(faultCountProvider, 'getSeriousFaultSumCount').and.returnValue(0);
        spyOn(faultCountProvider, 'getDangerousFaultSumCount').and.returnValue(0);

        const result = component.shouldDisplayDrivingFaultComments({});
        expect(result).toEqual(false);
      });
      it('should return true if there are more than 15 driving faults and no serious or dangerous faults', () => {
        spyOn(faultCountProvider, 'getDrivingFaultSumCount').and.returnValue(16);
        spyOn(faultCountProvider, 'getSeriousFaultSumCount').and.returnValue(0);
        spyOn(faultCountProvider, 'getDangerousFaultSumCount').and.returnValue(0);

        const result = component.shouldDisplayDrivingFaultComments({});
        expect(result).toEqual(true);
      });
      it('should return false if there are more than 15 driving faults and a serious fault', () => {
        spyOn(faultCountProvider, 'getDrivingFaultSumCount').and.returnValue(16);
        spyOn(faultCountProvider, 'getSeriousFaultSumCount').and.returnValue(1);
        spyOn(faultCountProvider, 'getDangerousFaultSumCount').and.returnValue(0);

        const result = component.shouldDisplayDrivingFaultComments({});
        expect(result).toEqual(false);
      });
      it('should return false if there are more than 15 driving faults and a dangerous fault', () => {
        spyOn(faultCountProvider, 'getDrivingFaultSumCount').and.returnValue(16);
        spyOn(faultCountProvider, 'getSeriousFaultSumCount').and.returnValue(0);
        spyOn(faultCountProvider, 'getDangerousFaultSumCount').and.returnValue(1);

        const result = component.shouldDisplayDrivingFaultComments({});
        expect(result).toEqual(false);
      });
    });
  });

  describe('DOM', () => {
    it('should pass the selected show me question code to the show me subcomponent', () => {
      fixture.detectChanges();
      const showMeElement = fixture.debugElement.query(By.css('show-me-question'))
        .componentInstance as ShowMeQuestionComponent;
      expect(showMeElement.showMeQuestion.code).toEqual('S3');
    });
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

    it('should display the serious fault comment textbox if the eyesight test is failed', () => {
      store$.dispatch(EyesightTestFailed());
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#seriousFaultComment'))).toBeDefined();
    });

    describe('deferring the write up', () => {
      it('should dispatch an action to persist tests + pop navstack to root when pressing save and continue', () => {
        fixture.detectChanges();
        const saveAndContinueButton = fixture.debugElement.query(By.css('#defer-button'));
        saveAndContinueButton.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(store$.dispatch).toHaveBeenCalledWith(PersistTests());
        expect(navController.navigateBack).toHaveBeenCalled();
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

  describe('popToRoot', () => {
    it('should call the navigateBack method in the navcontroller if not in practice mode', () => {
      component.popToRoot();
      expect(component.navController.navigateBack).toHaveBeenCalled();
    });
    it('should call the navigateBack method in the navcontroller if in practice mode.', () => {
      component.isPracticeMode = true;
      component.popToRoot();
      expect(component.navController.navigateBack).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    it('should dispatch the appropriate ValidationError actions', fakeAsync(() => {
      component.form = new FormGroup({
        requiredControl1: new FormControl(null, [Validators.required]),
        requiredControl2: new FormControl(null, [Validators.required]),
        notRequiredControl: new FormControl(null),
      });

      component.onSubmit();
      tick();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(OfficeValidationError('requiredControl1 is blank'));
      expect(store$.dispatch)
        .toHaveBeenCalledWith(OfficeValidationError('requiredControl2 is blank'));
      expect(store$.dispatch)
        .not
        .toHaveBeenCalledWith(OfficeValidationError('notRequiredControl is blank'));
    }));
  });
});
