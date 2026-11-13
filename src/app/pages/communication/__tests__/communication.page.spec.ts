import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CandidateSectionComponent } from '@components/common/candidate-section/candidate-section';
import { EndTestLinkComponent } from '@components/common/end-test-link/end-test-link';
import { PracticeModeOptionsBar } from '@components/common/practice-mode-options-bar/practice-mode-options-bar';
import { LockScreenIndicator } from '@components/common/screen-lock-indicator/lock-screen-indicator';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideBasePageMocks } from '@mocks/test-providers';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { CommunicationSubmitInfo, CommunicationViewDidEnter } from '@pages/communication/communication.actions';
import { CommunicationPage } from '@pages/communication/communication.page';

import { DeviceAuthenticationProviderMock } from '@providers/device-authentication/__mocks__/device-authentication.mock';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';

import { StoreModel } from '@shared/models/store.model';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import * as communicationPreferencesActions from '@store/tests/communication-preferences/communication-preferences.actions';
import { ValidPassCertChanged } from '@store/tests/pre-test-declarations/pre-test-declarations.actions';
import { initialState as preTestDeclarationInitialState } from '@store/tests/pre-test-declarations/pre-test-declarations.reducer';
import { MockComponent } from 'ng-mocks';
import { Subscription } from 'rxjs';

