import {
  ComponentFixture, waitForAsync, TestBed, fakeAsync, tick,
} from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { PlatformMock } from '@mocks/index.mock';

import { AppModule } from 'src/app/app.module';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import {
  initialState as preTestDeclarationInitialState,
} from '@store/tests/pre-test-declarations/pre-test-declarations.reducer';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';
import {
  DeviceAuthenticationProviderMock,
} from '@providers/device-authentication/__mocks__/device-authentication.mock';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { MockComponent } from 'ng-mocks';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { EndTestLinkComponent } from '@components/common/end-test-link/end-test-link';
import { LockScreenIndicator } from '@components/common/screen-lock-indicator/lock-screen-indicator';
import { CandidateSectionComponent } from '@components/common/candidate-section/candidate-section';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommunicationPage } from '@pages/communication/communication.page';
import { CommunicationSubmitInfo, CommunicationViewDidEnter } from '@pages/communication/communication.actions';
import * as communicationPreferencesActions
  from '@store/tests/communication-preferences/communication-preferences.actions';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ValidPassCertChanged } from '@store/tests/pre-test-declarations/pre-test-declarations.actions';

describe('CommunicationPage', () => {
  let fixture: ComponentFixture<CommunicationPage>;
  let component: CommunicationPage;
  let store$: Store<StoreModel>;
  let translate: TranslateService;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        CommunicationPage,
        MockComponent(PracticeModeBanner),
        MockComponent(EndTestLinkComponent),
        MockComponent(LockScreenIndicator),
        MockComponent(CandidateSectionComponent),
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        AppModule,
        TranslateModule,
        ReactiveFormsModule,
        StoreModule.forFeature('tests', () => ({
          currentTest: {
            slotId: '123',
          },
          testStatus: {},
          startedTests: {
            123: {
              category: TestCategory.B,
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
                conductedLanguage: 'English',
              },
            },
          },
        })),
      ],
      providers: [
        { provide: Platform, useClass: PlatformMock },
        { provide: Router, useValue: routerSpy },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: DeviceAuthenticationProvider, useClass: DeviceAuthenticationProviderMock },
        { provide: DeviceProvider, useClass: DeviceProviderMock },
      ],
    });

    fixture = TestBed.createComponent(CommunicationPage);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
    component.subscription = new Subscription();
  }));

  describe('Class', () => {
    it('should create component', () => {
      expect(component)
        .toBeTruthy();
    });

    describe('Submit', () => {
      it('should dispatch the SubmitCommunicationInfo action', fakeAsync(() => {
        const { form } = component;
        form.get('radioCtrl')
          .setValue(true);
        component.onSubmit();
        tick();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(CommunicationSubmitInfo());
      }));
      it('form should only be valid whenever all form controls are initialised', () => {
        const { form } = component;
        form.get('radioCtrl')
          .setValue(true);
        expect(form.get('radioCtrl').status)
          .toEqual('VALID');
        expect(form.valid)
          .toEqual(true);
      });
    });

    describe('dispatchCandidateChoseProvidedEmail', () => {
      it('should dispatch a CandidateChoseEmailAsCommunicationPreference action', () => {
        component.candidateProvidedEmail = candidateMock.emailAddress;
        component.dispatchCandidateChoseProvidedEmail();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(communicationPreferencesActions.CandidateChoseEmailAsCommunicationPreference(
            candidateMock.emailAddress, CommunicationPage.email,
          ));
      });
    });

    describe('dispatchCandidateChoseNewEmail', () => {
      it('should dispatch a CandidateChoseEmailAsCommunicationPreference action', () => {
        spyOn(component, 'isNewEmailSelected').and.returnValue(true);
        component.dispatchCandidateChoseNewEmail(candidateMock.emailAddress);
        expect(store$.dispatch)
          .toHaveBeenCalledWith(communicationPreferencesActions.CandidateChoseEmailAsCommunicationPreference(
            candidateMock.emailAddress, CommunicationPage.email,
          ));
      });
    });

    describe('dispatchCandidateChosePost', () => {
      it('should dispatch a CandidateChosePostAsCommunicationPreference action', () => {
        component.dispatchCandidateChosePost();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(communicationPreferencesActions.CandidateChosePostAsCommunicationPreference(
            CommunicationPage.post,
          ));
      });
    });

    describe('setCommunicationType', () => {
      it('should set setCommunicationType', () => {
        component.setCommunicationType(CommunicationPage.email, CommunicationPage.providedEmail);
        expect(component.communicationType)
          .toEqual(CommunicationPage.email);
        expect(component.emailType)
          .toEqual(CommunicationPage.providedEmail);
      });
    });

    describe('isProvidedEmailSelected', () => {
      it('should return true for isProvidedEmailSelected() if appropriate properties are defined', () => {
        component.communicationType = CommunicationPage.email;
        component.emailType = CommunicationPage.providedEmail;
        const returnValue = component.isProvidedEmailSelected();
        expect(returnValue)
          .toBe(true);
      });

      it('should return false for isProvidedEmailSelected() if appropriate properties are not defined', () => {
        component.communicationType = 'Post';
        component.emailType = null;
        const returnValue = component.isProvidedEmailSelected();
        expect(returnValue)
          .toBe(false);
      });
    });

    describe('isNewEmailSelected', () => {
      it('should return true for isNewEmailSelected() if appropriate properties are defined', () => {
        component.communicationType = CommunicationPage.email;
        component.emailType = CommunicationPage.updatedEmail;
        const returnValue = component.isNewEmailSelected();
        expect(returnValue)
          .toBe(true);
      });

      it('should return false for isNewEmailSelected() if appropriate properties are not defined', () => {
        component.communicationType = 'Post';
        component.emailType = null;
        const returnValue = component.isNewEmailSelected();
        expect(returnValue)
          .toBe(false);
      });
    });
  });

  describe('validCertificateChanged', () => {
    it('should dispatch ValidPassCertChanged with passed value', () => {
      spyOn(component.store$, 'dispatch');
      component.validCertificateChanged(true);
      expect(component.store$.dispatch).toHaveBeenCalledWith(ValidPassCertChanged(true));
    });
  });

  describe('ionViewDidEnter', () => {
    it('should dispatch an action', () => {
      component.ionViewDidEnter();
      expect(store$.dispatch).toHaveBeenCalledWith(CommunicationViewDidEnter());
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

  describe('shouldPreselectADefaultValue', () => {
    it('should return true if communicationType is equal to CommunicationPage.notProvided', () => {
      component.communicationType = CommunicationPage.notProvided;
      expect(component.shouldPreselectADefaultValue()).toEqual(true);
    });
    it('should return false if communicationType '
        + 'is not equal to CommunicationPage.notProvided', () => {
      component.communicationType = CommunicationPage.email;
      expect(component.shouldPreselectADefaultValue()).toEqual(false);
    });
  });

  describe('restoreRadioValidators', () => {
    it('should set radioCtrl to true', () => {
      component.restoreRadioValidators();
      expect(component.form.controls['radioCtrl'].value).toEqual(true);
    });
  });

  describe('initialiseDefaultSelections', () => {
    it('should set communicationType to CommunicationPage.email', () => {
      component.initialiseDefaultSelections();
      expect(component.communicationType).toEqual(CommunicationPage.email);
    });
    it('should set emailType to CommunicationPage.providedEmail '
        + 'if candidateProvidedEmail is present', () => {
      component.candidateProvidedEmail = 'test';
      component.initialiseDefaultSelections();

      expect(component.emailType).toEqual(CommunicationPage.providedEmail);
    });
    it('should set radioCtrl to true if candidateProvidedEmail is present', () => {
      component.candidateProvidedEmail = 'test';
      component.initialiseDefaultSelections();

      expect(component.form.controls['radioCtrl'].value).toEqual(true);
    });
    it('should call dispatchCandidateChoseProvidedEmail if candidateProvidedEmail is present', () => {
      component.candidateProvidedEmail = 'test';
      spyOn(component, 'dispatchCandidateChoseProvidedEmail');

      component.initialiseDefaultSelections();

      expect(component.dispatchCandidateChoseProvidedEmail).toHaveBeenCalled();
    });
  });

  describe('assertEmailType', () => {
    it('should set emailType to CommunicationPage.providedEmail if communicationEmail'
        + 'is equal to candidateProvidedEmail and candidateProvidedEmail is not blank', () => {
      component.candidateProvidedEmail = 'test';
      component.communicationEmail = 'test';
      component.assertEmailType();
      expect(component.emailType).toEqual(CommunicationPage.providedEmail);
    });
    it('should set emailType to CommunicationPage.updatedEmail if communicationEmail'
        + 'is not equal to candidateProvidedEmail', () => {
      component.candidateProvidedEmail = 'test1';
      component.communicationEmail = 'test';
      component.assertEmailType();
      expect(component.emailType).toEqual(CommunicationPage.updatedEmail);
    });
  });

  describe('conditionalDispatchCandidateChoseNewEmail', () => {
    it('should call dispatchCandidateChoseNewEmail if isNewEmailSelected is true and '
        + 'communicationEmail is not empty', () => {
      spyOn(component, 'isNewEmailSelected').and.returnValue(true);
      spyOn(component, 'dispatchCandidateChoseNewEmail');
      component.conditionalDispatchCandidateChoseNewEmail();
      expect(component.dispatchCandidateChoseNewEmail).toHaveBeenCalled();
    });
  });

  describe('restoreRadiosFromState', () => {
    it('should call assertEmailType if communicationType is equal to CommunicationPage.email', () => {
      spyOn(component, 'assertEmailType');
      component.communicationType = CommunicationPage.email;
      component.restoreRadiosFromState();
      expect(component.assertEmailType).toHaveBeenCalled();
    });
    it('should not call assertEmailType if communicationType '
        + 'is not equal to CommunicationPage.email', () => {
      spyOn(component, 'assertEmailType');
      component.communicationType = CommunicationPage.notProvided;
      component.restoreRadiosFromState();
      expect(component.assertEmailType).not.toHaveBeenCalled();
    });
  });

  describe('DOM', () => {
    describe('i18n', () => {
      it('should render the page in English by default', () => {
        fixture.detectChanges();
        const { debugElement } = fixture;
        expect(debugElement.query(By.css('ion-text.des-header-style-4')).nativeElement.innerHTML)
          .toBe('Select how to receive the test results');
      });
    });
  });
});
