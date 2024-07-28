import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivityCodeComponent } from '@components/common/activity-code/activity-code';
import { ComponentsModule } from '@components/common/common-components.module';
import { DebriefWitnessedComponent } from '@components/test-finalisation/debrief-witnessed/debrief-witnessed';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonicModule, ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { ModalControllerMock, PlatformMock } from '@mocks/index.mock';
import { Store, StoreModule } from '@ngrx/store';
import { AssessmentReportComponent } from '@pages/office/cat-cpc/components/assessment-report/assessment-report';
import { CombinationComponent } from '@pages/office/cat-cpc/components/combination/combination';
import { PassCertificateDeclarationComponent } from '@pages/office/cat-cpc/components/pass-certificate-declaration/pass-certificate-declaration';
import { OfficeFooterComponent } from '@pages/office/components/office-footer/office-footer.component';
import { AccompanimentCardCatCPCComponent } from '@pages/waiting-room-to-car/cat-cpc/components/accompaniment-card/accompaniment-card.cat-cpc';
import { AccompanimentComponent } from '@pages/waiting-room-to-car/components/accompaniment/accompaniment';
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
import { StoreModel } from '@shared/models/store.model';
import { TestOutcome } from '@shared/models/test-outcome';
import { PassCertificateNumberChanged } from '@store/tests/pass-completion/pass-completion.actions';
import { PassCertificateNumberReceived } from '@store/tests/post-test-declarations/post-test-declarations.actions';
import { AddDangerousFault } from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import { TogglePlanningEco } from '@store/tests/test-data/common/eco/eco.actions';
import { ToggleETA } from '@store/tests/test-data/common/eta/eta.actions';
import { AddSeriousFault } from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import { Competencies, ExaminerActions } from '@store/tests/test-data/test-data.constants';
import { AssessmentReportChanged } from '@store/tests/test-summary/cat-cpc/test-summary.cat-cpc.actions';
import { MockComponent } from 'ng-mocks';
import { Subscription } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { AdditionalInformationComponent } from '../../components/additional-information/additional-information';
import { CandidateDescriptionComponent } from '../../components/candidate-description/candidate-description';
import { CandidateSectionComponent } from '../../components/candidate-section/candidate-section';
import { DateOfTest } from '../../components/date-of-test/date-of-test';
import { IdentificationComponent } from '../../components/identification/identification';
import { OfficeCatCPCPage } from '../office.cat-cpc.page';

describe('OfficeCatCPCPage', () => {
  let fixture: ComponentFixture<OfficeCatCPCPage>;
  let component: OfficeCatCPCPage;
  let store$: Store<StoreModel>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        OfficeCatCPCPage,
        MockComponent(OfficeFooterComponent),
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
      it('should dispatch an action to persist tests + pop navstack to root when defer is called', () => {
        spyOn(component, 'popToRoot');
        fixture.detectChanges();
        component.defer();
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

    describe('passCertificateDeclarationChanged', () => {
      it('should dispatch PassCertificateNumberReceived with the parameter passed', () => {
        component.passCertificateDeclarationChanged(true);
        expect(store$.dispatch).toHaveBeenCalledWith(PassCertificateNumberReceived(true));
      });
    });

    describe('passCertificateNumberChanged', () => {
      it('should dispatch PassCertificateNumberChanged with the parameter passed', () => {
        component.isDelegated = true;
        component.passCertificateNumberChanged('test');
        expect(store$.dispatch).toHaveBeenCalledWith(PassCertificateNumberChanged('test'));
      });
      it(
        'should dispatch PassCertificateNumberReceived with passCertificateNumberCtrl' + ' if isDelegated is false',
        () => {
          component.isDelegated = false;

          component.form.setControl('passCertificateNumberCtrl', new FormControl());
          component.form.controls['passCertificateNumberCtrl'].setValue(true);

          component.passCertificateNumberChanged('test');
          expect(store$.dispatch).toHaveBeenCalledWith(PassCertificateNumberReceived(true));
        }
      );
    });
    describe('ionViewDidLeave', () => {
      it('should unsubscribe from subscription if there is one', () => {
        component.pageSubscription = new Subscription();
        spyOn(component.pageSubscription, 'unsubscribe');
        component.ionViewDidLeave();
        expect(component.pageSubscription.unsubscribe).toHaveBeenCalled();
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
    describe('isPass', () => {
      it('should return true if test outcome is pass', () => {
        component.outcome = TestOutcome.PASS;
        expect(component.isPass()).toEqual(true);
      });
      it('should return false if test outcome is fail', () => {
        component.outcome = TestOutcome.FAIL;
        expect(component.isPass()).toEqual(false);
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
