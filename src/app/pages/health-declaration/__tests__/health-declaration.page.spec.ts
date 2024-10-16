import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flush, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppModule } from '@app/app.module';
import { default as welshTranslations } from '@assets/i18n/cy.json';
import { ComponentsModule } from '@components/common/common-components.module';
import { TestSlotAttributes } from '@dvsa/mes-test-schema/categories/common';
import { AlertController, NavController, NavParams, Platform } from '@ionic/angular';
import { AlertControllerMock, NavControllerMock, NavParamsMock, PlatformMock, RouterMock } from '@mocks/index.mock';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HealthDeclarationComponent } from '@pages/health-declaration/components/health-declaration/health-declaration';
import { ReceiptDeclarationComponent } from '@pages/health-declaration/components/receipt-declaration/receipt-declaration';
import {
  HealthDeclarationValidationError,
  HealthDeclarationViewDidEnter,
} from '@pages/health-declaration/health-declaration.actions';
import { HealthDeclarationPage } from '@pages/health-declaration/health-declaration.page';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DeviceAuthenticationProviderMock } from '@providers/device-authentication/__mocks__/device-authentication.mock';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';
import { configureI18N } from '@shared/helpers/translation.helpers';
import { StoreModel } from '@shared/models/store.model';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import * as PassCompletionActions from '@store/tests/pass-completion/pass-completion.actions';
import * as PostTestDeclarationsActions from '@store/tests/post-test-declarations/post-test-declarations.actions';
import { MockComponent } from 'ng-mocks';
import { Subscription, of } from 'rxjs';

describe('HealthDeclarationPage', () => {
  let fixture: ComponentFixture<HealthDeclarationPage>;
  let component: HealthDeclarationPage;
  let store$: Store<StoreModel>;
  let translate: TranslateService;
  let router: Router;

  const testSlotAttributes: TestSlotAttributes = {
    welshTest: false,
    extendedTest: false,
    slotId: 123,
    specialNeeds: false,
    start: '',
    vehicleTypeCode: '',
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        HealthDeclarationPage,
        MockComponent(HealthDeclarationComponent),
        MockComponent(ReceiptDeclarationComponent),
      ],
      imports: [
        ReactiveFormsModule,
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
        TranslateModule,
      ],
      providers: [
        {
          provide: NavController,
          useClass: NavControllerMock,
        },
        {
          provide: AlertController,
          useClass: AlertControllerMock,
        },
        {
          provide: NavParams,
          useClass: NavParamsMock,
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
          provide: DateTimeProvider,
          useClass: DateTimeProviderMock,
        },
        {
          provide: DeviceAuthenticationProvider,
          useClass: DeviceAuthenticationProviderMock,
        },
        {
          provide: Router,
          useClass: RouterMock,
        },
      ],
    });

    fixture = TestBed.createComponent(HealthDeclarationPage);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch').and.callThrough();
    translate = TestBed.inject(TranslateService);
    router = TestBed.inject(Router);
    translate.setDefaultLang('en');
    component.subscription = new Subscription();
  }));

  describe('Class', () => {
    describe('ionViewDidEnter', () => {
      it('should dispatch HealthDeclarationViewDidEnter', () => {
        component.ionViewDidEnter();
        expect(store$.dispatch).toHaveBeenCalledWith(HealthDeclarationViewDidEnter());
      });

      describe('healthDeclarationChanged', () => {
        it('should dispatch a ToggleHealthDeclaration action', () => {
          component.healthDeclarationChanged();
          expect(store$.dispatch).toHaveBeenCalledWith(PostTestDeclarationsActions.ToggleHealthDeclaration());
        });
      });
      describe('receiptDeclarationChanged', () => {
        it('should dispatch a ToggleReceiptDeclaration action', () => {
          component.receiptDeclarationChanged();
          expect(store$.dispatch).toHaveBeenCalledWith(PostTestDeclarationsActions.ToggleReceiptDeclaration());
        });
      });

      describe('persistAndNavigate', () => {
        it('should dispatch a ProvisionalLicenseNotReceived if passed true and licenseProvided is true', async () => {
          spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
          component.licenseProvided = true;
          await component.persistAndNavigate(true);
          expect(store$.dispatch).toHaveBeenCalledWith(PassCompletionActions.ProvisionalLicenseNotReceived());
        });
      });
    });
    describe('onSubmit', () => {
      it('should call the persist and navigate method if all fields set', fakeAsync(() => {
        spyOn(component, 'persistAndNavigate');
        const { formGroup } = component;
        fixture.detectChanges();
        component.pageState.healthDeclarationAccepted$ = of(true);
        component.pageState.receiptDeclarationAccepted$ = of(true);
        component.pageState.signature$ = of('sig');
        component.formGroup.controls['signature'].patchValue('heuhrheru');
        component.healthDeclarationAccepted = true;
        component.onSubmit();
        fixture.detectChanges();
        expect(formGroup.valid).toEqual(true);
        expect(component.persistAndNavigate).toHaveBeenCalled();
        flush();
      }));

      it('should show the confirmation modal if health checkbox not set', fakeAsync(() => {
        spyOn(component, 'showConfirmHealthDeclarationModal');
        const { formGroup } = component;
        fixture.detectChanges();
        component.pageState.healthDeclarationAccepted$ = of(false);
        component.pageState.receiptDeclarationAccepted$ = of(true);
        component.pageState.signature$ = of('sig');
        component.formGroup.controls['signature'].patchValue('heuhrheru');
        component.onSubmit();
        fixture.detectChanges();
        expect(formGroup.valid).toEqual(true);
        expect(component.showConfirmHealthDeclarationModal).toHaveBeenCalled();
        flush();
      }));

      it('should dispatch the appropriate ValidationError actions', fakeAsync(() => {
        component.formGroup = new UntypedFormGroup({
          requiredControl1: new UntypedFormControl(null, [Validators.required]),
          requiredControl2: new UntypedFormControl(null, [Validators.required]),
          notRequiredControl: new UntypedFormControl(null),
        });

        component.onSubmit();
        tick();
        expect(store$.dispatch).toHaveBeenCalledWith(HealthDeclarationValidationError('requiredControl1 is blank'));
        expect(store$.dispatch).toHaveBeenCalledWith(HealthDeclarationValidationError('requiredControl2 is blank'));
        expect(store$.dispatch).not.toHaveBeenCalledWith(
          HealthDeclarationValidationError('notRequiredControl is blank')
        );
      }));
    });
  });

  describe('ionViewDidLeave', () => {
    it('should unsubscribe from the subscription if there is one', () => {
      component.subscription = new Subscription();
      spyOn(component.subscription, 'unsubscribe');
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
      it('should render the page in Welsh for a Welsh test', (done) => {
        configureI18N(Language.CYMRAEG, translate);
        translate.onLangChange.subscribe(() => {
          fixture.detectChanges();
          const declarationIntent = fixture.debugElement.query(By.css('ion-text.des-header-style-4')).nativeElement;
          expect(declarationIntent.innerHTML).toBe(`${(<any>welshTranslations).healthDeclaration.declarationIntent}:`);
          done();
        });
      });
    });
  });
});
