import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MockComponent } from 'ng-mocks';

import { ModalController } from '@ionic/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { JournalData } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import { AppModule } from '@app/app.module';
import { StoreModel } from '@shared/models/store.model';
import * as preTestDeclarationsActions from '@store/tests/pre-test-declarations/pre-test-declarations.actions';
import {
  ToggleInsuranceDeclaration,
  ToggleResidencyDeclaration,
} from '@store/tests/pre-test-declarations/pre-test-declarations.actions';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';
import {
  DeviceAuthenticationProviderMock,
} from '@providers/device-authentication/__mocks__/device-authentication.mock';
import { MOCK_STORE_INITIAL_STATE } from '@mocks/state/initial-state';
import * as communicationPreferenceActions
  from '@store/tests/communication-preferences/communication-preferences.actions';
import { ModalControllerMock, RouterMock } from '@mocks/index.mock';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { InsomniaMock } from '@shared/mocks/insomnia.mock';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { EndTestLinkComponent } from '@components/common/end-test-link/end-test-link';
import { LockScreenIndicator } from '@components/common/screen-lock-indicator/lock-screen-indicator';
import { CandidateSectionComponent } from '@components/common/candidate-section/candidate-section';
import { BasePageComponent } from '@shared/classes/base-page';
import { SignatureComponent } from '@components/common/signature/signature';
import { GetCandidateLicenceData } from '@pages/candidate-licence/candidate-licence.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { CbtNumberChanged } from '@store/tests/pre-test-declarations/cat-a/pre-test-declarations.cat-a.actions';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { AccessibilityServiceMock } from '@providers/accessibility/__mocks__/accessibility-service.mock';
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
  let insomnia: Insomnia;
  let router: Router;
  let modalController: ModalController;

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
        StoreModule.forFeature('tests', () => ({})),
      ],
      providers: [
        {
          provide: DeviceAuthenticationProvider,
          useClass: DeviceAuthenticationProviderMock,
        },
        {
          provide: DeviceProvider,
          useClass: DeviceProviderMock,
        },
        {
          provide: Insomnia,
          useClass: InsomniaMock,
        },
        {
          provide: ModalController,
          useClass: ModalControllerMock,
        },
        {
          provide: Router,
          useClass: RouterMock,
        },
        {
          provide: AccessibilityService,
          useClass: AccessibilityServiceMock,
        },
        provideMockStore({ initialState: MOCK_STORE_INITIAL_STATE }),
      ],
    });

    fixture = TestBed.createComponent(WaitingRoomPage);
    component = fixture.componentInstance;

    deviceProvider = TestBed.inject(DeviceProvider);
    insomnia = TestBed.inject(Insomnia);
    deviceAuthenticationProvider = TestBed.inject(DeviceAuthenticationProvider);
    store$ = TestBed.inject(Store);
    router = TestBed.inject(Router);
    modalController = TestBed.inject(ModalController);
    spyOn(store$, 'dispatch');
  }));

  describe('Class', () => {
    describe('ngOnInit', () => {
      beforeEach(() => {
        spyOn(component, 'showCandidateDataMissingError');
      });
      it('should not call showCandidateDataMissingError when isJournalDataInvalid returns false', async () => {
        spyOn(component, 'isJournalDataInvalid')
          .and
          .returnValue(false);
        await component.ngOnInit();
        expect(component.showCandidateDataMissingError)
          .not
          .toHaveBeenCalled();
      });
      it('should call showCandidateDataMissingError when isJournalDataInvalid returns true', async () => {
        spyOn(component, 'isJournalDataInvalid')
          .and
          .returnValue(true);
        await component.ngOnInit();
        expect(component.showCandidateDataMissingError)
          .toHaveBeenCalled();
      });
    });
    describe('residencyDeclarationChanged', () => {
      it('should emit a residency declaration toggle action when changed', () => {
        component.residencyDeclarationChanged();

        expect(store$.dispatch)
          .toHaveBeenCalledWith(ToggleResidencyDeclaration());
      });
    });
    describe('insuranceDeclarationChanged', () => {
      it('should emit an insurance declaration toggle action when changed', () => {
        component.insuranceDeclarationChanged();

        expect(store$.dispatch)
          .toHaveBeenCalledWith(ToggleInsuranceDeclaration());
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
        spyOn(modalController, 'create')
          .and
          .returnValue(Promise.resolve({
            present: async () => {
            },
            onWillDismiss: async () => {
            },
          } as any as HTMLIonModalElement));
        await component.showCandidateDataMissingError();
        expect(modalController.create)
          .toHaveBeenCalled();
      });
    });
    describe('ionViewDidEnter', () => {
      beforeEach(() => {
        spyOn(ScreenOrientation, 'lock')
          .and
          .returnValue(Promise.resolve());
      });
      it('should not enable single app mode if on ios and in practice mode', async () => {
        spyOn(BasePageComponent.prototype, 'isIos')
          .and
          .returnValue(true);
        component.isEndToEndPracticeMode = true;
        await component.ionViewDidEnter();
        expect(deviceProvider.enableSingleAppMode)
          .not
          .toHaveBeenCalled();
      });
      it('should enable single app mode if on ios and not in practice mode', async () => {
        spyOn(BasePageComponent.prototype, 'isIos')
          .and
          .returnValue(true);
        component.isEndToEndPracticeMode = false;
        await component.ionViewDidEnter();
        expect(deviceProvider.enableSingleAppMode)
          .toHaveBeenCalled();
      });
      it('should keep the device awake', async () => {
        spyOn(BasePageComponent.prototype, 'isIos')
          .and
          .returnValue(true);
        component.isEndToEndPracticeMode = false;
        await component.ionViewDidEnter();
        expect(insomnia.keepAwake)
          .toHaveBeenCalled();
      });

      it('should dispatch the action which calls out for candidate licence data', async () => {
        await component.ionViewDidEnter();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(GetCandidateLicenceData());
      });
    });
    describe('canDeActivate', () => {
      it('should return true if triggerLockScreen does not throw', async () => {
        spyOn(deviceAuthenticationProvider, 'triggerLockScreen')
          .and
          .returnValue(Promise.resolve());
        const resp = await component.canDeActivate();
        expect(resp)
          .toEqual(true);
      });
      it('should return false if triggerLockScreen does throw', async () => {
        spyOn(deviceAuthenticationProvider, 'triggerLockScreen')
          .and
          .rejectWith('err');
        const resp = await component.canDeActivate();
        expect(resp)
          .toEqual(false);
      });
    });
    describe('shouldNavigateToCandidateLicenceDetails', () => {
      it('should return true if rekey is false and test category is not ADI3 or SC', () => {
        component.isRekey = signal(false);
        component.testCategory = signal(TestCategory.B);
        expect(component['shouldNavigateToCandidateLicenceDetails']())
          .toEqual(true);
      });
      it('should return false if rekey is true and test category is not ADI3 or SC', () => {
        component.isRekey = signal(true);
        component.testCategory = signal(TestCategory.B);
        expect(component['shouldNavigateToCandidateLicenceDetails']())
          .toEqual(false);
      });
      [TestCategory.ADI3, TestCategory.SC].forEach((val) => {
        it(`should return false if rekey is false and test category is ${val}`, () => {
          component.isRekey = signal(false);
          component.testCategory = signal(val);
          expect(component['shouldNavigateToCandidateLicenceDetails']())
            .toEqual(false);
        });
      });
    });

    describe('cbtNumberChanged', () => {
      it('should dispatch SignatureDataChanged with parameter passed', () => {
        component.cbtNumberChanged('test');
        expect(store$.dispatch)
          .toHaveBeenCalledWith(CbtNumberChanged('test'));
      });
    });

    describe('signatureChanged', () => {
      it('should dispatch SignatureDataChanged with parameter passed', () => {
        component.signatureChanged('test');
        expect(store$.dispatch)
          .toHaveBeenCalledWith(preTestDeclarationsActions.SignatureDataChanged('test'));
      });
    });

    describe('signatureCleared', () => {
      it('should dispatch SignatureDataCleared', () => {
        component.signatureCleared();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(preTestDeclarationsActions.SignatureDataCleared());
      });
    });

    describe('onSubmit', () => {
      it('should navigate to the CandidateLicencePage if the form is valid', async () => {
        const { formGroup } = component;
        formGroup.addControl('insuranceCheckbox', new UntypedFormControl('', [Validators.requiredTrue]));
        formGroup.get('insuranceCheckbox')
          .setValue(true);
        await component.onSubmit();
        expect(router.navigate)
          .toHaveBeenCalledWith([TestFlowPageNames.CANDIDATE_LICENCE_PAGE]);
      });
      it('should dispatch the WaitingRoomValidationError action if a field is not valid', fakeAsync(() => {
        const { formGroup } = component;
        formGroup.addControl('insuranceCheckbox', new UntypedFormControl('', [Validators.requiredTrue]));
        formGroup.get('insuranceCheckbox')
          .setValue(false);
        component.onSubmit();
        tick();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(WaitingRoomValidationError('insuranceCheckbox is blank'));
      }));
    });

    describe('isJournalDataInvalid', () => {
      it('should return true if no examiner staffnumber', () => {
        const result = component.isJournalDataInvalid({
          examiner: {
            staffNumber: '',
          },
        } as JournalData);
        expect(result)
          .toEqual(true);
      });

      it('should return true if no candidate name & driver number', () => {
        const result = component.isJournalDataInvalid({
          examiner: { staffNumber: 'real-staff-number' },
          candidate: {
            candidateName: {},
            driverNumber: '',
          },
        } as JournalData);
        expect(result)
          .toEqual(true);
      });

      it('should return false if it has staff number and candidate name but no driver number', () => {
        const result = component.isJournalDataInvalid({
          examiner: { staffNumber: 'real-staff-number' },
          candidate: {
            candidateName: { title: 'Mr' },
            driverNumber: '',
          },
        } as JournalData);
        expect(result)
          .toEqual(false);
      });
    });
  });
});
