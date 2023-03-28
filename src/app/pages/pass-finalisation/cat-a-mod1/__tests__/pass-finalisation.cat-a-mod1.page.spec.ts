import {
  ComponentFixture, TestBed, waitForAsync, fakeAsync, tick,
} from '@angular/core/testing';
import {
  NavControllerMock,
  PlatformMock,
} from '@mocks/index.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { MockComponent } from 'ng-mocks';
import { Observable, Subscription } from 'rxjs';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { TransmissionComponent } from '@components/common/transmission/transmission';
import { FinalisationHeaderComponent } from '@components/test-finalisation/finalisation-header/finalisation-header';
import { LanguagePreferencesComponent } from '@components/test-finalisation/language-preference/language-preference';
import { DebriefWitnessedComponent } from '@components/test-finalisation/debrief-witnessed/debrief-witnessed';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import {
  LicenseProvidedComponent,
} from '@pages/pass-finalisation/components/license-provided/license-provided';
import {
  LicenceProvidedWarningBannerComponent,
} from '@pages/pass-finalisation/components/licence-provided-warning-banner/licence-provided-warning-banner';
import {
  NavController, Platform,
} from '@ionic/angular';
import { AppModule } from '@app/app.module';
import { D255Component } from '@components/test-finalisation/d255/d255';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { PersistTests } from '@store/tests/tests.actions';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import {
  PassFinalisationValidationError,
  PassFinalisationViewDidEnter,
} from '@pages/pass-finalisation/pass-finalisation.actions';
import {
  PASS_CERTIFICATE_NUMBER_CTRL,
} from '@pages/pass-finalisation/components/pass-certificate-number/pass-certificate-number.constants';
import {
  PassCertificateNumberCatAMod1Component,
} from '@pages/pass-finalisation/cat-a-mod1/components/pass-certificate-number/pass-certificate-number.cat-a-mod1';
import { BikeCategoryTypeComponent } from '@components/common/bike-category-type/bike-category-type';
import { PassFinalisationCatAMod1Page } from '../pass-finalisation.cat-a-mod1.page';

describe('PassFinalisationCatAMod1Page', () => {
  let fixture: ComponentFixture<PassFinalisationCatAMod1Page>;
  let component: PassFinalisationCatAMod1Page;
  let store$: Store<StoreModel>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        PassFinalisationCatAMod1Page,
        MockComponent(PracticeModeBanner),
        MockComponent(PassCertificateNumberCatAMod1Component),
        MockComponent(BikeCategoryTypeComponent),
        MockComponent(LicenseProvidedComponent),
        MockComponent(TransmissionComponent),
        MockComponent(D255Component),
        MockComponent(DebriefWitnessedComponent),
        MockComponent(FinalisationHeaderComponent),
        MockComponent(LanguagePreferencesComponent),
        MockComponent(WarningBannerComponent),
        MockComponent(LicenceProvidedWarningBannerComponent),
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        AppModule,
      ],
      providers: [
        { provide: Platform, useClass: PlatformMock },
        { provide: Router, useValue: routerSpy },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: NavController, useClass: NavControllerMock },
        OutcomeBehaviourMapProvider,
      ],
    });

    fixture = TestBed.createComponent(PassFinalisationCatAMod1Page);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
    component.subscription = new Subscription();
  }));

  describe('Class', () => {
    describe('ionViewDidLeave', () => {
      it('should unsubscribe from subscription if there is one', () => {
        component.subscription = new Subscription();
        spyOn(component.subscription, 'unsubscribe');
        component.ionViewDidLeave();
        expect(component.subscription.unsubscribe).toHaveBeenCalled();
      });
    });

    describe('ionViewWillEnter', () => {
      it('should dispatch PassFinalisationViewDidEnter', () => {
        component.merged$ = new Observable<string>();
        component.subscription.closed = true;
        spyOn(store$, 'dispatch');
        component.ionViewWillEnter();
        expect(store$.dispatch).toHaveBeenCalledWith(PassFinalisationViewDidEnter());
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
        expect(store$.dispatch)
          .toHaveBeenCalledWith(PassFinalisationValidationError(`${PASS_CERTIFICATE_NUMBER_CTRL} is invalid`));
        expect(store$.dispatch)
          .not
          .toHaveBeenCalledWith(PassFinalisationValidationError('notRequiredControl is blank'));
      }));
    });
  });

});