describe('CommunicationPage', () => {
  let fixture: ComponentFixture<CommunicationPage>;
  let component: CommunicationPage;
  let store$: Store<StoreModel>;
  let translate: TranslateService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterModule.forRoot([]),

        ReactiveFormsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature('tests', () => ({
          currentTest: {
            slotId: '123',
          },
          testStatus: {},
          startedTests: {
            123: {
              rekey: {},
              delegatedTest: false,
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
                updatedEmail: 'test@mail.com',
                communicationMethod: 'Email',
                conductedLanguage: 'English',
              },
            },
          },
        })),
        CommunicationPage,
        MockComponent(PracticeModeOptionsBar),
        MockComponent(EndTestLinkComponent),
        MockComponent(LockScreenIndicator),
        MockComponent(CandidateSectionComponent),
      ],
      providers: [
        provideBasePageMocks(),
        {
          provide: DeviceAuthenticationProvider,
          useClass: DeviceAuthenticationProviderMock,
        },
      ],
    });

    fixture = TestBed.createComponent(CommunicationPage);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    translate.setFallbackLang('en');
    store$ = TestBed.inject(Store);
    vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
    component.subscription = new Subscription();
  });

  describe('Class', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    describe('Submit', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should dispatch the SubmitCommunicationInfo action', async () => {
        vi.useFakeTimers();
        try {
          const { form } = component;
          form.get('radioCtrl').setValue(true);
          form.get('newEmailCtrl').setValue('test@mail.com');
          component.onSubmit();
          await vi.advanceTimersByTimeAsync(0);
          expect(store$.dispatch).toHaveBeenCalledWith(CommunicationSubmitInfo());
        } finally {
          vi.useRealTimers();
        }
      });
      it('form should only be valid whenever all form controls are initialised', () => {
        const { form } = component;
        form.get('radioCtrl').setValue(true);
        form.get('newEmailCtrl').setValue('test@mail.com');
        expect(form.get('radioCtrl').status).toEqual('VALID');
        expect(form.valid).toEqual(true);
      });
    });

    describe('dispatchCandidateChoseProvidedEmail', () => {
      it('should dispatch a CandidateChoseEmailAsCommunicationPreference action', () => {
        component.candidateProvidedEmail = candidateMock.emailAddress;
        component.dispatchCandidateChoseProvidedEmail();
        expect(store$.dispatch).toHaveBeenCalledWith(
          communicationPreferencesActions.CandidateChoseEmailAsCommunicationPreference(
            candidateMock.emailAddress,
            CommunicationPage.email
          )
        );
      });
    });

    describe('dispatchCandidateChoseNewEmail', () => {
      it('should dispatch a CandidateChoseEmailAsCommunicationPreference action', () => {
        vi.spyOn(component, 'isNewEmailSelected').mockReturnValue(true);
        component.dispatchCandidateChoseNewEmail(candidateMock.emailAddress);
        expect(store$.dispatch).toHaveBeenCalledWith(
          communicationPreferencesActions.CandidateChoseEmailAsCommunicationPreference(
            candidateMock.emailAddress,
            CommunicationPage.email
          )
        );
      });
    });

    describe('dispatchCandidateChosePost', () => {
      it('should dispatch a CandidateChosePostAsCommunicationPreference action', () => {
        component.dispatchCandidateChosePost();
        expect(store$.dispatch).toHaveBeenCalledWith(
          communicationPreferencesActions.CandidateChosePostAsCommunicationPreference(CommunicationPage.post)
        );
      });
    });

    describe('setCommunicationType', () => {
      it('should set setCommunicationType', () => {
        component.setCommunicationType(CommunicationPage.email, CommunicationPage.providedEmail);
        expect(component.communicationType).toEqual(CommunicationPage.email);
        expect(component.emailType).toEqual(CommunicationPage.providedEmail);
      });
    });

    describe('isProvidedEmailSelected', () => {
      it('should return true for isProvidedEmailSelected() if appropriate properties are defined', () => {
        component.communicationType = CommunicationPage.email;
        component.emailType = CommunicationPage.providedEmail;
        const returnValue = component.isProvidedEmailSelected();
        expect(returnValue).toBe(true);
      });

      it('should return false for isProvidedEmailSelected() if appropriate properties are not defined', () => {
        component.communicationType = 'Post';
        component.emailType = null;
        const returnValue = component.isProvidedEmailSelected();
        expect(returnValue).toBe(false);
      });
    });

    describe('isNewEmailSelected', () => {
      it('should return true for isNewEmailSelected() if appropriate properties are defined', () => {
        component.communicationType = CommunicationPage.email;
        component.emailType = CommunicationPage.updatedEmail;
        const returnValue = component.isNewEmailSelected();
        expect(returnValue).toBe(true);
      });

      it('should return false for isNewEmailSelected() if appropriate properties are not defined', () => {
        component.communicationType = 'Post';
        component.emailType = null;
        const returnValue = component.isNewEmailSelected();
        expect(returnValue).toBe(false);
      });
    });
  });

  describe('validCertificateChanged', () => {
    it('should dispatch ValidPassCertChanged with passed value', () => {
      vi.spyOn(component.store$, 'dispatch').mockReturnValue(undefined);
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
      vi.spyOn(component.subscription, 'unsubscribe').mockReturnValue(undefined);
      component.ionViewDidLeave();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('shouldPreselectADefaultValue', () => {
    it('should return true if communicationType is equal to CommunicationPage.notProvided', () => {
      component.communicationType = CommunicationPage.notProvided;
      expect(component.shouldPreselectADefaultValue()).toEqual(true);
    });
    it('should return false if communicationType ' + 'is not equal to CommunicationPage.notProvided', () => {
      component.communicationType = CommunicationPage.email;
      expect(component.shouldPreselectADefaultValue()).toEqual(false);
    });
  });

  describe('restoreRadioValidators', () => {
    it('should set radioCtrl to true', () => {
      component.restoreRadioValidators();
      expect(component.form.controls.radioCtrl.value).toEqual(true);
    });
  });

  describe('initialiseDefaultSelections', () => {
    it('should set communicationType to CommunicationPage.email', () => {
      component.initialiseDefaultSelections();
      expect(component.communicationType).toEqual(CommunicationPage.email);
    });
    it('should set emailType to CommunicationPage.providedEmail ' + 'if candidateProvidedEmail is present', () => {
      component.candidateProvidedEmail = 'test';
      component.initialiseDefaultSelections();

      expect(component.emailType).toEqual(CommunicationPage.providedEmail);
    });
    it('should set radioCtrl to true if candidateProvidedEmail is present', () => {
      component.candidateProvidedEmail = 'test';
      component.initialiseDefaultSelections();

      expect(component.form.controls.radioCtrl.value).toEqual(true);
    });
    it('should call dispatchCandidateChoseProvidedEmail if candidateProvidedEmail is present', () => {
      component.candidateProvidedEmail = 'test';
      vi.spyOn(component, 'dispatchCandidateChoseProvidedEmail').mockReturnValue(undefined);

      component.initialiseDefaultSelections();

      expect(component.dispatchCandidateChoseProvidedEmail).toHaveBeenCalled();
    });
  });

  describe('assertEmailType', () => {
    it(
      'should set emailType to CommunicationPage.providedEmail if communicationEmail' +
        'is equal to candidateProvidedEmail and candidateProvidedEmail is not blank',
      () => {
        component.candidateProvidedEmail = 'test';
        component.communicationEmail = 'test';
        component.assertEmailType();
        expect(component.emailType).toEqual(CommunicationPage.providedEmail);
      }
    );
    it(
      'should set emailType to CommunicationPage.updatedEmail if communicationEmail' +
        'is not equal to candidateProvidedEmail',
      () => {
        component.candidateProvidedEmail = 'test1';
        component.communicationEmail = 'test';
        component.assertEmailType();
        expect(component.emailType).toEqual(CommunicationPage.updatedEmail);
      }
    );
  });

  describe('conditionalDispatchCandidateChoseNewEmail', () => {
    it(
      'should call dispatchCandidateChoseNewEmail if isNewEmailSelected is true and ' +
        'communicationEmail is not empty',
      () => {
        vi.spyOn(component, 'isNewEmailSelected').mockReturnValue(true);
        vi.spyOn(component, 'dispatchCandidateChoseNewEmail').mockReturnValue(undefined);
        component.communicationEmail = 'test@mail.com';
        component.conditionalDispatchCandidateChoseNewEmail();
        expect(component.dispatchCandidateChoseNewEmail).toHaveBeenCalled();
      }
    );
  });

  describe('restoreRadiosFromState', () => {
    it('should call assertEmailType if communicationType is equal to CommunicationPage.email', () => {
      vi.spyOn(component, 'assertEmailType').mockReturnValue(undefined);
      component.communicationType = CommunicationPage.email;
      component.restoreRadiosFromState();
      expect(component.assertEmailType).toHaveBeenCalled();
    });
    it('should not call assertEmailType if communicationType ' + 'is not equal to CommunicationPage.email', () => {
      vi.spyOn(component, 'assertEmailType').mockReturnValue(undefined);
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
        expect(debugElement.query(By.css('ion-text.des-header-style-4')).nativeElement.innerHTML).toBe(
          'Select how to receive the test results'
        );
      });
    });
  });
});
