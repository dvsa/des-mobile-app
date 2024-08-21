import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivityCodeComponent } from '@components/common/activity-code/activity-code';
import { ComponentsModule } from '@components/common/common-components.module';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonicModule, ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { ModalControllerMock, PlatformMock } from '@mocks/index.mock';
import { Store, StoreModule } from '@ngrx/store';
import { CircuitComponent } from '@pages/office/cat-a-mod1/components/circuit/circuit';
import { DrivingFaultsComponent } from '@pages/office/components/driving-faults/driving-faults.component';
import { OfficeFooterComponent } from '@pages/office/components/office-footer/office-footer.component';
import { TrueLikenessComponent } from '@pages/office/components/true-likeness/true-likeness';
import { VehicleChecksOfficeCardComponent } from '@pages/office/components/vehicle-checks/vehicle-checks-office-card';
import { AccompanimentCardComponent } from '@pages/waiting-room-to-car/components/accompaniment-card/accompaniment-card';
import { AccompanimentComponent } from '@pages/waiting-room-to-car/components/accompaniment/accompaniment';
import { VehicleDetailsCardComponent } from '@pages/waiting-room-to-car/components/vehicle-details-card/vehicle-details-card';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DeviceProvider } from '@providers/device/device';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { OutcomeBehaviourMapProviderMock } from '@providers/outcome-behaviour-map/__mocks__/outcome-behaviour-map.mock';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { QuestionProviderMock } from '@providers/question/__mocks__/question.mock';
import { QuestionProvider } from '@providers/question/question';
import { WeatherConditionProvider } from '@providers/weather-conditions/weather-condition';
import { BasePageComponent } from '@shared/classes/base-page';
import { ActivityCodeDescription, ActivityCodeModel } from '@shared/constants/activity-code/activity-code.constants';
import { NavControllerMock } from '@shared/mocks/nav-controller.mock';
import { ToastControllerMock } from '@shared/mocks/toast-controller.mock';
import { ActivityCodes } from '@shared/models/activity-codes';
import { CommentSource } from '@shared/models/fault-marking.model';
import { StoreModel } from '@shared/models/store.model';
import { PipesModule } from '@shared/pipes/pipes.module';
import { AddAvoidanceComment } from '@store/tests/test-data/cat-a-mod1/avoidance/avoidance.actions';
import { AddAnEmergencyStopComment } from '@store/tests/test-data/cat-a-mod1/emergency-stop/emergency-stop.actions';
import {
  AddDangerousFault,
  AddDangerousFaultComment,
} from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import { AddDrivingFaultComment } from '@store/tests/test-data/common/driving-faults/driving-faults.actions';
import { TogglePlanningEco } from '@store/tests/test-data/common/eco/eco.actions';
import { ToggleETA } from '@store/tests/test-data/common/eta/eta.actions';
import {
  AddSeriousFault,
  AddSeriousFaultComment,
} from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import { AddSingleFaultCompetencyComment } from '@store/tests/test-data/common/single-fault-competencies/single-fault-competencies.actions';
import { Competencies, ExaminerActions, SingleFaultCompetencyNames } from '@store/tests/test-data/test-data.constants';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { AdditionalInformationComponent } from '../../components/additional-information/additional-information';
import { CandidateDescriptionComponent } from '../../components/candidate-description/candidate-description';
import { CandidateSectionComponent } from '../../components/candidate-section/candidate-section';
import { DateOfTest } from '../../components/date-of-test/date-of-test';
import { FaultCommentCardComponent } from '../../components/fault-comment-card/fault-comment-card';
import { IdentificationComponent } from '../../components/identification/identification';
import { IndependentDrivingComponent } from '../../components/independent-driving/independent-driving';
import { RouteNumberComponent } from '../../components/route-number/route-number';
import { ShowMeQuestionComponent } from '../../components/show-me-question/show-me-question';
import { WeatherConditionsComponent } from '../../components/weather-conditions/weather-conditions';
import { OfficeCatAMod1Page } from '../office.cat-a-mod1.page';

