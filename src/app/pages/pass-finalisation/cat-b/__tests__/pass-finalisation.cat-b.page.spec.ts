import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AppModule } from '@app/app.module';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { TransmissionComponent } from '@components/common/transmission/transmission';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { D255Component } from '@components/test-finalisation/d255/d255';
import { DebriefWitnessedComponent } from '@components/test-finalisation/debrief-witnessed/debrief-witnessed';
import { FinalisationHeaderComponent } from '@components/test-finalisation/finalisation-header/finalisation-header';
import { LanguagePreferencesComponent } from '@components/test-finalisation/language-preference/language-preference';
import { TestResultCommonSchema } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { NavController, Platform } from '@ionic/angular';
import { NavControllerMock, PlatformMock, RouterMock } from '@mocks/index.mock';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { LicenceProvidedWarningBannerComponent } from '@pages/pass-finalisation/components/licence-provided-warning-banner/licence-provided-warning-banner';
import { LicenseProvidedComponent } from '@pages/pass-finalisation/components/license-provided/license-provided';
import { PassCertificateNumberComponent } from '@pages/pass-finalisation/components/pass-certificate-number/pass-certificate-number';
import { PASS_CERTIFICATE_NUMBER_CTRL } from '@pages/pass-finalisation/components/pass-certificate-number/pass-certificate-number.constants';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { StoreModel } from '@shared/models/store.model';
import { ProvisionalLicenseNotReceived } from '@store/tests/pass-completion/pass-completion.actions';
import { PersistTests } from '@store/tests/tests.actions';
import { TestsModel } from '@store/tests/tests.model';
import { MockComponent } from 'ng-mocks';
import { Subscription } from 'rxjs';
import { PassFinalisationValidationError, PassFinalisationViewDidEnter } from '../../pass-finalisation.actions';
import { PassFinalisationCatBPage } from '../pass-finalisation.cat-b.page';

describe('PassFinalisationCatBPage', () => {
  let fixture: ComponentFixture<PassFinalisationCatBPage>;
  let component: PassFinalisationCatBPage;
  let store$: Store<StoreModel>;

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
        } as TestResultCommonSchema,
      },
    } as TestsModel,
  } as StoreModel;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        PassFinalisationCatBPage,
        MockComponent(PracticeModeBanner),
        MockComponent(PassCertificateNumberComponent),
        MockComponent(LicenseProvidedComponent),
        MockComponent(TransmissionComponent),
        MockComponent(D255Component),
        MockComponent(DebriefWitnessedComponent),
        MockComponent(FinalisationHeaderComponent),
        MockComponent(LanguagePreferencesComponent),
        MockComponent(WarningBannerComponent),
        MockComponent(LicenceProvidedWarningBannerComponent),
      ],
      imports: [RouterModule.forRoot([]), AppModule],
      providers: [
        {
          provide: Platform,
          useClass: PlatformMock,
        },
        {
          provide: Router,
          useClass: RouterMock,
        },
        {
          provide: AuthenticationProvider,
          useClass: AuthenticationProviderMock,
        },
        {
          provide: NavController,
          useClass: NavControllerMock,
        },
        provideMockStore({ initialState }),
        OutcomeBehaviourMapProvider,
      ],
    });

    fixture = TestBed.createComponent(PassFinalisationCatBPage);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
    component.subscription = new Subscription();
  }));

  describe('Class', () => {
    describe('ngOnInit', () => {
      it('should define subscription', () => {
        component.ngOnInit();
        expect(component.subscription).toBeDefined();
      });
      it('should set transmissionCtrl correctly', () => {
        component.form = new UntypedFormGroup({ transmissionCtrl: new UntypedFormControl() });

        component.ngOnInit();
        component.pageState.transmissionManualRadioChecked$.subscribe();

        expect(component.form.controls['transmissionCtrl'].value).toEqual('Manual');
      });
    });

    describe('ionViewDidEnter', () => {
      it('should dispatch the VIEW_DID_ENTER action when the function is run', () => {
        component.ionViewDidEnter();
        expect(store$.dispatch).toHaveBeenCalledWith(PassFinalisationViewDidEnter());
        expect(store$.dispatch).toHaveBeenCalled();
      });
    });
    describe('onSubmit', () => {
      it('should dispatch the ProvisionalLicenseNotReceived action', async () => {
        component.candidateDriverNumber = '1234567';
        await component.onSubmit();
        expect(store$.dispatch).toHaveBeenCalledWith(ProvisionalLicenseNotReceived());
      });
      // Unit tests for the components TypeScript class
      it('should dispatch the PersistTests action', async () => {
        await component.onSubmit();
        expect(store$.dispatch).toHaveBeenCalledWith(PersistTests());
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
        expect(store$.dispatch).toHaveBeenCalledWith(PassFinalisationValidationError('requiredControl1 is blank'));
        expect(store$.dispatch).toHaveBeenCalledWith(PassFinalisationValidationError('requiredControl2 is blank'));
        expect(store$.dispatch).toHaveBeenCalledWith(
          PassFinalisationValidationError(`${PASS_CERTIFICATE_NUMBER_CTRL} is invalid`)
        );
        expect(store$.dispatch).not.toHaveBeenCalledWith(
          PassFinalisationValidationError('notRequiredControl is blank')
        );
      }));
    });
  });

  describe('isNorthernIreland', () => {
    const UKlicence: string = 'JONES849339TS8AD';
    const NIlicence: string = '23514780';
    it('should return true if driving licence is Northern Ireland', () => {
      expect(component.isNorthernIreland(NIlicence)).toEqual(true);
    });
    it('should return false if driving licence is Northern Ireland', () => {
      expect(component.isNorthernIreland(UKlicence)).toEqual(false);
    });
  });

  describe('ionViewDidLeave', () => {
    it('should unsubscribe from subscription if there is one', () => {
      component.subscription = new Subscription();
      spyOn(component.subscription, 'unsubscribe');
      component.ionViewDidLeave();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('displayTransmissionBanner', () => {
    it('should return true if transmission is automatic and form is dirty', () => {
      component.transmission = 'Automatic';
      component.form = new UntypedFormGroup({ transmissionCtrl: new UntypedFormControl() });
      component.form.controls['transmissionCtrl'].markAsDirty();
      expect(component.displayTransmissionBanner()).toEqual(true);
    });
    it('should return false if transmission is not automatic and form is dirty', () => {
      component.transmission = 'Manual';
      component.form = new UntypedFormGroup({ transmissionCtrl: new UntypedFormControl() });
      component.form.controls['transmissionCtrl'].markAsDirty();
      expect(component.displayTransmissionBanner()).toEqual(false);
    });
    it('should return false if transmission is automatic and form is not dirty', () => {
      component.transmission = 'Automatic';
      component.form = new UntypedFormGroup({ transmissionCtrl: new UntypedFormControl() });
      component.form.controls['transmissionCtrl'].markAsPristine();
      expect(component.displayTransmissionBanner()).toEqual(false);
    });
    it('should return false if transmission is not automatic and form is not dirty', () => {
      component.transmission = 'Manual';
      component.form = new UntypedFormGroup({ transmissionCtrl: new UntypedFormControl() });
      component.form.controls['transmissionCtrl'].markAsPristine();
      expect(component.displayTransmissionBanner()).toEqual(false);
    });
  });
});
