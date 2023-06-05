import {
  ComponentFixture, fakeAsync, TestBed, tick, waitForAsync,
} from '@angular/core/testing';
import { ModalControllerMock, PlatformMock, RouterMock } from '@mocks/index.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { MockComponent } from 'ng-mocks';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { TransmissionComponent } from '@components/common/transmission/transmission';
import { FinalisationHeaderComponent } from '@components/test-finalisation/finalisation-header/finalisation-header';
import { LanguagePreferencesComponent } from '@components/test-finalisation/language-preference/language-preference';
import { DebriefWitnessedComponent } from '@components/test-finalisation/debrief-witnessed/debrief-witnessed';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import {
  PassCertificateNumberComponent,
} from '@pages/pass-finalisation/components/pass-certificate-number/pass-certificate-number';
import { LicenseProvidedComponent } from '@pages/pass-finalisation/components/license-provided/license-provided';
import {
  LicenceProvidedWarningBannerComponent,
} from '@pages/pass-finalisation/components/licence-provided-warning-banner/licence-provided-warning-banner';
import { ModalController, Platform } from '@ionic/angular';
import { AppModule } from '@app/app.module';
import { D255Component } from '@components/test-finalisation/d255/d255';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestResultCommonSchema } from '@dvsa/mes-test-schema/categories/common';
import { TestsModel } from '@store/tests/tests.model';
import { provideMockStore } from '@ngrx/store/testing';
import { PassFinalisationPage } from '@pages/pass-finalisation/pass-finalisation.page';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { TestDataByCategoryProviderMock } from '@providers/test-data-by-category/__mocks__/test-data-by-category.mock';
import { OutcomeBehaviourMapProviderMock } from '@providers/outcome-behaviour-map/__mocks__/outcome-behaviour-map.mock';
import { BikeCategoryTypeComponent } from '@components/common/bike-category-type/bike-category-type';
import {
  PassCertificateNumberCatAMod1Component,
} from '@pages/pass-finalisation/components/pass-cert-number-mod1/pass-certificate-number.cat-a-mod1';
import {
  ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators,
} from '@angular/forms';
import {
  Code78NotPresent,
  Code78Present,
  PassCertificateNumberChanged,
  ProvisionalLicenseNotReceived,
  ProvisionalLicenseReceived,
} from '@store/tests/pass-completion/pass-completion.actions';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import {
  CandidateChoseToProceedWithTestInEnglish,
  CandidateChoseToProceedWithTestInWelsh,
} from '@store/tests/communication-preferences/communication-preferences.actions';
import {
  D255No, D255Yes, DebriefUnWitnessed, DebriefWitnessed,
} from '@store/tests/test-summary/test-summary.actions';
import { GearboxCategoryChanged } from '@store/tests/vehicle-details/vehicle-details.actions';
import {
  ReasonForNoAdviceGivenChanged,
  SeekFurtherDevelopmentChanged,
} from '@store/tests/test-data/cat-adi-part3/review/review.actions';
import { StartTimeChanged } from '@store/tests/test-data/cat-adi-part3/start-time/start-time.actions';
import { EndTimeChanged } from '@store/tests/test-data/cat-adi-part3/end-time/end-time.actions';
import { TransmissionType } from '@shared/models/transmission-type';
import { of, Subscription } from 'rxjs';
import {
  PassFinalisationValidationError,
  PassFinalisationViewDidEnter,
} from '@pages/pass-finalisation/pass-finalisation.actions';
import { PersistTests } from '@store/tests/tests.actions';
import {
  PASS_CERTIFICATE_NUMBER_CTRL,
} from '@pages/pass-finalisation/components/pass-certificate-number/pass-certificate-number.constants';

