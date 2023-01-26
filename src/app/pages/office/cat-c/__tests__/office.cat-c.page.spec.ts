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
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
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
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { ActivityCodeModel, ActivityCodeDescription } from '@shared/constants/activity-code/activity-code.constants';
import { ActivityCodes } from '@shared/models/activity-codes';
import { ActivityCodeComponent } from '@components/common/activity-code/activity-code';
import { By } from '@angular/platform-browser';
import { Competencies, ExaminerActions } from '@store/tests/test-data/test-data.constants';
import { ToggleETA } from '@store/tests/test-data/common/eta/eta.actions';
import { TogglePlanningEco } from '@store/tests/test-data/common/eco/eco.actions';
import {
  AddDangerousFault,
  AddDangerousFaultComment,
} from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import {
  AddSeriousFault,
  AddSeriousFaultComment,
} from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import { of, Subscription } from 'rxjs';
import { ToastControllerMock } from '@shared/mocks/toast-controller.mock';
import { VehicleChecksOfficeCardComponent } from '@pages/office/components/vehicle-checks/vehicle-checks-office-card';
import { TrueLikenessComponent } from '@pages/office/components/true-likeness/true-likeness';
import {
  AccompanimentCardComponent,
} from '@pages/waiting-room-to-car/components/accompaniment-card/accompaniment-card';
import { AccompanimentComponent } from '@pages/waiting-room-to-car/components/accompaniment/accompaniment';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DrivingFaultsComponent } from '@pages/office/components/driving-faults/driving-faults.component';
import { BasePageComponent } from '@shared/classes/base-page';
import { TestOutcome } from '@store/tests/tests.constants';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { CommentSource } from '@shared/models/fault-marking.model';
import { AddDrivingFaultComment } from '@store/tests/test-data/common/driving-faults/driving-faults.actions';
import { AddUncoupleRecoupleComment } from '@store/tests/test-data/common/uncouple-recouple/uncouple-recouple.actions';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { EyesightTestAddComment } from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import { PassCertificateNumberChanged } from '@store/tests/pass-completion/pass-completion.actions';
import { PassCertificateNumberReceived } from '@store/tests/post-test-declarations/post-test-declarations.actions';
import { AddShowMeTellMeComment } from '@store/tests/test-data/cat-c/vehicle-checks/vehicle-checks.cat-c.action';
import { AddManoeuvreComment } from '@store/tests/test-data/common/manoeuvres/manoeuvres.actions';
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

  beforeEach(waitForAsync(() => {
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
        MockComponent(TrueLikenessComponent),
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

    describe('ionViewDidLeave', () => {
      it('should unsubscribe from the subscription if there is one', () => {
        component.pageSubscription = new Subscription();
        spyOn(component.pageSubscription, 'unsubscribe');
        component.ionViewDidLeave();
        expect(component.pageSubscription.unsubscribe)
          .toHaveBeenCalled();
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

    describe('isPass', () => {
      it('should return true is testOutcomeText is passed', () => {
        component.testOutcomeText = TestOutcome.Passed;
        expect(component.isPass()).toEqual(true);
      });
      it('should return true is testOutcomeText is not passed', () => {
        component.testOutcomeText = TestOutcome.Failed;
        expect(component.isPass()).toEqual(false);
      });
    });

    describe('isWelsh', () => {
      it('should return true is conductedLanguage is Cymraeg', () => {
        component.conductedLanguage = Language.CYMRAEG;
        expect(component.isWelsh()).toEqual(true);
      });
      it('should return true is testOutcomeText is not Cymraeg', () => {
        component.conductedLanguage = Language.ENGLISH;
        expect(component.isWelsh()).toEqual(false);
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
      it('should dispatch with AddManoeuvreComment if source is MANOEUVRES', () => {
        component.drivingFaultCommentChanged({
          competencyIdentifier: 'Identifier',
          competencyDisplayName: 'DisplayName',
          source: 'Manoeuvres-reverseParkRoad-Control',
          faultCount: 1,
          comment: 'Comment',
        });
        expect(store$.dispatch).toHaveBeenCalledWith(
          AddManoeuvreComment('reverseParkRoad', CompetencyOutcome.DF, 'Control', 'Comment'),
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
      it('should dispatch with AddManoeuvreComment if source is MANOEUVRES', () => {
        component.seriousFaultCommentChanged({
          competencyIdentifier: 'Identifier',
          competencyDisplayName: 'DisplayName',
          source: 'Manoeuvres-reverseParkRoad-Control',
          faultCount: 1,
          comment: 'Comment',
        });
        expect(store$.dispatch).toHaveBeenCalledWith(
          AddManoeuvreComment('reverseParkRoad', CompetencyOutcome.S, 'Control', 'Comment'),
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
      it('should dispatch with AddManoeuvreComment if source is MANOEUVRES', () => {
        component.dangerousFaultCommentChanged({
          competencyIdentifier: 'Identifier',
          competencyDisplayName: 'DisplayName',
          source: 'Manoeuvres-reverseParkRoad-Control',
          faultCount: 1,
          comment: 'Comment',
        });
        expect(store$.dispatch).toHaveBeenCalledWith(
          AddManoeuvreComment('reverseParkRoad', CompetencyOutcome.D, 'Control', 'Comment'),
        );
      });
    });

    describe('passCertificateNumberChanged', () => {
      it('should dispatch PassCertificateNumberChanged and PassCertificateNumberReceived', () => {
        component.form.addControl('passCertificateNumberCtrl', new UntypedFormControl());
        component.passCertificateNumberChanged('test');
        expect(component.store$.dispatch).toHaveBeenCalledWith(PassCertificateNumberChanged('test'));
        expect(component.store$.dispatch).toHaveBeenCalledWith(PassCertificateNumberReceived(true));
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
  });
});
