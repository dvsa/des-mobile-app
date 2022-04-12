import {
  ComponentFixture, TestBed, waitForAsync,
} from '@angular/core/testing';
import {
  IonicModule,
  Platform,
  ToastController, ModalController, NavController,
} from '@ionic/angular';
import {
  PlatformMock,
  ToastControllerMock,
} from 'ionic-mocks';
import { ComponentsModule } from '@components/common/common-components.module';
import { AppModule } from '@app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { By } from '@angular/platform-browser';
import {
  ModeOfTransportChanged,
} from '@store/tests/test-summary/cat-a-mod2/test-summary.cat-a-mod2.actions';
import { of } from 'rxjs';
import { MockComponent } from 'ng-mocks';
import { FaultSummary } from '@shared/models/fault-marking.model';
import {
  activityCodeModelList,
} from '@shared/constants/activity-code/activity-code.constants';
import { SetActivityCode } from '@store/tests/activity-code/activity-code.actions';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { configureTestSuite } from 'ng-bullet';
import { ModeOfTransport } from '@dvsa/mes-test-schema/categories/AM2';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { OutcomeBehaviourMapProviderMock } from '@providers/outcome-behaviour-map/__mocks__/outcome-behaviour-map.mock';
import { WeatherConditionProvider } from '@providers/weather-conditions/weather-condition';
import { QuestionProvider } from '@providers/question/question';
import { QuestionProviderMock } from '@providers/question/__mocks__/question.mock';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { NavControllerMock } from '@shared/mocks/nav-controller.mock';
import { PipesModule } from '@shared/pipes/pipes.module';
import {
  AccompanimentCardComponent,
} from '@pages/waiting-room-to-car/components/accompaniment-card/accompaniment-card';
import { AccompanimentComponent } from '@pages/waiting-room-to-car/components/accompaniment/accompaniment';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import {
  VehicleDetailsCardComponent,
} from '@pages/waiting-room-to-car/components/vehicle-details-card/vehicle-details-card';
import { VehicleDetailsComponent } from '@pages/waiting-room-to-car/components/vehicle-details/vehicle-details';
import { IndependentDrivingComponent } from '../../components/independent-driving/independent-driving';
import { FaultCommentCardComponent } from '../../components/fault-comment-card/fault-comment-card';
import { IdentificationComponent } from '../../components/identification/identification';
import { AdditionalInformationComponent } from '../../components/additional-information/additional-information';
import { WeatherConditionsComponent } from '../../components/weather-conditions/weather-conditions';
import { ShowMeQuestionComponent } from '../../components/show-me-question/show-me-question';
import { CandidateDescriptionComponent } from '../../components/candidate-description/candidate-description';
import { RouteNumberComponent } from '../../components/route-number/route-number';
import { ModeOfTransportCatAMod2Component } from '../components/mode-of-transport/mode-of-transport.cat-a-mod2';
import { SafetyAndBalanceCardCatAMod2Component } from '../components/safety-and-balance/safety-and-balance.cat-a-mod2';
import { OfficeCatAMod2Page } from '../office.cat-a-mod2.page';
import { VehicleChecksOfficeCardComponent } from '../../components/vehicle-checks/vehicle-checks-office-card';
import { CandidateSectionComponent } from '../../components/candidate-section/candidate-section';
import { DateOfTest } from '../../components/date-of-test/date-of-test';

describe('OfficeCatAMod2Page', () => {
  let fixture: ComponentFixture<OfficeCatAMod2Page>;
  let component: OfficeCatAMod2Page;
  let store$: Store<StoreModel>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        OfficeCatAMod2Page,
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
                    showMeQuestions: [{
                      code: 'S3',
                      description: '',
                      outcome: '',
                    }],
                    tellMeQuestions: [{
                      code: '',
                      description: '',
                      outcome: '',
                    }],
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

    describe('selecting a activity code', () => {
      it('should dispatch a SetActivityCode action with the activity code', () => {
        component.activityCodeChanged(activityCodeModelList[0]);

        expect(store$.dispatch).toHaveBeenCalledWith(SetActivityCode(activityCodeModelList[0].activityCode));
      });
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
