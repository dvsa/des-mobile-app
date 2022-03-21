import {
  ComponentFixture, waitForAsync, TestBed, fakeAsync, tick,
} from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { PlatformMock } from 'ionic-mocks';

import { AppModule } from 'src/app/app.module';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import {
  ToggleResidencyDeclaration,
  ToggleInsuranceDeclaration,
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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import * as communicationPreferenceActions
  from '@store/tests/communication-preferences/communication-preferences.actions';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { ScreenOrientationMock } from '@shared/mocks/screen-orientation.mock';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { InsomniaMock } from '@shared/mocks/insomnia.mock';
import { MockComponent } from 'ng-mocks';
import * as preTestDeclarationsActions
  from '@store/tests/pre-test-declarations/pre-test-declarations.actions';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { EndTestLinkComponent } from '@components/common/end-test-link/end-test-link';
import { LockScreenIndicator } from '@components/common/screen-lock-indicator/lock-screen-indicator';
import { CandidateSectionComponent } from '@components/common/candidate-section/candidate-section';
import { FormControl, Validators } from '@angular/forms';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { JournalData } from '@dvsa/mes-test-schema/categories/common';
import { AppComponent } from 'src/app/app.component';
import { MockAppComponent } from 'src/app/__mocks__/app.component.mock';
import { configureTestSuite } from 'ng-bullet';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BasePageComponent } from '@shared/classes/base-page';
import { SignatureComponent } from '@components/common/signature/signature';
import { ResidencyDeclarationComponent } from '../components/residency-declaration/residency-declaration';
import { InsuranceDeclarationComponent } from '../components/insurance-declaration/insurance-declaration';
import { ConductedLanguageComponent } from '../components/conducted-language/conducted-language';
import { WaitingRoomValidationError } from '../waiting-room.actions';
import { WaitingRoomPage } from '../waiting-room.page';
import { ManoeuvresPassCertificateComponent } from '../components/manoeuvres-pass-cert/manoeuvres-pass-cert';

describe('WaitingRoomPage', () => {
  let fixture: ComponentFixture<WaitingRoomPage>;
  let component: WaitingRoomPage;
  let store$: Store<StoreModel>;
  let deviceProvider: DeviceProvider;
  let deviceAuthenticationProvider: DeviceAuthenticationProvider;
  let screenOrientation: ScreenOrientation;
  let insomnia: Insomnia;
  let translate: TranslateService;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

  configureTestSuite(() => {
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
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: DeviceAuthenticationProvider, useClass: DeviceAuthenticationProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: DeviceProvider, useClass: DeviceProviderMock },
        { provide: ScreenOrientation, useClass: ScreenOrientationMock },
        { provide: Insomnia, useClass: InsomniaMock },
        { provide: AppComponent, useClass: MockAppComponent },
      ],
    });

  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(WaitingRoomPage);
    component = fixture.componentInstance;
    deviceProvider = TestBed.inject(DeviceProvider);
    screenOrientation = TestBed.inject(ScreenOrientation);
    insomnia = TestBed.inject(Insomnia);
    deviceAuthenticationProvider = TestBed.inject(DeviceAuthenticationProvider);
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    store$ = TestBed.inject(Store);
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

    });

    describe('canDeActivate', () => {
      it('should call through to triggerLockScreen', async () => {
        await component.canDeActivate();
        expect(deviceAuthenticationProvider.triggerLockScreen).toHaveBeenCalled();
      });
    });

    describe('onSubmit', () => {
      it('should navigate to the COMMUNICATION_PAGE if the form is valid', () => {
        const { formGroup } = component;
        formGroup.addControl('insuranceCheckbox', new FormControl('', [Validators.requiredTrue]));
        formGroup.get('insuranceCheckbox').setValue(true);
        component.onSubmit();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['CommunicationPage']);
      });
      it('should dispatch the WaitingRoomValidationError action if a field is not valid', fakeAsync(() => {
        const { formGroup } = component;
        formGroup.addControl('insuranceCheckbox', new FormControl('', [Validators.requiredTrue]));
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
