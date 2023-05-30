import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  IonicModule,
  NavController,
  Platform,
  ToastController, ModalController,
} from '@ionic/angular';
import { ModalControllerMock, PlatformMock } from '@mocks/index.mock';
import { NavControllerMock } from '@shared/mocks/nav-controller.mock';
import { Store, StoreModule } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

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
import {
  ActivityCodeModel,
  ActivityCodeDescription,
} from '@shared/constants/activity-code/activity-code.constants';
import { ActivityCodes } from '@shared/models/activity-codes';
import { ActivityCodeComponent } from '@components/common/activity-code/activity-code';
import { Competencies, ExaminerActions } from '@store/tests/test-data/test-data.constants';
import { ToggleETA } from '@store/tests/test-data/common/eta/eta.actions';
import {
  AddEcoCaptureReason,
  AddEcoRelatedFault, ToggleFuelEfficientDriving,
  TogglePlanningEco,
} from '@store/tests/test-data/common/eco/eco.actions';
import {
  AddDangerousFault, AddDangerousFaultComment,
} from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import {
  AddSeriousFault,
  AddSeriousFaultComment,
} from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import { ToastControllerMock } from '@shared/mocks/toast-controller.mock';
import { TrueLikenessComponent } from '@pages/office/components/true-likeness/true-likeness';
import {
  AccompanimentCardComponent,
} from '@pages/waiting-room-to-car/components/accompaniment-card/accompaniment-card';
import { AccompanimentComponent } from '@pages/waiting-room-to-car/components/accompaniment/accompaniment';
import { PipesModule } from '@shared/pipes/pipes.module';
import {
  ShowMeQuestionsCatADI2Component,
} from '@pages/office/cat-adi-part2/components/show-me-questions/show-me-questions';
import {
  VehicleChecksOfficeCardCatADI2Component,
} from '@pages/office/cat-adi-part2/components/vehicle-checks/vehicle-checks-office-card';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DrivingFaultsComponent } from '@pages/office/components/driving-faults/driving-faults.component';
import { BasePageComponent } from '@shared/classes/base-page';
import {
  AddShowMeTellMeComment,
  ShowMeQuestionSelected,
} from '@store/tests/test-data/cat-adi-part2/vehicle-checks/vehicle-checks.cat-adi-part2.action';
import { OfficeBasePageComponent } from '@shared/classes/test-flow-base-pages/office/office-base-page';
import { CommentSource } from '@shared/models/fault-marking.model';
import { AddDrivingFaultComment } from '@store/tests/test-data/common/driving-faults/driving-faults.actions';
import { AddManoeuvreComment } from '@store/tests/test-data/cat-adi-part2/manoeuvres/manoeuvres.actions';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { AddUncoupleRecoupleComment } from '@store/tests/test-data/common/uncouple-recouple/uncouple-recouple.actions';
import { AddControlledStopComment } from '@store/tests/test-data/common/controlled-stop/controlled-stop.actions';
import { EyesightTestAddComment } from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import { DateOfTest } from '../../components/date-of-test/date-of-test';
import { CandidateSectionComponent } from '../../components/candidate-section/candidate-section';
import { OfficeCatADI2Page } from '../office.cat-adi-part2.page';
import { FaultCommentCardComponent } from '../../components/fault-comment-card/fault-comment-card';
import { IndependentDrivingComponent } from '../../components/independent-driving/independent-driving';
import { IdentificationComponent } from '../../components/identification/identification';
import { AdditionalInformationComponent } from '../../components/additional-information/additional-information';
import { WeatherConditionsComponent } from '../../components/weather-conditions/weather-conditions';
import { CandidateDescriptionComponent } from '../../components/candidate-description/candidate-description';
import { RouteNumberComponent } from '../../components/route-number/route-number';

