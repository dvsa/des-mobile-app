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
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
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
import { ToastControllerMock } from '@shared/mocks/toast-controller.mock';
import { TrueLikenessComponent } from '@pages/office/components/true-likeness/true-likeness';
import { OfficeCatManoeuvrePage } from '@pages/office/cat-manoeuvre/office.cat-manoeuvre.page';
import {
  AccompanimentCardComponent,
} from '@pages/waiting-room-to-car/components/accompaniment-card/accompaniment-card';
import { AccompanimentComponent } from '@pages/waiting-room-to-car/components/accompaniment/accompaniment';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { Subscription } from 'rxjs';
import { TestOutcome } from '@store/tests/tests.constants';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { BasePageComponent } from '@shared/classes/base-page';
import { PassCertificateNumberChanged } from '@store/tests/pass-completion/pass-completion.actions';
import { PassCertificateNumberReceived } from '@store/tests/post-test-declarations/post-test-declarations.actions';
import { OfficeFooterComponent } from '@pages/office/components/office-footer/office-footer.component';
import { DateOfTest } from '../../components/date-of-test/date-of-test';
import { CandidateSectionComponent } from '../../components/candidate-section/candidate-section';
import { FaultCommentCardComponent } from '../../components/fault-comment-card/fault-comment-card';
import { IndependentDrivingComponent } from '../../components/independent-driving/independent-driving';
import { IdentificationComponent } from '../../components/identification/identification';
import { AdditionalInformationComponent } from '../../components/additional-information/additional-information';
import { WeatherConditionsComponent } from '../../components/weather-conditions/weather-conditions';
import { CandidateDescriptionComponent } from '../../components/candidate-description/candidate-description';
import { RouteNumberComponent } from '../../components/route-number/route-number';
import { CommentSource, FaultSummary } from '@shared/models/fault-marking.model';
import { AddManoeuvreComment } from '@store/tests/test-data/common/manoeuvres/manoeuvres.actions';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { AddUncoupleRecoupleComment } from '@store/tests/test-data/common/uncouple-recouple/uncouple-recouple.actions';

describe('OfficeCatManoeuvrePage', () => {
  let fixture: ComponentFixture<OfficeCatManoeuvrePage>;
  let component: OfficeCatManoeuvrePage;
  let store$: Store<StoreModel>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        OfficeCatManoeuvrePage,
        MockComponent(OfficeFooterComponent),
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
                category: TestCategory.CM,
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

    fixture = TestBed.createComponent(OfficeCatManoeuvrePage);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
    spyOn(component.deviceProvider, 'disableSingleAppMode');
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

  describe('passCertificateNumberChanged', () => {
    it('should dispatch PassCertificateNumberChanged with '
      + 'the value passed and PassCertificateNumberReceived with true if passCertificateNumberCtrl is valid', () => {
      component.form = new UntypedFormGroup({ passCertificateNumberCtrl: new UntypedFormControl() });
      spyOn(component.store$, 'dispatch');

      component.passCertificateNumberChanged('test');
      expect(component.store$.dispatch).toHaveBeenCalledWith(PassCertificateNumberChanged('test'));
      expect(component.store$.dispatch).toHaveBeenCalledWith(PassCertificateNumberReceived(true));
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

  describe('dangerousFaultCommentChanged', () => {
    it('should dispatch AddSeriousFaultComment when source is SIMPLE', () => {
      const faultSummary: FaultSummary = {
        competencyIdentifier: 'signalsCorrectly',
        comment: 'Missed a signal',
        source: CommentSource.SIMPLE,
      } as FaultSummary;

      component.dangerousFaultCommentChanged(faultSummary);

      expect(store$.dispatch).toHaveBeenCalledWith(
        AddDangerousFaultComment('signalsCorrectly', 'Missed a signal')
      );
    });

    it('should dispatch AddManoeuvreComment when source starts with MANOEUVRES', () => {
      const faultSummary: FaultSummary = {
        competencyIdentifier: 'manoeuvres-reverseParkRoad-control',
        comment: 'Control issue',
        source: CommentSource.MANOEUVRES+'-reverseParkRoad-control',
      } as FaultSummary;

      component.dangerousFaultCommentChanged(faultSummary);

      expect(store$.dispatch).toHaveBeenCalledWith(
        AddManoeuvreComment('reverseParkRoad', CompetencyOutcome.D, 'control', 'Control issue')
      );
    });

    it('should dispatch AddUncoupleRecoupleComment when source is UNCOUPLE_RECOUPLE', () => {
      const faultSummary: FaultSummary = {
        competencyIdentifier: 'uncoupleRecouple',
        comment: 'Issue with uncoupling',
        source: CommentSource.UNCOUPLE_RECOUPLE,
      } as FaultSummary;

      component.dangerousFaultCommentChanged(faultSummary);

      expect(store$.dispatch).toHaveBeenCalledWith(
        AddUncoupleRecoupleComment('Issue with uncoupling')
      );
    });

    it('should not dispatch any action when source is unknown', () => {
      const faultSummary: FaultSummary = {
        competencyIdentifier: 'unknown',
        comment: 'Unknown issue',
        source: 'UNKNOWN_SOURCE',
      } as FaultSummary;

      component.dangerousFaultCommentChanged(faultSummary);

      expect(store$.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('seriousFaultCommentChanged', () => {
    it('should dispatch AddSeriousFaultComment when source is SIMPLE', () => {
      const faultSummary: FaultSummary = {
        competencyIdentifier: 'signalsCorrectly',
        comment: 'Missed a signal',
        source: CommentSource.SIMPLE,
      } as FaultSummary;

      component.seriousFaultCommentChanged(faultSummary);

      expect(store$.dispatch).toHaveBeenCalledWith(
        AddSeriousFaultComment('signalsCorrectly', 'Missed a signal')
      );
    });

    it('should dispatch AddManoeuvreComment when source starts with MANOEUVRES', () => {
      const faultSummary: FaultSummary = {
        competencyIdentifier: 'manoeuvres-reverseParkRoad-control',
        comment: 'Control issue',
        source: CommentSource.MANOEUVRES+'-reverseParkRoad-control',
      } as FaultSummary;

      component.seriousFaultCommentChanged(faultSummary);

      expect(store$.dispatch).toHaveBeenCalledWith(
        AddManoeuvreComment('reverseParkRoad', CompetencyOutcome.S, 'control', 'Control issue')
      );
    });

    it('should dispatch AddUncoupleRecoupleComment when source is UNCOUPLE_RECOUPLE', () => {
      const faultSummary: FaultSummary = {
        competencyIdentifier: 'uncoupleRecouple',
        comment: 'Issue with uncoupling',
        source: CommentSource.UNCOUPLE_RECOUPLE,
      } as FaultSummary;

      component.seriousFaultCommentChanged(faultSummary);

      expect(store$.dispatch).toHaveBeenCalledWith(
        AddUncoupleRecoupleComment('Issue with uncoupling')
      );
    });

    it('should not dispatch any action when source is unknown', () => {
      const faultSummary: FaultSummary = {
        competencyIdentifier: 'unknown',
        comment: 'Unknown issue',
        source: 'UNKNOWN_SOURCE',
      } as FaultSummary;

      component.seriousFaultCommentChanged(faultSummary);

      expect(store$.dispatch).not.toHaveBeenCalled();
    });
  });

});
