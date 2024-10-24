import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AppModule } from '@app/app.module';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { D255Component } from '@components/test-finalisation/d255/d255';
import { DebriefWitnessedComponent } from '@components/test-finalisation/debrief-witnessed/debrief-witnessed';
import { FinalisationHeaderComponent } from '@components/test-finalisation/finalisation-header/finalisation-header';
import { LanguagePreferencesComponent } from '@components/test-finalisation/language-preference/language-preference';
import { NavController, Platform } from '@ionic/angular';
import { NavControllerMock, PlatformMock, RouterMock } from '@mocks/index.mock';
import { Store } from '@ngrx/store';
import { PassFinalisationCatManoeuvrePage } from '@pages/pass-finalisation/cat-manoeuvre/pass-finalisation.cat-manoeuvre.page';
import { LicenceProvidedWarningBannerComponent } from '@pages/pass-finalisation/components/licence-provided-warning-banner/licence-provided-warning-banner';
import { LicenseProvidedComponent } from '@pages/pass-finalisation/components/license-provided/license-provided';
import { PassCertificateNumberComponent } from '@pages/pass-finalisation/components/pass-certificate-number/pass-certificate-number';
import { PASS_CERTIFICATE_NUMBER_CTRL } from '@pages/pass-finalisation/components/pass-certificate-number/pass-certificate-number.constants';
import { PassFinalisationValidationError } from '@pages/pass-finalisation/pass-finalisation.actions';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { StoreModel } from '@shared/models/store.model';
import { PersistTests } from '@store/tests/tests.actions';
import { MockComponent } from 'ng-mocks';

describe('PassFinalisationCatManoeuvrePage', () => {
  let fixture: ComponentFixture<PassFinalisationCatManoeuvrePage>;
  let component: PassFinalisationCatManoeuvrePage;
  let store$: Store<StoreModel>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        PassFinalisationCatManoeuvrePage,
        MockComponent(PracticeModeBanner),
        MockComponent(PassCertificateNumberComponent),
        MockComponent(LicenseProvidedComponent),
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
        OutcomeBehaviourMapProvider,
      ],
    });

    fixture = TestBed.createComponent(PassFinalisationCatManoeuvrePage);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
  }));

  describe('Class', () => {
    describe('onSubmit', () => {
      it('should dispatch the PersistTests action', () => {
        component.onSubmit();
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
});