describe('OfficeCatAMod1Page', () => {
  let fixture: ComponentFixture<OfficeCatAMod1Page>;
  let component: OfficeCatAMod1Page;
  let store$: Store<StoreModel>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        OfficeCatAMod1Page,
        MockComponent(OfficeFooterComponent),
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
        MockComponent(TrueLikenessComponent),
        MockComponent(AccompanimentCardComponent),
        MockComponent(AccompanimentComponent),
        MockComponent(CircuitComponent),
        MockComponent(VehicleDetailsCardComponent),
        MockComponent(DrivingFaultsComponent),
      ],
      imports: [
        PipesModule,
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
                category: TestCategory.EUAM1,
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
        { provide: Platform, useClass: PlatformMock },
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

    fixture = TestBed.createComponent(OfficeCatAMod1Page);
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
      it('should dispatch an action to persist tests + pop navstack to root when defer is called', () => {
        spyOn(component, 'popToRoot');
        fixture.detectChanges();
        component.defer();
        expect(component.popToRoot).toHaveBeenCalled();
      });
    });

    describe('driving fault commentary', () => {
      it('should pass whether to render driving fault commentary to fault-comment-card', () => {
        const drivingFaultCommentCard: FaultCommentCardComponent = fixture.debugElement.query(
          By.css('#driving-fault-comment-card')
        ).componentInstance;
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

    describe('ionViewWillEnter', () => {
      it('should disable single app mode if it not in practice mode and isIos is true', async () => {
        component.isPracticeMode = false;
        spyOn(BasePageComponent.prototype, 'isIos').and.returnValue(true);
        spyOn(BasePageComponent.prototype, 'ionViewWillEnter');
        spyOn(component.deviceProvider, 'disableSingleAppMode');
        await component.ionViewWillEnter();
        expect(component.deviceProvider.disableSingleAppMode).toHaveBeenCalled();
      });
    });

    describe('drivingFaultCommentChanged', () => {
      it('should dispatch with AddDrivingFaultComment if source is SIMPLE', () => {
        component.drivingFaultCommentChanged({
          competencyIdentifier: 'Identifier',
          competencyDisplayName: 'DisplayName',
          source: CommentSource.SIMPLE,
          faultCount: 1,
          comment: 'Comment',
        });
        expect(store$.dispatch).toHaveBeenCalledWith(AddDrivingFaultComment('Identifier', 'Comment'));
      });
      it('should dispatch with AddSingleFaultCompetencyComment if source is SINGLE_FAULT_COMPETENCY', () => {
        component.drivingFaultCommentChanged({
          competencyIdentifier: 'avoidance',
          competencyDisplayName: 'DisplayName',
          source: CommentSource.SINGLE_FAULT_COMPETENCY,
          faultCount: 1,
          comment: 'Comment',
        });
        expect(store$.dispatch).toHaveBeenCalledWith(
          AddSingleFaultCompetencyComment(SingleFaultCompetencyNames.avoidance, 'Comment')
        );
      });
    });

    describe('seriousFaultCommentChanged', () => {
      it('should dispatch with AddSeriousFaultComment if source is SIMPLE', () => {
        component.seriousFaultCommentChanged({
          competencyIdentifier: 'Identifier',
          competencyDisplayName: 'DisplayName',
          source: CommentSource.SIMPLE,
          faultCount: 1,
          comment: 'Comment',
        });
        expect(store$.dispatch).toHaveBeenCalledWith(AddSeriousFaultComment('Identifier', 'Comment'));
      });
      it('should dispatch with AddSingleFaultCompetencyComment if source is SINGLE_FAULT_COMPETENCY', () => {
        component.seriousFaultCommentChanged({
          competencyIdentifier: 'avoidance',
          competencyDisplayName: 'DisplayName',
          source: CommentSource.SINGLE_FAULT_COMPETENCY,
          faultCount: 1,
          comment: 'Comment',
        });
        expect(store$.dispatch).toHaveBeenCalledWith(
          AddSingleFaultCompetencyComment(SingleFaultCompetencyNames.avoidance, 'Comment')
        );
      });
      it(
        'should dispatch with AddAvoidanceComment if source is ' + 'SPEED_REQUIREMENTS and case is speedCheckAvoidance',
        () => {
          component.seriousFaultCommentChanged({
            competencyIdentifier: 'avoidance',
            competencyDisplayName: 'DisplayName',
            source: 'speedRequirements-speedCheckAvoidance',
            faultCount: 1,
            comment: 'Comment',
          });
          expect(store$.dispatch).toHaveBeenCalledWith(AddAvoidanceComment('Comment'));
        }
      );
      it(
        'should dispatch with AddAnEmergencyStopComment if source is ' +
          'SPEED_REQUIREMENTS and case is speedCheckEmergency',
        () => {
          component.seriousFaultCommentChanged({
            competencyIdentifier: 'avoidance',
            competencyDisplayName: 'DisplayName',
            source: 'speedRequirements-speedCheckEmergency',
            faultCount: 1,
            comment: 'Comment',
          });
          expect(store$.dispatch).toHaveBeenCalledWith(AddAnEmergencyStopComment('Comment'));
        }
      );
      it(
        'should dispatch nothing if source is ' +
          'SPEED_REQUIREMENTS and case is neither speedCheckAvoidance or speedCheckEmergency',
        () => {
          component.seriousFaultCommentChanged({
            competencyIdentifier: 'avoidance',
            competencyDisplayName: 'DisplayName',
            source: 'speedRequirements-test',
            faultCount: 1,
            comment: 'Comment',
          });
          expect(store$.dispatch).not.toHaveBeenCalledWith(AddAvoidanceComment('Comment'));
          expect(store$.dispatch).not.toHaveBeenCalledWith(AddAnEmergencyStopComment('Comment'));
        }
      );
    });

    describe('dangerousFaultCommentChanged', () => {
      it('should dispatch with AddDangerousFaultComment if source is SIMPLE', () => {
        component.dangerousFaultCommentChanged({
          competencyIdentifier: 'Identifier',
          competencyDisplayName: 'DisplayName',
          source: CommentSource.SIMPLE,
          faultCount: 1,
          comment: 'Comment',
        });
        expect(store$.dispatch).toHaveBeenCalledWith(AddDangerousFaultComment('Identifier', 'Comment'));
      });
      it('should dispatch with AddSingleFaultCompetencyComment if source is SINGLE_FAULT_COMPETENCY', () => {
        component.dangerousFaultCommentChanged({
          competencyIdentifier: 'avoidance',
          competencyDisplayName: 'DisplayName',
          source: CommentSource.SINGLE_FAULT_COMPETENCY,
          faultCount: 1,
          comment: 'Comment',
        });
        expect(store$.dispatch).toHaveBeenCalledWith(
          AddSingleFaultCompetencyComment(SingleFaultCompetencyNames.avoidance, 'Comment')
        );
      });
    });
  });
});
