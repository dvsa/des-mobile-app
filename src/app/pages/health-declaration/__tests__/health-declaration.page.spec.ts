import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SignatureAreaComponent } from '@components/common/signature-area/signature-area';
import { SignatureComponent } from '@components/common/signature/signature';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { default as welshTranslations } from '@assets/i18n/cy.json';
import { TestSlotAttributes } from '@dvsa/mes-test-schema/categories/common';
import { AlertController } from '@ionic/angular';
import { AlertControllerMock } from '@mocks/index.mock';
import { provideBasePageMocks } from '@mocks/test-providers';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { HealthDeclarationComponent } from '@pages/health-declaration/components/health-declaration/health-declaration';
import { ReceiptDeclarationComponent } from '@pages/health-declaration/components/receipt-declaration/receipt-declaration';
import {
  HealthDeclarationValidationError,
  HealthDeclarationViewDidEnter,
} from '@pages/health-declaration/health-declaration.actions';
import { HealthDeclarationPage } from '@pages/health-declaration/health-declaration.page';

import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DeviceAuthenticationProviderMock } from '@providers/device-authentication/__mocks__/device-authentication.mock';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';
import { StoreModel } from '@shared/models/store.model';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import * as PassCompletionActions from '@store/tests/pass-completion/pass-completion.actions';
import * as PostTestDeclarationsActions from '@store/tests/post-test-declarations/post-test-declarations.actions';
import { MockComponent } from 'ng-mocks';
import { Subscription, firstValueFrom, of } from 'rxjs';

