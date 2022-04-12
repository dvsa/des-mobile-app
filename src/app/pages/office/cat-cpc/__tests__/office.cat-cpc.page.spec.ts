import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
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
import { ToastControllerMock } from '@shared/mocks/toast-controller.mock';
import { AccompanimentComponent } from '@pages/waiting-room-to-car/components/accompaniment/accompaniment';
import { TestOutcome } from '@shared/models/test-outcome';
import { AssessmentReportChanged } from '@store/tests/test-summary/cat-cpc/test-summary.cat-cpc.actions';
import { CombinationComponent } from '@pages/office/cat-cpc/components/combination/combination';
import { AssessmentReportComponent } from '@pages/office/cat-cpc/components/assessment-report/assessment-report';
import {
  PassCertificateDeclarationComponent,
} from '@pages/office/cat-cpc/components/pass-certificate-declaration/pass-certificate-declaration';
import { DebriefWitnessedComponent } from '@components/test-finalisation/debrief-witnessed/debrief-witnessed';
import {
  AccompanimentCardCatCPCComponent,
} from '@pages/waiting-room-to-car/cat-cpc/components/accompaniment-card/accompaniment-card.cat-cpc';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DateOfTest } from '../../components/date-of-test/date-of-test';
import { CandidateSectionComponent } from '../../components/candidate-section/candidate-section';
import { OfficeCatCPCPage } from '../office.cat-cpc.page';
import { IdentificationComponent } from '../../components/identification/identification';
import { AdditionalInformationComponent } from '../../components/additional-information/additional-information';
import { CandidateDescriptionComponent } from '../../components/candidate-description/candidate-description';

describe('OfficeCatCPCPage', () => {
  let fixture: ComponentFixture<OfficeCatCPCPage>;
  let component: OfficeCatCPCPage;
  let store$: Store<StoreModel>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        OfficeCatCPCPage,
        MockComponent(DebriefWitnessedComponent),
        MockComponent(CandidateDescriptionComponent),
        MockComponent(IdentificationComponent),
        MockComponent(CombinationComponent),
        MockComponent(AdditionalInformationComponent),
        MockComponent(AssessmentReportComponent),
        MockComponent(CandidateSectionComponent),
        MockComponent(PassCertificateDeclarationComponent),
        MockComponent(DateOfTest),
        MockComponent(AccompanimentCardCatCPCComponent),
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
                category: TestCategory.CCPC,
                vehicleDetails: {},
                accompaniment: {},
                testSummary: {
                  candidateDescription: 'tall',
                  additionalInformation: 'additional',
                  assessmentReport: null,
                  identification: 'Licence',
                  D255: false,
                },
                testData: {
                  combination: 'LGV4',
                  question1: {
                    questionCode: 'Q08',
                    title: 'title',
                    subtitle: 'subtitle',
                    additionalItems: [],
                    answer1: {
                      selected: true,
                      label: 'label',
                    },
                    answer2: {
                      selected: false,
                      label: 'label',
                    },
                    answer3: {
                      selected: false,
                      label: 'label',
                    },
                    answer4: {
                      selected: false,
                      label: 'label',
                    },
                    score: 5,
                  },
                  question2: {
                    questionCode: 'Q04',
                    title: 'title',
                    subtitle: 'subtitle',
                    additionalItems: [],
                    answer1: {
                      selected: true,
                      label: 'label',
                    },
                    answer2: {
                      selected: false,
                      label: 'label',
                    },
                    answer3: {
                      selected: false,
                      label: 'label',
                    },
                    answer4: {
                      selected: false,
                      label: 'label',
                    },
                    score: 5,
                  },
                  question3: {
                    questionCode: 'Q15',
                    title: 'title',
                    subtitle: 'subtitle',
                    additionalItems: [],
                    answer1: {
                      selected: true,
                      label: 'label',
                    },
                    answer2: {
                      selected: false,
                      label: 'label',
                    },
                    answer3: {
                      selected: false,
                      label: 'label',
                    },
                    answer4: {
                      selected: false,
                      label: 'label',
                    },
                    score: 5,
                  },
                  question4: {
                    questionCode: 'Q11',
                    title: 'title',
                    subtitle: 'subtitle',
                    additionalItems: [],
                    answer1: {
                      selected: true,
                      label: 'label',
                    },
                    answer2: {
                      selected: false,
                      label: 'label',
                    },
                    answer3: {
                      selected: false,
                      label: 'label',
                    },
                    answer4: {
                      selected: false,
                      label: 'label',
                    },
                    score: 5,
                  },
                  question5: {
                    questionCode: 'Q05',
                    title: 'title',
                    subtitle: 'subTitle',
                    additionalItems: [],
                    answer1: {
                      selected: true,
                      label: 'Brakes',
                    },
                    answer2: {
                      selected: true,
                      label: 'Horn',
                    },
                    answer3: {
                      selected: false,
                      label: 'Exhaust system(s)',
                    },
                    answer4: {
                      selected: true,
                      label: 'Lights/Reflectors',
                    },
                    answer5: {
                      selected: true,
                      label: 'Mirrors',
                    },
                    answer6: {
                      selected: false,
                      label: 'Instrument panel warning lights',
                    },
                    answer7: {
                      selected: true,
                      label: 'Tyres / Wheel fixings ',
                    },
                    answer8: {
                      selected: true,
                      label: 'Height marker',
                    },
                    answer9: {
                      selected: true,
                      label: 'Wipers / Washers',
                    },
                    answer10: {
                      selected: true,
                      label: 'Air leaks',
                    },
                    score: 15,
                  },
                  totalPercent: 75,
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
    fixture = TestBed.createComponent(OfficeCatCPCPage);
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
    describe('getCombinationAdditionalText', () => {
      it('should return the additionalText for the passed in combination code (LGV1)', () => {
        expect(component.getCombinationAdditionalText('LGV1')).toEqual('Fire ex');
      });
      it('should return the additionalText for the passed in combination code (LGV2)', () => {
        expect(component.getCombinationAdditionalText('LGV2')).toEqual('LSDT');
      });
      it('should return the null for the passed in combination code (LGV3) has no additional text', () => {
        expect(component.getCombinationAdditionalText('LGV3')).toEqual(null);
      });
      it('should return null when nothing is passed in', () => {
        expect(component.getCombinationAdditionalText(null)).toEqual(null);
      });
    });
    describe('isFail', () => {
      it('should return false if test outcome is pass', () => {
        component.outcome = TestOutcome.PASS;
        expect(component.isFail()).toEqual(false);
      });
      it('should return true if test outcome is fail', () => {
        component.outcome = TestOutcome.FAIL;
        expect(component.isFail()).toEqual(true);
      });
    });
    describe('assessmentReportChanged', () => {
      it('should dispatch assessment report to the store', () => {
        component.assessmentReportChanged('text');
        expect(store$.dispatch).toHaveBeenCalledWith(AssessmentReportChanged('text'));
      });
    });
  });

});
