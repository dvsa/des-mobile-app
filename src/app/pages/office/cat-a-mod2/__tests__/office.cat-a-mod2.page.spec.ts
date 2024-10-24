import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { AppModule } from '@app/app.module';
import { ComponentsModule } from '@components/common/common-components.module';
import { ModeOfTransport } from '@dvsa/mes-test-schema/categories/AM2';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonicModule, ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { ModalControllerMock, PlatformMock, ToastControllerMock } from '@mocks/index.mock';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DrivingFaultsComponent } from '@pages/office/components/driving-faults/driving-faults.component';
import { OfficeFooterComponent } from '@pages/office/components/office-footer/office-footer.component';
import { OfficeViewDidEnter } from '@pages/office/office.actions';
import { AccompanimentCardComponent } from '@pages/waiting-room-to-car/components/accompaniment-card/accompaniment-card';
import { AccompanimentComponent } from '@pages/waiting-room-to-car/components/accompaniment/accompaniment';
import { VehicleDetailsCardComponent } from '@pages/waiting-room-to-car/components/vehicle-details-card/vehicle-details-card';
import { VehicleDetailsComponent } from '@pages/waiting-room-to-car/components/vehicle-details/vehicle-details';
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
import { activityCodeModelList } from '@shared/constants/activity-code/activity-code.constants';
import { NavControllerMock } from '@shared/mocks/nav-controller.mock';
import { CommentSource } from '@shared/models/fault-marking.model';
import { StoreModel } from '@shared/models/store.model';
import { PipesModule } from '@shared/pipes/pipes.module';
import { SetActivityCode } from '@store/tests/activity-code/activity-code.actions';
import { AddSafetyAndBalanceComment } from '@store/tests/test-data/cat-a-mod2/safety-and-balance/safety-and-balance.cat-a-mod2.actions';
import { AddDangerousFaultComment } from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import { AddDrivingFaultComment } from '@store/tests/test-data/common/driving-faults/driving-faults.actions';
import { EyesightTestAddComment } from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import { AddSeriousFaultComment } from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import { ModeOfTransportChanged } from '@store/tests/test-summary/cat-a-mod2/test-summary.cat-a-mod2.actions';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { AdditionalInformationComponent } from '../../components/additional-information/additional-information';
import { CandidateDescriptionComponent } from '../../components/candidate-description/candidate-description';
import { CandidateSectionComponent } from '../../components/candidate-section/candidate-section';
import { DateOfTest } from '../../components/date-of-test/date-of-test';
import { FaultCommentCardComponent } from '../../components/fault-comment-card/fault-comment-card';
import { IdentificationComponent } from '../../components/identification/identification';
import { IndependentDrivingComponent } from '../../components/independent-driving/independent-driving';
import { RouteNumberComponent } from '../../components/route-number/route-number';
import { ShowMeQuestionComponent } from '../../components/show-me-question/show-me-question';
import { VehicleChecksOfficeCardComponent } from '../../components/vehicle-checks/vehicle-checks-office-card';
import { WeatherConditionsComponent } from '../../components/weather-conditions/weather-conditions';
import { ModeOfTransportCatAMod2Component } from '../components/mode-of-transport/mode-of-transport.cat-a-mod2';
import { SafetyAndBalanceCardCatAMod2Component } from '../components/safety-and-balance/safety-and-balance.cat-a-mod2';
import { OfficeCatAMod2Page } from '../office.cat-a-mod2.page';