describe('PassFinalisationPage', () => {
  let fixture: ComponentFixture<PassFinalisationPage>;
  let component: PassFinalisationPage;
  let store$: Store<StoreModel>;
  const activatedRouteMock = {
    snapshot: {
      data: {
        passData: [{}, {}],
      },
    } as Data,
  } as ActivatedRoute;

  const initialState = {
    appInfo: { employeeId: '123456' },
    tests: {
      currentTest: {
        slotId: '123',
      },
      testStatus: {},
      startedTests: {
        123: {
          version: '1',
          rekey: false,
          activityCode: '1',
          passCompletion: {
            passCertificateNumber: 'test',
            code78: true,
          },
          category: TestCategory.D,
          changeMarker: null,
          examinerBooked: null,
          examinerConducted: null,
          examinerKeyed: null,
          journalData: {
            examiner: null,
            testCentre: null,
            testSlotAttributes: null,
            applicationReference: {
              applicationId: 11223341,
              bookingSequence: 11,
              checkDigit: 1,
            },
            candidate: {
              candidateName: {
                firstName: 'Firstname',
                lastName: 'Lastname',
              },
            },
          },
          testData: {
            vehicleChecks: {
              fullLicenceHeld: false,
              showMeQuestions: [
                {
                  code: 'Q1',
                  outcome: 'DF',
                  description: 'All doors secure',
                },
              ],
              tellMeQuestions: [
                {
                  code: 'Q3',
                  outcome: 'P',
                  description: 'Safety factors while loading',
                },
              ],
            },
            safetyQuestions: {
              questions: [
                {
                  outcome: 'DF',
                  description: 'Fire Extinguisher',
                },
                {
                  outcome: 'DF',
                  description: 'Emergency exit',
                },
                {
                  outcome: 'P',
                  description: 'Fuel cutoff',
                },
              ],
              faultComments: '',
            },
          },
          vehicleDetails: { gearboxCategory: 'Manual' },
          communicationPreferences: {
            conductedLanguage: 'English',
          },
          testSummary: {
            D255: true,
          },
        } as TestResultCommonSchema,
      },
    } as TestsModel,
  } as StoreModel;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        PassFinalisationPage,
        MockComponent(PracticeModeBanner),
        MockComponent(PassCertificateNumberComponent),
        MockComponent(PassCertificateNumberCatAMod1Component),
        MockComponent(LicenseProvidedComponent),
        MockComponent(TransmissionComponent),
        MockComponent(D255Component),
        MockComponent(DebriefWitnessedComponent),
        MockComponent(FinalisationHeaderComponent),
        MockComponent(LanguagePreferencesComponent),
        MockComponent(WarningBannerComponent),
        MockComponent(LicenceProvidedWarningBannerComponent),
        MockComponent(BikeCategoryTypeComponent),
      ],
      imports: [
        AppModule,
        ReactiveFormsModule,
      ],
      providers: [
        {
          provide: Router,
          useClass: RouterMock,
        },
        {
          provide: Platform,
          useClass: PlatformMock,
        },
        {
          provide: AuthenticationProvider,
          useClass: AuthenticationProviderMock,
        },
        {
          provide: OutcomeBehaviourMapProvider,
          useClass: OutcomeBehaviourMapProviderMock,
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
        {
          provide: ModalController,
          useClass: ModalControllerMock,
        },
        {
          provide: TestDataByCategoryProvider,
          useClass: TestDataByCategoryProviderMock,
        },
        {
          provide: OutcomeBehaviourMapProvider,
          useClass: OutcomeBehaviourMapProviderMock,
        },
        provideMockStore({ initialState }),
      ],
    });

    fixture = TestBed.createComponent(PassFinalisationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.subscription = new Subscription();
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
    // router = TestBed.inject(Router);
    // spyOn(router, 'navigate');
  }));

  describe('Class', () => {
    describe('ngOnInit', () => {
      it('should define subscription', () => {
        component.ngOnInit();
        expect(component.subscription)
          .toBeDefined();
      });
      // it('should set transmissionCtrl correctly', () => {
      //   component.form = new UntypedFormGroup({ transmissionCtrl: new UntypedFormControl() });
      //
      //   component.ngOnInit();
      //   // component.pageState.transmissionManualRadioChecked$.subscribe();
      //
      //   expect(component.form.controls['transmissionCtrl'].value).toEqual('Manual');
      // });
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
    describe('ionViewDidEnter', () => {
      it('should dispatch the view did enter action', () => {
        component.subscription = new Subscription();
        component.subscription.unsubscribe();
        component.merged$ = of(null);
        component.ionViewDidEnter();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(PassFinalisationViewDidEnter());
      });
    });
    describe('provisionalLicenseReceived', () => {
      it('should dispatch the correct action when called', () => {
        component.provisionalLicenseReceived();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(ProvisionalLicenseReceived());
        expect(store$.dispatch)
          .toHaveBeenCalledTimes(1);
      });
    });
    describe('provisionalLicenseNotReceived', () => {
      it('should dispatch the correct action when called', () => {
        component.provisionalLicenseNotReceived();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(ProvisionalLicenseNotReceived());
        expect(store$.dispatch)
          .toHaveBeenCalledTimes(1);
      });
    });
    describe('transmissionChanged', () => {
      it('should dispatch the correct action when called', () => {
        component.transmissionChanged('Manual');
        expect(store$.dispatch)
          .toHaveBeenCalledWith(GearboxCategoryChanged('Manual'));
        expect(store$.dispatch)
          .toHaveBeenCalledTimes(1);
      });
    });
    describe('passCertificateNumberChanged', () => {
      it('should dispatch the correct action when called', () => {
        component.passCertificateNumberChanged('1e3f5y64');
        expect(store$.dispatch)
          .toHaveBeenCalledWith(PassCertificateNumberChanged('1e3f5y64'));
        expect(store$.dispatch)
          .toHaveBeenCalledTimes(1);
      });
    });
    describe('d255Changed', () => {
      it('should dispatch the correct action if the inputted value is true', () => {
        component.d255Changed(true);
        expect(store$.dispatch)
          .toHaveBeenCalledWith(D255Yes());
        expect(store$.dispatch)
          .toHaveBeenCalledTimes(1);
      });
      it('should dispatch the correct action if the inputted value is false', () => {
        component.d255Changed(false);
        expect(store$.dispatch)
          .toHaveBeenCalledWith(D255No());
        expect(store$.dispatch)
          .toHaveBeenCalledTimes(1);
      });
    });
    describe('debriefWitnessedChanged', () => {
      it('should dispatch the correct action if the inputted value is true', () => {
        component.debriefWitnessedChanged(true);
        expect(store$.dispatch)
          .toHaveBeenCalledWith(DebriefWitnessed());
        expect(store$.dispatch)
          .toHaveBeenCalledTimes(1);
      });
      it('should dispatch the correct action if the inputted value is false', () => {
        component.debriefWitnessedChanged(false);
        expect(store$.dispatch)
          .toHaveBeenCalledWith(DebriefUnWitnessed());
        expect(store$.dispatch)
          .toHaveBeenCalledTimes(1);
      });
    });
    describe('isWelshChanged', () => {
      it('should dispatch the correct action if the isWelsh flag is true', () => {
        component.isWelshChanged(true);
        expect(store$.dispatch)
          .toHaveBeenCalledWith(CandidateChoseToProceedWithTestInWelsh('Cymraeg'));
        expect(store$.dispatch)
          .toHaveBeenCalledTimes(1);
      });
      it('should dispatch the correct action if the isWelsh flag is false', () => {
        component.isWelshChanged(false);
        expect(store$.dispatch)
          .toHaveBeenCalledWith(CandidateChoseToProceedWithTestInEnglish('English'));
        expect(store$.dispatch)
          .toHaveBeenCalledTimes(1);
      });
    });
    describe('onCode78Present', () => {
      [
        {
          outcome: true,
          action: Code78Present,
        },
        {
          outcome: false,
          action: Code78NotPresent,
        },
      ].forEach(({
        action,
        outcome,
      }) => {
        it(`should dispatch Code78${outcome ? 'Present' : 'NotPresent'} with ${outcome}`, () => {
          component.onCode78Present(outcome);
          expect(store$.dispatch)
            .toHaveBeenCalledWith(action());
        });
      });
    });
    describe('categoryCodeChanged', () => {
      it('should dispatch PopulateTestCategory with category', () => {
        component.categoryCodeChanged('B');
        expect(store$.dispatch)
          .toHaveBeenCalledWith(PopulateTestCategory('B'));
      });
    });
    describe('furtherDevelopmentChanged', () => {
      it('should dispatch SeekFurtherDevelopmentChanged with boolean', () => {
        component.furtherDevelopmentChanged(true);
        expect(store$.dispatch)
          .toHaveBeenCalledWith(SeekFurtherDevelopmentChanged(true));
      });
    });
    describe('adviceReasonChanged', () => {
      it('should dispatch ReasonForNoAdviceGivenChanged with value', () => {
        component.adviceReasonChanged('some reason');
        expect(store$.dispatch)
          .toHaveBeenCalledWith(ReasonForNoAdviceGivenChanged('some reason'));
      });
    });
    describe('testStartTimeChanged', () => {
      it('should dispatch StartTimeChanged with value', () => {
        component.testStartTimeChanged('some time');
        expect(store$.dispatch)
          .toHaveBeenCalledWith(StartTimeChanged('some time'));
      });
    });
    describe('testEndTimeChanged', () => {
      it('should dispatch EndTimeChanged with value', () => {
        component.testEndTimeChanged('some time');
        expect(store$.dispatch)
          .toHaveBeenCalledWith(EndTimeChanged('some time'));
      });
    });
    describe('isNorthernIreland', () => {
      it('should return false when not Cat B', () => {
        component.testCategory = TestCategory.C;
        expect(component.isNorthernIreland('ABC123'))
          .toEqual(false);
      });
      it('should return true when Cat B and a numeric input', () => {
        component.testCategory = TestCategory.B;
        expect(component.isNorthernIreland('1231232'))
          .toEqual(true);
      });
      it('should return false when Cat B but non numeric chars are found', () => {
        component.testCategory = TestCategory.B;
        expect(component.isNorthernIreland('ABC123'))
          .toEqual(false);
      });
    });
    describe('shouldShowCandidateDoesntNeedLicenseBanner', () => {
      [
        TestCategory.C, TestCategory.C1, TestCategory.CE, TestCategory.C1E,
        TestCategory.D, TestCategory.D1, TestCategory.DE, TestCategory.D1E,
      ].forEach((cat) => {
        it(`should return the value licence received holds when cat ${cat}`, () => {
          component.testCategory = cat;
          expect(component.shouldShowCandidateDoesntNeedLicenseBanner())
            .toEqual(component.provisionalLicenseIsReceived);
        });
      });
      it('should return false when not one of specified cats', () => {
        component.testCategory = TestCategory.B;
        expect(component.shouldShowCandidateDoesntNeedLicenseBanner())
          .toEqual(false);
      });
    });
    describe('shouldShowCode78Banner', () => {
      [
        TestCategory.C, TestCategory.C1, TestCategory.CE, TestCategory.C1E,
        TestCategory.D, TestCategory.D1, TestCategory.DE, TestCategory.D1E,
      ].forEach((cat) => {
        it(`should return true when cat ${cat} and code78 and transmission are set`, () => {
          component.code78Present = true;
          component.transmission = TransmissionType.Manual;
          component.testCategory = cat;
          expect(component.shouldShowCode78Banner())
            .toEqual(true);
        });
      });
      it('should return false when not one of specified cats', () => {
        component.testCategory = TestCategory.B;
        expect(component.shouldShowCode78Banner())
          .toEqual(false);
      });
    });
    describe('shouldShowManualBanner', () => {
      it('should return true when manual', () => {
        spyOn(component, 'shouldShowCode78Banner')
          .and
          .returnValue(true);
        component.transmission = TransmissionType.Manual;
        expect(component.shouldShowManualBanner())
          .toEqual(true);
      });
      it('should return true when automatic and not code78', () => {
        spyOn(component, 'shouldShowCode78Banner')
          .and
          .returnValue(true);
        component.transmission = TransmissionType.Automatic;
        component.code78Present = false;
        expect(component.shouldShowManualBanner())
          .toEqual(true);
      });
      it('should return false when shouldShowCode78Banner returns false', () => {
        spyOn(component, 'shouldShowCode78Banner')
          .and
          .returnValue(false);
        expect(component.shouldShowManualBanner())
          .toEqual(false);
      });
    });
    describe('shouldShowAutomaticBanner', () => {
      it('should return false when not automatic', () => {
        spyOn(component, 'shouldShowCode78Banner')
          .and
          .returnValue(true);
        component.transmission = TransmissionType.Manual;
        component.code78Present = true;
        expect(component.shouldShowAutomaticBanner())
          .toEqual(false);
      });
      it('should return true when automatic and code78', () => {
        spyOn(component, 'shouldShowCode78Banner')
          .and
          .returnValue(true);
        component.transmission = TransmissionType.Automatic;
        component.code78Present = true;
        expect(component.shouldShowAutomaticBanner())
          .toEqual(true);
      });
      it('should return false when shouldShowCode78Banner returns false', () => {
        spyOn(component, 'shouldShowCode78Banner')
          .and
          .returnValue(false);
        expect(component.shouldShowAutomaticBanner())
          .toEqual(false);
      });
    });
    describe('onSubmit', () => {
      it('should dispatch the ProvisionalLicenseNotReceived action', async () => {
        spyOn(component, 'isNorthernIreland')
          .and
          .returnValue(true);
        component.candidateDriverNumber = '1234567';
        await component.onSubmit();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(ProvisionalLicenseNotReceived());
      });
      // Unit tests for the components TypeScript class
      it('should dispatch the PersistTests action', async () => {
        await component.onSubmit();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(PersistTests());
      });

      it('should dispatch the appropriate ValidationError actions', fakeAsync(() => {
        component.form = new UntypedFormGroup({
          requiredControl1: new UntypedFormControl(null, [Validators.required]),
          requiredControl2: new UntypedFormControl(null, [Validators.required]),
          [PASS_CERTIFICATE_NUMBER_CTRL]: new UntypedFormControl(null, [Validators.required]),
          notRequiredControl: new UntypedFormControl(null),
        });

        component.onSubmit();
        tick();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(PassFinalisationValidationError('requiredControl1 is blank'));
        expect(store$.dispatch)
          .toHaveBeenCalledWith(PassFinalisationValidationError('requiredControl2 is blank'));
        expect(store$.dispatch)
          .toHaveBeenCalledWith(PassFinalisationValidationError(`${PASS_CERTIFICATE_NUMBER_CTRL} is invalid`));
        expect(store$.dispatch)
          .not
          .toHaveBeenCalledWith(PassFinalisationValidationError('notRequiredControl is blank'));
      }));
    });
  });
  describe('displayTransmissionBanner', () => {
    it('should return true if transmission is automatic and form is dirty', () => {
      component.testCategory = TestCategory.B;
      component.transmission = TransmissionType.Automatic;
      component.form = new UntypedFormGroup({ transmissionCtrl: new UntypedFormControl() });
      component.form.controls['transmissionCtrl'].markAsDirty();
      expect(component.displayTransmissionBanner())
        .toEqual(true);
    });
    it('should return false if transmission is not automatic and form is dirty', () => {
      component.testCategory = TestCategory.B;
      component.transmission = TransmissionType.Manual;
      component.form = new UntypedFormGroup({ transmissionCtrl: new UntypedFormControl() });
      component.form.controls['transmissionCtrl'].markAsDirty();
      expect(component.displayTransmissionBanner())
        .toEqual(false);
    });
    // it('should return false if transmission is automatic and form is not dirty', () => {
    //   component.transmission = 'Automatic';
    //   component.form = new UntypedFormGroup({ transmissionCtrl: new UntypedFormControl() });
    //   component.form.controls['transmissionCtrl'].markAsPristine();
    //   expect(component.displayTransmissionBanner())
    //     .toEqual(false);
    // });
    it('should return false if transmission is not automatic and form is not dirty', () => {
      component.testCategory = TestCategory.B;
      component.transmission = TransmissionType.Manual;
      component.form = new UntypedFormGroup({ transmissionCtrl: new UntypedFormControl() });
      component.form.controls['transmissionCtrl'].markAsPristine();
      expect(component.displayTransmissionBanner())
        .toEqual(false);
    });
  });

});