describe('HealthDeclarationPage', () => {
  let fixture: ComponentFixture<HealthDeclarationPage>;
  let component: HealthDeclarationPage;
  let store$: Store<StoreModel>;
  let translate: TranslateService;
  let router: Router;

  interface WelshTranslations {
    healthDeclaration: {
      declarationIntent: string;
    };
  }

  const testSlotAttributes: TestSlotAttributes = {
    welshTest: false,
    extendedTest: false,
    slotId: 123,
    specialNeeds: false,
    start: '',
    vehicleTypeCode: '',
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        ReactiveFormsModule,

        StoreModule.forRoot({
          tests: () => ({
            currentTest: {
              slotId: '123',
            },
            testStatus: {},
            startedTests: {
              category: TestCategory.B,
              123: {
                communicationPreferences: { conductedLanguage: 'English' },
                passCompletion: {},
                postTestDeclarations: {
                  healthDeclarationAccepted: false,
                  passCertificateNumberReceived: false,
                  postTestSignature: '',
                },
                journalData: {
                  testSlotAttributes,
                  candidate: candidateMock,
                },
              },
            },
          }),
        }),
        HealthDeclarationPage,
        MockComponent(HealthDeclarationComponent),
        MockComponent(ReceiptDeclarationComponent),
      ],
      providers: [
        provideBasePageMocks(),
        {
          provide: AlertController,
          useClass: AlertControllerMock,
        },
        {
          provide: DateTimeProvider,
          useClass: DateTimeProviderMock,
        },
        {
          provide: DeviceAuthenticationProvider,
          useClass: DeviceAuthenticationProviderMock,
        },
      ],
    });

    TestBed.overrideComponent(SignatureComponent, {
      remove: { imports: [SignatureAreaComponent] },
      add: { imports: [MockComponent(SignatureAreaComponent)] },
    });
    fixture = TestBed.createComponent(HealthDeclarationPage);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    vi.spyOn(store$, 'dispatch');
    translate = TestBed.inject(TranslateService);
    router = TestBed.inject(Router);
    translate.setFallbackLang('en');
    component.subscription = new Subscription();
  });

  describe('Class', () => {
    describe('ionViewDidEnter', () => {
      it('should dispatch HealthDeclarationViewDidEnter', () => {
        component.ionViewDidEnter();
        expect(store$.dispatch).toHaveBeenCalledWith(HealthDeclarationViewDidEnter());
      });

      describe('healthDeclarationChanged', () => {
        it('should dispatch a ToggleHealthDeclaration action', () => {
          component.healthDeclarationChanged(true);
          expect(store$.dispatch).toHaveBeenCalledWith(PostTestDeclarationsActions.ToggleHealthDeclaration(true));
        });
      });
      describe('receiptDeclarationChanged', () => {
        it('should dispatch a ToggleReceiptDeclaration action', () => {
          component.receiptDeclarationChanged(true);
          expect(store$.dispatch).toHaveBeenCalledWith(PostTestDeclarationsActions.ToggleReceiptDeclaration(true));
        });
      });

      describe('persistAndNavigate', () => {
        it('should dispatch a ProvisionalLicenseNotReceived if passed true and licenseProvided is true', async () => {
          vi.spyOn(router, 'navigate').mockReturnValue(Promise.resolve(true));
          component.licenseProvided = true;
          await component.persistAndNavigate(true);
          expect(store$.dispatch).toHaveBeenCalledWith(PassCompletionActions.ProvisionalLicenseNotReceived());
        });
      });
    });
    describe('onSubmit', () => {
      it('should call the persist and navigate method if all fields set', async () => {
        vi.useFakeTimers();
        try {
          vi.spyOn(component, 'persistAndNavigate').mockReturnValue(undefined);
          const { formGroup } = component;
          fixture.detectChanges();
          component.pageState.healthDeclarationAccepted$ = of(true);
          component.pageState.receiptDeclarationAccepted$ = of(true);
          component.pageState.signature$ = of('sig');
          component.formGroup.controls.signature.patchValue('heuhrheru');
          component.healthDeclarationAccepted = true;
          component.onSubmit();
          fixture.detectChanges();
          expect(formGroup.valid).toEqual(true);
          expect(component.persistAndNavigate).toHaveBeenCalled();
          await vi.runOnlyPendingTimersAsync();
        } finally {
          vi.useRealTimers();
        }
      });

      it('should show the confirmation modal if health checkbox not set', async () => {
        vi.useFakeTimers();
        try {
          vi.spyOn(component, 'showConfirmHealthDeclarationModal').mockReturnValue(undefined);
          const { formGroup } = component;
          fixture.detectChanges();
          component.pageState.healthDeclarationAccepted$ = of(false);
          component.pageState.receiptDeclarationAccepted$ = of(true);
          component.pageState.signature$ = of('sig');
          component.formGroup.controls.signature.patchValue('heuhrheru');
          component.onSubmit();
          fixture.detectChanges();
          expect(formGroup.valid).toEqual(true);
          expect(component.showConfirmHealthDeclarationModal).toHaveBeenCalled();
          await vi.runOnlyPendingTimersAsync();
        } finally {
          vi.useRealTimers();
        }
      });

      it('should dispatch the appropriate ValidationError actions', async () => {
        vi.useFakeTimers();
        try {
          component.formGroup = new UntypedFormGroup({
            requiredControl1: new UntypedFormControl(null, [Validators.required]),
            requiredControl2: new UntypedFormControl(null, [Validators.required]),
            notRequiredControl: new UntypedFormControl(null),
          });

          component.onSubmit();
          await vi.advanceTimersByTimeAsync(0);
          expect(store$.dispatch).toHaveBeenCalledWith(HealthDeclarationValidationError('requiredControl1 is blank'));
          expect(store$.dispatch).toHaveBeenCalledWith(HealthDeclarationValidationError('requiredControl2 is blank'));
          expect(store$.dispatch).not.toHaveBeenCalledWith(
            HealthDeclarationValidationError('notRequiredControl is blank')
          );
        } finally {
          vi.useRealTimers();
        }
      });
    });
  });

  describe('ionViewDidLeave', () => {
    it('should unsubscribe from the subscription if there is one', () => {
      component.subscription = new Subscription();
      vi.spyOn(component.subscription, 'unsubscribe').mockReturnValue(undefined);
      component.ionViewDidLeave();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('DOM', () => {
    describe('multi language support', () => {
      it('should render the page in English by default', () => {
        fixture.detectChanges();
        const declarationIntent = fixture.debugElement.query(By.css('ion-text.des-header-style-4')).nativeElement;
        expect(declarationIntent.innerHTML).toBe('I declare that:');
      });
      it('should render the page in Welsh for a Welsh test', async () => {
        fixture.detectChanges();
        await firstValueFrom(translate.use('cy'));
        fixture.detectChanges();
        const declarationIntent = fixture.debugElement.query(By.css('ion-text.des-header-style-4')).nativeElement;
        expect(declarationIntent.innerHTML).toBe(`${welshTranslations.healthDeclaration.declarationIntent}:`);
      });
    });
  });
});