describe('OfficeCatAMod2Page', () => {
  let fixture: ComponentFixture<OfficeCatAMod2Page>;
  let component: OfficeCatAMod2Page;
  let store$: Store<StoreModel>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        OfficeCatAMod2Page,
        MockComponent(OfficeFooterComponent),
        MockComponent(SafetyAndBalanceCardCatAMod2Component),
        MockComponent(ModeOfTransportCatAMod2Component),
        MockComponent(RouteNumberComponent),
        MockComponent(CandidateDescriptionComponent),
        MockComponent(IdentificationComponent),
        MockComponent(ShowMeQuestionComponent),
        MockComponent(WeatherConditionsComponent),
        MockComponent(AdditionalInformationComponent),
        MockComponent(IndependentDrivingComponent),
        MockComponent(FaultCommentCardComponent),
        MockComponent(VehicleChecksOfficeCardComponent),
        MockComponent(CandidateSectionComponent),
        MockComponent(DateOfTest),
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
        PipesModule,
        StoreModule.forRoot({
          tests: () => ({
            currentTest: {
              slotId: '123',
            },
            testStatus: {},
            startedTests: {
              123: {
                category: TestCategory.EUA2M2,
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
                    showMeQuestions: [
                      {
                        code: 'S3',
                        description: '',
                        outcome: '',
                      },
                    ],
                    tellMeQuestions: [
                      {
                        code: '',
                        description: '',
                        outcome: '',
                      },
                    ],
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
        TranslateModule,
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

    fixture = TestBed.createComponent(OfficeCatAMod2Page);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
  }));

  describe('DOM', () => {
    describe('modeOfTransportChanged', () => {
      it('should dispatch a Mode Of Transport change action with the new value', () => {
        const mode: ModeOfTransport = 'Car to bike';
        component.modeOfTransportChanged(mode);

        expect(store$.dispatch).toHaveBeenCalledWith(ModeOfTransportChanged(mode));
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
      it('should dispatch with AddUncoupleRecoupleComment if source is EYESIGHT_TEST', () => {
        component.seriousFaultCommentChanged({
          competencyIdentifier: 'Identifier',
          competencyDisplayName: 'DisplayName',
          source: CommentSource.EYESIGHT_TEST,
          faultCount: 1,
          comment: 'Comment',
        });
        expect(store$.dispatch).toHaveBeenCalledWith(EyesightTestAddComment('Comment'));
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
      it('should dispatch with AddUncoupleRecoupleComment if source is SAFETY_AND_BALANCE_QUESTIONS', () => {
        component.drivingFaultCommentChanged({
          competencyIdentifier: 'Identifier',
          competencyDisplayName: 'DisplayName',
          source: CommentSource.SAFETY_AND_BALANCE_QUESTIONS,
          faultCount: 1,
          comment: 'Comment',
        });
        expect(store$.dispatch).toHaveBeenCalledWith(AddSafetyAndBalanceComment('Comment'));
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

    describe('ionViewDidEnter', () => {
      it('should disable single app mode if it not in practice mode and isIos is true', () => {
        component.ionViewDidEnter();
        expect(store$.dispatch).toHaveBeenCalledWith(OfficeViewDidEnter());
      });
    });

    describe('dangerousFaultCommentChanged', () => {
      it('should dispatch with AddDangerousFaultComment', () => {
        component.dangerousFaultCommentChanged({
          competencyIdentifier: 'Identifier',
          competencyDisplayName: 'DisplayName',
          source: CommentSource.SIMPLE,
          faultCount: 1,
          comment: 'Comment',
        });
        expect(store$.dispatch).toHaveBeenCalledWith(AddDangerousFaultComment('Identifier', 'Comment'));
      });
      it('should dispatch with AddUncoupleRecoupleComment if source is SAFETY_AND_BALANCE_QUESTIONS', () => {
        component.drivingFaultCommentChanged({
          competencyIdentifier: 'Identifier',
          competencyDisplayName: 'DisplayName',
          source: CommentSource.SAFETY_AND_BALANCE_QUESTIONS,
          faultCount: 1,
          comment: 'Comment',
        });
        expect(store$.dispatch).toHaveBeenCalledWith(AddSafetyAndBalanceComment('Comment'));
      });
    });

    describe('selecting a activity code', () => {
      it('should dispatch a SetActivityCode action with the activity code', () => {
        component.activityCodeChanged(activityCodeModelList[0]);

        expect(store$.dispatch).toHaveBeenCalledWith(SetActivityCode(activityCodeModelList[0].activityCode));
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
  });
});
