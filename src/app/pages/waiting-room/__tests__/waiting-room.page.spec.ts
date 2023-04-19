import {
  ComponentFixture, fakeAsync, TestBed, tick, waitForAsync,
} from '@angular/core/testing';
import { ModalController, Platform } from '@ionic/angular';
import { PlatformMock } from '@mocks/index.mock';
import { Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { MockComponent } from 'ng-mocks';
import { UntypedFormControl, Validators } from '@angular/forms';
import { JournalData, TestResultCommonSchema } from '@dvsa/mes-test-schema/categories/common';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import { AppModule } from '@app/app.module';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { StoreModel } from '@shared/models/store.model';
import * as preTestDeclarationsActions from '@store/tests/pre-test-declarations/pre-test-declarations.actions';
import {
  ToggleInsuranceDeclaration,
  ToggleResidencyDeclaration,
} from '@store/tests/pre-test-declarations/pre-test-declarations.actions';
import {
  initialState as preTestDeclarationInitialState,
} from '@store/tests/pre-test-declarations/pre-test-declarations.reducer';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';
import {
  DeviceAuthenticationProviderMock,
} from '@providers/device-authentication/__mocks__/device-authentication.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import * as communicationPreferenceActions
  from '@store/tests/communication-preferences/communication-preferences.actions';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { ScreenOrientationMock } from '@shared/mocks/screen-orientation.mock';
import { InsomniaMock } from '@shared/mocks/insomnia.mock';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { EndTestLinkComponent } from '@components/common/end-test-link/end-test-link';
import { LockScreenIndicator } from '@components/common/screen-lock-indicator/lock-screen-indicator';
import { CandidateSectionComponent } from '@components/common/candidate-section/candidate-section';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { AppComponent } from '@app/app.component';
import { MockAppComponent } from '@app/__mocks__/app.component.mock';
import { BasePageComponent } from '@shared/classes/base-page';
import { SignatureComponent } from '@components/common/signature/signature';
import { GetCandidateLicenceData } from '@pages/candidate-licence/candidate-licence.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { CbtNumberChanged } from '@store/tests/pre-test-declarations/cat-a/pre-test-declarations.cat-a.actions';
import { TestsModel } from '@store/tests/tests.model';
import { provideMockStore } from '@ngrx/store/testing';
import { ResidencyDeclarationComponent } from '../components/residency-declaration/residency-declaration';
import { InsuranceDeclarationComponent } from '../components/insurance-declaration/insurance-declaration';
import { ConductedLanguageComponent } from '../components/conducted-language/conducted-language';
import { WaitingRoomValidationError } from '../waiting-room.actions';
import { WaitingRoomPage } from '../waiting-room.page';
import { ManoeuvresPassCertificateComponent } from '../components/manoeuvres-pass-cert/manoeuvres-pass-cert';
import { CBTNumberComponent } from '../components/cbt-number/cbt-number';

describe('WaitingRoomPage', () => {
  let fixture: ComponentFixture<WaitingRoomPage>;
  let component: WaitingRoomPage;
  let store$: Store<StoreModel>;
  let deviceProvider: DeviceProvider;
  let deviceAuthenticationProvider: DeviceAuthenticationProvider;
  let screenOrientation: ScreenOrientation;
  let insomnia: Insomnia;
  let translate: TranslateService;
  let modalController: ModalController;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

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
          passCompletion: { passCertificateNumber: 'test', code78Present: true },
          category: TestCategory.C,
          changeMarker: null,
          examinerBooked: null,
          examinerConducted: null,
          examinerKeyed: null,
          journalData: {
            examiner: null,
            testCentre: null,
            testSlotAttributes: null,
            applicationReference: null,
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
              showMeQuestions: null,
              tellMeQuestions: null,
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
        } as TestResultCommonSchema,
      },
    } as TestsModel,
  } as StoreModel;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        WaitingRoomPage,
        MockComponent(PracticeModeBanner),
        MockComponent(EndTestLinkComponent),
        MockComponent(LockScreenIndicator),
        MockComponent(CandidateSectionComponent),
        MockComponent(ConductedLanguageComponent),
        MockComponent(InsuranceDeclarationComponent),
        MockComponent(ResidencyDeclarationComponent),
        MockComponent(SignatureComponent),
        MockComponent(ManoeuvresPassCertificateComponent),
        MockComponent(CBTNumberComponent),
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        AppModule,
        TranslateModule,
        StoreModule.forFeature('tests', () => ({
          currentTest: {
            slotId: '123',
          },
          testStatus: {},
          startedTests: {
            123: {
              category: TestCategory.C,
              preTestDeclarations: preTestDeclarationInitialState,
              postTestDeclarations: {
                healthDeclarationAccepted: false,
                passCertificateNumberReceived: false,
                postTestSignature: '',
              },
              journalData: {
                candidate: candidateMock,
                testSlotAttributes: {
                  welshTest: false,
                },
              },
              communicationPreferences: {
                updatedEmaill: 'test@mail.com',
                communicationMethod: 'Email',
                conductedLanguage: 'Cymraeg',
              },
            },
          },
        })),
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: Platform, useClass: PlatformMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: DeviceAuthenticationProvider, useClass: DeviceAuthenticationProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: DeviceProvider, useClass: DeviceProviderMock },
        { provide: ScreenOrientation, useClass: ScreenOrientationMock },
        { provide: Insomnia, useClass: InsomniaMock },
        { provide: AppComponent, useClass: MockAppComponent },
        provideMockStore({ initialState }),
      ],
    });

    fixture = TestBed.createComponent(WaitingRoomPage);
    component = fixture.componentInstance;
    deviceProvider = TestBed.inject(DeviceProvider);
    screenOrientation = TestBed.inject(ScreenOrientation);
    insomnia = TestBed.inject(Insomnia);
    deviceAuthenticationProvider = TestBed.inject(DeviceAuthenticationProvider);
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    store$ = TestBed.inject(Store);
    modalController = TestBed.inject(ModalController);
    spyOn(store$, 'dispatch');
    component.subscription = new Subscription();
  }));

  describe('Class', () => {
    describe('residencyDeclarationChanged', () => {
      it('should emit a residency declaration toggle action when changed', () => {
        component.residencyDeclarationChanged();

        expect(store$.dispatch).toHaveBeenCalledWith(ToggleResidencyDeclaration());
      });
    });

    describe('insuranceDeclarationChanged', () => {
      it('should emit an insurance declaration toggle action when changed', () => {
        component.insuranceDeclarationChanged();

        expect(store$.dispatch).toHaveBeenCalledWith(ToggleInsuranceDeclaration());
      });
    });

    describe('manoeuvresPassCertNumberChanged', () => {
      it('should emit a manoeuvre pass cert number action with payload', () => {
        component.manoeuvresPassCertNumberChanged('123');
        expect(store$.dispatch)
          .toHaveBeenCalledWith(preTestDeclarationsActions.ManoeuvresPassCertNumberChanged('123'));
      });
    });

    describe('dispatchCandidateChoseToProceedInWelsh', () => {
      it('it should dispatch CandidateChoseToProceedWithTestInWelsh action', () => {
        component.dispatchCandidateChoseToProceedInWelsh();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(communicationPreferenceActions.CandidateChoseToProceedWithTestInWelsh(
            Language.CYMRAEG,
          ));
      });
    });

    describe('dispatchCandidateChoseToProceedInEnglish', () => {
      it('it should dispatch CandidateChoseToProceedWithTestInEnglish action', () => {
        component.dispatchCandidateChoseToProceedInEnglish();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(communicationPreferenceActions.CandidateChoseToProceedWithTestInEnglish(
            Language.ENGLISH,
          ));
      });
    });

    describe('showCandidateDataMissingError', () => {
      it('should create an error modal', async () => {
        spyOn(modalController, 'create').and.returnValue(Promise.resolve({
          present: async () => {},
          onWillDismiss: async () => {},
        } as any as HTMLIonModalElement));
        await component.showCandidateDataMissingError();
        expect(modalController.create).toHaveBeenCalled();
      });
    });

    describe('ionViewDidEnter', () => {
      it('should not enable single app mode if on ios and in practice mode', async () => {
        spyOn(BasePageComponent.prototype, 'isIos').and.returnValue(true);
        component.isEndToEndPracticeMode = true;
        await component.ionViewDidEnter();
        expect(deviceProvider.enableSingleAppMode).not.toHaveBeenCalled();
      });

      it('should enable single app mode if on ios and not in practice mode', async () => {
        spyOn(BasePageComponent.prototype, 'isIos').and.returnValue(true);
        component.isEndToEndPracticeMode = false;
        await component.ionViewDidEnter();
        expect(deviceProvider.enableSingleAppMode).toHaveBeenCalled();
      });

      it('should lock the screen orientation to Portrait Primary', async () => {
        spyOn(BasePageComponent.prototype, 'isIos').and.returnValue(true);
        component.isEndToEndPracticeMode = false;
        await component.ionViewDidEnter();
        expect(screenOrientation.lock)
          .toHaveBeenCalledWith(screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
      });

      it('should keep the device awake', async () => {
        spyOn(BasePageComponent.prototype, 'isIos').and.returnValue(true);
        component.isEndToEndPracticeMode = false;
        await component.ionViewDidEnter();
        expect(insomnia.keepAwake).toHaveBeenCalled();
      });

      it('should dispatch the action which calls out for candidate licence data', async () => {
        await component.ionViewDidEnter();
        expect(store$.dispatch).toHaveBeenCalledWith(GetCandidateLicenceData());
      });
    });

    describe('ionViewWillEnter', () => {
      it('should setup subscription if merged is present', () => {
        component.merged$ = new Observable<string | boolean>();
        component.ionViewWillEnter();

        expect(component.subscription).toBeDefined();
      });
    });

    describe('canDeActivate', () => {
      it('should call through to triggerLockScreen', async () => {
        await component.canDeActivate();
        expect(deviceAuthenticationProvider.triggerLockScreen).toHaveBeenCalled();
      });
    });

    describe('shouldNavigateToCandidateLicenceDetails', () => {
      it('should return true if rekey is false and test category is not ADI3 or SC', () => {
        component.isRekey = false;
        component.testCategory = TestCategory.B;
        expect(component['shouldNavigateToCandidateLicenceDetails']()).toEqual(true);
      });
      it('should return false if rekey is true and test category is not ADI3 or SC', () => {
        component.isRekey = true;
        component.testCategory = TestCategory.B;
        expect(component['shouldNavigateToCandidateLicenceDetails']()).toEqual(false);
      });
      [TestCategory.ADI3, TestCategory.SC].forEach((val) => {
        it(`should return false if rekey is false and test category is ${val}`, () => {
          component.isRekey = false;
          component.testCategory = val;
          expect(component['shouldNavigateToCandidateLicenceDetails']()).toEqual(false);
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

    describe('ngOnInit', () => {
      it('should resolve state variables', () => {
        component.ngOnInit();

        component.pageState.showManoeuvresPassCertNumber$
          .subscribe((res) => expect(res).toEqual(true));
        component.pageState.showCbtNumber$
          .subscribe((res) => expect(res).toEqual(false));
        component.pageState.showResidencyDec$
          .subscribe((res) => expect(res).toEqual(true));
      });
    });

    describe('cbtNumberChanged', () => {
      it('should dispatch SignatureDataChanged with parameter passed', () => {
        component.cbtNumberChanged('test');
        expect(store$.dispatch).toHaveBeenCalledWith(CbtNumberChanged('test'));
      });
    });

    describe('signatureChanged', () => {
      it('should dispatch SignatureDataChanged with parameter passed', () => {
        component.signatureChanged('test');
        expect(store$.dispatch).toHaveBeenCalledWith(preTestDeclarationsActions.SignatureDataChanged('test'));
      });
    });

    describe('signatureCleared', () => {
      it('should dispatch SignatureDataCleared', () => {
        component.signatureCleared();
        expect(store$.dispatch).toHaveBeenCalledWith(preTestDeclarationsActions.SignatureDataCleared());
      });
    });

    describe('onSubmit', () => {
      it('should navigate to the CandidateLicencePage if the form is valid', async () => {
        const { formGroup } = component;
        formGroup.addControl('insuranceCheckbox', new UntypedFormControl('', [Validators.requiredTrue]));
        formGroup.get('insuranceCheckbox').setValue(true);
        await component.onSubmit();
        expect(routerSpy.navigate).toHaveBeenCalledWith([TestFlowPageNames.CANDIDATE_LICENCE_PAGE]);
      });
      it('should dispatch the WaitingRoomValidationError action if a field is not valid', fakeAsync(() => {
        const { formGroup } = component;
        formGroup.addControl('insuranceCheckbox', new UntypedFormControl('', [Validators.requiredTrue]));
        formGroup.get('insuranceCheckbox').setValue(false);
        component.onSubmit();
        tick();
        expect(store$.dispatch).toHaveBeenCalledWith(WaitingRoomValidationError('insuranceCheckbox is blank'));
      }));
    });

    describe('isJournalDataInvalid', () => {
      const journalData: JournalData = {
        examiner: {
          staffNumber: 'real-staff-number',
        },
        testCentre: {
          centreId: 11223344,
          centreName: 'name',
          costCode: 'cost code',
        },
        testSlotAttributes: {
          slotId: 12123331,
          start: '2019-11-11',
          vehicleTypeCode: 'vehicl code',
          welshTest: true,
          specialNeeds: true,
          extendedTest: false,
        },
        candidate: {
          candidateName: {
            firstName: 'fname',
            secondName: 'sname',
          },
          driverNumber: 'real-driver-number',
        },
        applicationReference: {
          applicationId: 11223344141414,
          bookingSequence: 112,
          checkDigit: 11,
        },
      };

      it('should return true if no examiner staffnumber', () => {
        const result = component.isJournalDataInvalid({
          ...journalData,
          examiner: {
            staffNumber: '',
          },
        });
        expect(result).toEqual(true);
      });

      it('should return true if no candidate name & driver number', () => {
        const result = component.isJournalDataInvalid({
          ...journalData,
          candidate: {
            candidateName: {},
            driverNumber: '',
          },
        });
        expect(result).toEqual(true);
      });

      it('should return false if it has staff number and candidate name but no driver number', () => {
        const result = component.isJournalDataInvalid({
          ...journalData,
          candidate: {
            ...journalData.candidate,
            driverNumber: '',
          },
        });
        expect(result).toEqual(false);
      });

      it('should return false if it has staff number and driver number but no candidate name', () => {
        const result = component.isJournalDataInvalid({
          ...journalData,
          candidate: {
            ...journalData.candidate,
            driverNumber: '',
          },
        });
        expect(result).toEqual(false);
      });
    });
  });
});