describe('OfficeCatADI2Page', () => {
  let fixture: ComponentFixture<OfficeCatADI2Page>;
  let component: OfficeCatADI2Page;
  let store$: Store<StoreModel>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        OfficeCatADI2Page,
        MockComponent(RouteNumberComponent),
        MockComponent(CandidateDescriptionComponent),
        MockComponent(IdentificationComponent),
        MockComponent(WeatherConditionsComponent),
        MockComponent(AdditionalInformationComponent),
        MockComponent(IndependentDrivingComponent),
        MockComponent(FaultCommentCardComponent),
        MockComponent(CandidateSectionComponent),
        MockComponent(DateOfTest),
        MockComponent(TrueLikenessComponent),
        MockComponent(AccompanimentCardComponent),
        MockComponent(AccompanimentComponent),
        MockComponent(ShowMeQuestionsCatADI2Component),
        MockComponent(VehicleChecksOfficeCardCatADI2Component),
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
                category: TestCategory.ADI2,
                vehicleDetails: {},
                accompaniment: {},
                testData: {
                  dangerousFaults: {},
                  drivingFaults: {},
                  manoeuvres: [],
                  seriousFaults: {},
                  testRequirements: {},
                  ETA: {},
                  eco: {},
                  vehicleChecks: {
                    showMeQuestions: [{}, {}],
                  },
                },
                activityCode: '28',
                journalData: {
                  candidate: {
                    candidateName: {},
                    driverNumber: '123',
                  },
                },
                rekey: false,
              } as CatADI2UniqueTypes.TestResult,
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

    fixture = TestBed.createComponent(OfficeCatADI2Page);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
  }));

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
  describe('showMeQuestionsChanged', () => {
    it('should dispatch a ShowMeQuestionSelected action with the result and index', () => {
      component.showMeQuestionsChanged({ code: 'test' }, 1);
      expect(store$.dispatch).toHaveBeenCalledWith(ShowMeQuestionSelected({ code: 'test' }, 1));
    });
  });

  describe('ecoFaultChanged', () => {
    it('should dispatch a AddEcoRelatedFault action with the passed in fault', () => {
      component.ecoFaultChanged('test');
      expect(store$.dispatch).toHaveBeenCalledWith(AddEcoRelatedFault('test'));
    });
  });

  describe('ecoCaptureReasonChanged', () => {
    it('should dispatch a AddEcoCaptureReason action with the passed in'
            + 'value for ecoCaptureReason', () => {
      component.ecoCaptureReasonChanged('test');
      expect(store$.dispatch).toHaveBeenCalledWith(AddEcoCaptureReason('test'));
    });
  });

  describe('fedChanged', () => {
    it('should dispatch a AddEcoCaptureReason action with '
            + 'the passed in value for fuelEfficientDriving', () => {
      component.fedChanged(true);
      expect(store$.dispatch).toHaveBeenCalledWith(ToggleFuelEfficientDriving(true));
    });
  });

  describe('ionViewDidLeave', () => {
    it('should call super.ionViewDidLeave', () => {
      spyOn(OfficeBasePageComponent.prototype, 'ionViewDidLeave');
      component.ionViewDidLeave();
      expect(OfficeBasePageComponent.prototype.ionViewDidLeave).toHaveBeenCalled();
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
    it('should dispatch with AddUncoupleRecoupleComment if source is UNCOUPLE_RECOUPLE', () => {
      component.drivingFaultCommentChanged({
        competencyIdentifier: 'Identifier',
        competencyDisplayName: 'DisplayName',
        source: CommentSource.UNCOUPLE_RECOUPLE,
        faultCount: 1,
        comment: 'Comment',
      });
      expect(store$.dispatch).toHaveBeenCalledWith(AddUncoupleRecoupleComment('Comment'));
    });
    it('should dispatch with AddShowMeTellMeComment if source is VEHICLE_CHECKS', () => {
      component.drivingFaultCommentChanged({
        competencyIdentifier: 'Identifier',
        competencyDisplayName: 'DisplayName',
        source: CommentSource.VEHICLE_CHECKS,
        faultCount: 1,
        comment: 'Comment',
      });
      expect(store$.dispatch).toHaveBeenCalledWith(AddShowMeTellMeComment('Comment'));
    });
    it('should dispatch with AddControlledStopComment if source is CONTROLLED_STOP', () => {
      component.drivingFaultCommentChanged({
        competencyIdentifier: 'Identifier',
        competencyDisplayName: 'DisplayName',
        source: CommentSource.CONTROLLED_STOP,
        faultCount: 1,
        comment: 'Comment',
      });
      expect(store$.dispatch).toHaveBeenCalledWith(AddControlledStopComment('Comment'));
    });
    it('should dispatch with AddManoeuvreComment if source is MANOEUVRES', () => {
      component.drivingFaultCommentChanged({
        competencyIdentifier: 'Identifier',
        competencyDisplayName: 'DisplayName',
        source: 'Manoeuvres-10-reverseParkRoad-Control',
        faultCount: 1,
        comment: 'Comment',
      });
      expect(store$.dispatch).toHaveBeenCalledWith(
        AddManoeuvreComment('reverseParkRoad', CompetencyOutcome.DF, 'Control', 'Comment', 10),
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
    it('should dispatch with AddUncoupleRecoupleComment if source is UNCOUPLE_RECOUPLE', () => {
      component.seriousFaultCommentChanged({
        competencyIdentifier: 'Identifier',
        competencyDisplayName: 'DisplayName',
        source: CommentSource.UNCOUPLE_RECOUPLE,
        faultCount: 1,
        comment: 'Comment',
      });
      expect(store$.dispatch).toHaveBeenCalledWith(AddUncoupleRecoupleComment('Comment'));
    });
    it('should dispatch with AddShowMeTellMeComment if source is VEHICLE_CHECKS', () => {
      component.seriousFaultCommentChanged({
        competencyIdentifier: 'Identifier',
        competencyDisplayName: 'DisplayName',
        source: CommentSource.VEHICLE_CHECKS,
        faultCount: 1,
        comment: 'Comment',
      });
      expect(store$.dispatch).toHaveBeenCalledWith(AddShowMeTellMeComment('Comment'));
    });
    it('should dispatch with EyesightTestAddComment if source is EYESIGHT_TEST', () => {
      component.seriousFaultCommentChanged({
        competencyIdentifier: 'Identifier',
        competencyDisplayName: 'DisplayName',
        source: CommentSource.EYESIGHT_TEST,
        faultCount: 1,
        comment: 'Comment',
      });
      expect(store$.dispatch).toHaveBeenCalledWith(EyesightTestAddComment('Comment'));
    });
    it('should dispatch with AddControlledStopComment if source is CONTROLLED_STOP', () => {
      component.seriousFaultCommentChanged({
        competencyIdentifier: 'Identifier',
        competencyDisplayName: 'DisplayName',
        source: CommentSource.CONTROLLED_STOP,
        faultCount: 1,
        comment: 'Comment',
      });
      expect(store$.dispatch).toHaveBeenCalledWith(AddControlledStopComment('Comment'));
    });
    it('should dispatch with AddManoeuvreComment if source is MANOEUVRES', () => {
      component.seriousFaultCommentChanged({
        competencyIdentifier: 'Identifier',
        competencyDisplayName: 'DisplayName',
        source: 'Manoeuvres-10-reverseParkRoad-Control',
        faultCount: 1,
        comment: 'Comment',
      });
      expect(store$.dispatch).toHaveBeenCalledWith(
        AddManoeuvreComment('reverseParkRoad', CompetencyOutcome.S, 'Control', 'Comment', 10),
      );
    });
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
    it('should dispatch with AddUncoupleRecoupleComment if source is UNCOUPLE_RECOUPLE', () => {
      component.dangerousFaultCommentChanged({
        competencyIdentifier: 'Identifier',
        competencyDisplayName: 'DisplayName',
        source: CommentSource.UNCOUPLE_RECOUPLE,
        faultCount: 1,
        comment: 'Comment',
      });
      expect(store$.dispatch).toHaveBeenCalledWith(AddUncoupleRecoupleComment('Comment'));
    });
    it('should dispatch with AddShowMeTellMeComment if source is VEHICLE_CHECKS', () => {
      component.dangerousFaultCommentChanged({
        competencyIdentifier: 'Identifier',
        competencyDisplayName: 'DisplayName',
        source: CommentSource.VEHICLE_CHECKS,
        faultCount: 1,
        comment: 'Comment',
      });
      expect(store$.dispatch).toHaveBeenCalledWith(AddShowMeTellMeComment('Comment'));
    });
    it('should dispatch with AddControlledStopComment if source is CONTROLLED_STOP', () => {
      component.dangerousFaultCommentChanged({
        competencyIdentifier: 'Identifier',
        competencyDisplayName: 'DisplayName',
        source: CommentSource.CONTROLLED_STOP,
        faultCount: 1,
        comment: 'Comment',
      });
      expect(store$.dispatch).toHaveBeenCalledWith(AddControlledStopComment('Comment'));
    });
    it('should dispatch with AddManoeuvreComment if source is MANOEUVRES', () => {
      component.dangerousFaultCommentChanged({
        competencyIdentifier: 'Identifier',
        competencyDisplayName: 'DisplayName',
        source: 'Manoeuvres-10-reverseParkRoad-Control',
        faultCount: 1,
        comment: 'Comment',
      });
      expect(store$.dispatch).toHaveBeenCalledWith(
        AddManoeuvreComment('reverseParkRoad', CompetencyOutcome.D, 'Control', 'Comment', 10),
      );
    });
  });
});
