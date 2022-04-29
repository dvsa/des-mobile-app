import {
  ComponentFixture, waitForAsync, TestBed,
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
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import { ShowMeQuestionSelected } from '@store/tests/test-data/cat-b/vehicle-checks/vehicle-checks.actions';
import { By } from '@angular/platform-browser';
import { ToggleETA } from '@store/tests/test-data/common/eta/eta.actions';
import { Competencies, ExaminerActions } from '@store/tests/test-data/test-data.constants';
import { AddDangerousFault } from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import { of } from 'rxjs';
import { ActivityCodes } from '@shared/models/activity-codes';
import { TogglePlanningEco } from '@store/tests/test-data/common/eco/eco.actions';
import { EyesightTestFailed } from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import { AddSeriousFault } from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import { ActivityCodeDescription, ActivityCodeModel } from '@shared/constants/activity-code/activity-code.constants';
import { ActivityCodeComponent } from '@components/common/activity-code/activity-code';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastControllerMock } from '@shared/mocks/toast-controller.mock';
import {
  VehicleDetailsCardComponent,
} from '@pages/waiting-room-to-car/components/vehicle-details-card/vehicle-details-card';
import { VehicleDetailsComponent } from '@pages/waiting-room-to-car/components/vehicle-details/vehicle-details';
import {
  AccompanimentCardComponent,
} from '@pages/waiting-room-to-car/components/accompaniment-card/accompaniment-card';
import { AccompanimentComponent } from '@pages/waiting-room-to-car/components/accompaniment/accompaniment';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DrivingFaultsComponent } from '@pages/office/components/driving-faults/driving-faults.component';
import { DateOfTest } from '../../components/date-of-test/date-of-test';
import { CandidateSectionComponent } from '../../components/candidate-section/candidate-section';
import { OfficeCatBPage } from '../office.cat-b.page';
import { FaultCommentCardComponent } from '../../components/fault-comment-card/fault-comment-card';
import { IndependentDrivingComponent } from '../../components/independent-driving/independent-driving';
import { IdentificationComponent } from '../../components/identification/identification';
import { AdditionalInformationComponent } from '../../components/additional-information/additional-information';
import { WeatherConditionsComponent } from '../../components/weather-conditions/weather-conditions';
import { ShowMeQuestionComponent } from '../../components/show-me-question/show-me-question';
import { CandidateDescriptionComponent } from '../../components/candidate-description/candidate-description';
import { RouteNumberComponent } from '../../components/route-number/route-number';
import { TrueLikenessComponent } from '../../components/true-likeness/true-likeness';

// TODO - MES-7286 - increase code coverage of unit tests in this file.

describe('OfficeCatBPage', () => {
  let fixture: ComponentFixture<OfficeCatBPage>;
  let component: OfficeCatBPage;
  let store$: Store<StoreModel>;
  let faultCountProvider: FaultCountProvider;

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
        MockComponent(TrueLikenessComponent),
        MockComponent(VehicleDetailsCardComponent),
        MockComponent(VehicleDetailsComponent),
        MockComponent(AccompanimentCardComponent),
        MockComponent(AccompanimentComponent),
        MockComponent(DrivingFaultsComponent),
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
        { provide: DeviceProvider, useClass: DeviceProviderMock },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(OfficeCatBPage);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
    faultCountProvider = TestBed.inject(FaultCountProvider);
  }));

  describe('Class', () => {

    describe('selecting a show me question', () => {
      it('should dispatch an action when show me question change handler is called', () => {
        const question: VehicleChecksQuestion = {
          code: 'S1',
          description: 'desc',
          shortName: 'name',
        };
        component.showMeQuestionChanged(question);
        expect(store$.dispatch)
          .toHaveBeenCalledWith(ShowMeQuestionSelected(question));
      });
    });

    describe('shouldDisplayDrivingFaultComments', () => {
      it('should return false if there are less than 16 driving faults', () => {
        spyOn(faultCountProvider, 'getDrivingFaultSumCount')
          .and
          .returnValue(15);
        spyOn(faultCountProvider, 'getSeriousFaultSumCount')
          .and
          .returnValue(0);
        spyOn(faultCountProvider, 'getDangerousFaultSumCount')
          .and
          .returnValue(0);

        const result = component.shouldDisplayDrivingFaultComments({});
        expect(result)
          .toEqual(false);
      });
      it('should return true if there are more than 15 driving faults and no serious or dangerous faults', () => {
        spyOn(faultCountProvider, 'getDrivingFaultSumCount')
          .and
          .returnValue(16);
        spyOn(faultCountProvider, 'getSeriousFaultSumCount')
          .and
          .returnValue(0);
        spyOn(faultCountProvider, 'getDangerousFaultSumCount')
          .and
          .returnValue(0);

        const result = component.shouldDisplayDrivingFaultComments({});
        expect(result)
          .toEqual(true);
      });
      it('should return false if there are more than 15 driving faults and a serious fault', () => {
        spyOn(faultCountProvider, 'getDrivingFaultSumCount')
          .and
          .returnValue(16);
        spyOn(faultCountProvider, 'getSeriousFaultSumCount')
          .and
          .returnValue(1);
        spyOn(faultCountProvider, 'getDangerousFaultSumCount')
          .and
          .returnValue(0);

        const result = component.shouldDisplayDrivingFaultComments({});
        expect(result)
          .toEqual(false);
      });
      it('should return false if there are more than 15 driving faults and a dangerous fault', () => {
        spyOn(faultCountProvider, 'getDrivingFaultSumCount')
          .and
          .returnValue(16);
        spyOn(faultCountProvider, 'getSeriousFaultSumCount')
          .and
          .returnValue(0);
        spyOn(faultCountProvider, 'getDangerousFaultSumCount')
          .and
          .returnValue(1);

        const result = component.shouldDisplayDrivingFaultComments({});
        expect(result)
          .toEqual(false);
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
  });
});
