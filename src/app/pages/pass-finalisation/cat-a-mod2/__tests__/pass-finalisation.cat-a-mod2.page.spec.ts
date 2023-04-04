import {
  waitForAsync, ComponentFixture, TestBed, fakeAsync, tick,
} from '@angular/core/testing';
import { NavController, Platform } from '@ionic/angular';

import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MockComponent } from 'ng-mocks';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import {
  PassCertificateNumberCatAMod1Component,
} from '@pages/pass-finalisation/cat-a-mod1/components/pass-certificate-number/pass-certificate-number.cat-a-mod1';
import { BikeCategoryTypeComponent } from '@components/common/bike-category-type/bike-category-type';
import { LicenseProvidedComponent } from '@pages/pass-finalisation/components/license-provided/license-provided';
import { TransmissionComponent } from '@components/common/transmission/transmission';
import { D255Component } from '@components/test-finalisation/d255/d255';
import { DebriefWitnessedComponent } from '@components/test-finalisation/debrief-witnessed/debrief-witnessed';
import { FinalisationHeaderComponent } from '@components/test-finalisation/finalisation-header/finalisation-header';
import { LanguagePreferencesComponent } from '@components/test-finalisation/language-preference/language-preference';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import {
  LicenceProvidedWarningBannerComponent,
} from '@pages/pass-finalisation/components/licence-provided-warning-banner/licence-provided-warning-banner';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '@app/app.module';
import { NavControllerMock, PlatformMock } from '@mocks/index.mock';
import { Router } from '@angular/router';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { Subscription } from 'rxjs';
import { PersistTests } from '@store/tests/tests.actions';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {
  PASS_CERTIFICATE_NUMBER_CTRL,
} from '@pages/pass-finalisation/components/pass-certificate-number/pass-certificate-number.constants';
import {
  PassFinalisationValidationError,
  PassFinalisationViewDidEnter,
} from '@pages/pass-finalisation/pass-finalisation.actions';
import {
  PassFinalisationPageComponent,
} from '@shared/classes/test-flow-base-pages/pass-finalisation/pass-finalisation-base-page';
import { TransmissionType } from '@shared/models/transmission-type';
import { PassFinalisationCatAMod2Page } from '../pass-finalisation.cat-a-mod2.page';

describe('PassFinalisationCatAMod2Page', () => {
  let fixture: ComponentFixture<PassFinalisationCatAMod2Page>;
  let component: PassFinalisationCatAMod2Page;
  let store$: Store<StoreModel>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        PassFinalisationCatAMod2Page,
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

    fixture = TestBed.createComponent(PassFinalisationCatAMod2Page);
    component = fixture.componentInstance;
    component.subscription = new Subscription();
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
  }));

  describe('Class', () => {
    describe('ionViewWillEnter', () => {
      it('should dispatch the VIEW_DID_ENTER action when the function is run', () => {
        spyOn(PassFinalisationPageComponent.prototype, 'ionViewWillEnter');
        component.ionViewWillEnter();
        expect(store$.dispatch).toHaveBeenCalledWith(PassFinalisationViewDidEnter());
        expect(store$.dispatch).toHaveBeenCalledTimes(1);
      });
    });

    describe('onSubmit', () => {
      // Unit tests for the components TypeScript class
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
        expect(store$.dispatch)
          .toHaveBeenCalledWith(PassFinalisationValidationError('requiredControl1 is blank'));
        expect(store$.dispatch)
          .toHaveBeenCalledWith(PassFinalisationValidationError('requiredControl2 is blank'));
        expect(store$.dispatch)
          .toHaveBeenCalledWith(PassFinalisationValidationError(`${PASS_CERTIFICATE_NUMBER_CTRL} is invalid`));
        expect(store$.dispatch)
          .not
          .toHaveBeenCalledWith(PassFinalisationValidationError('notRequiredControl is blank'));
      }));
    });

    describe('ionViewDidLeave', () => {
      it('should unsubscribe when subscription', () => {
        component.subscription = new Subscription();
        spyOn(component.subscription, 'unsubscribe');
        component.ionViewDidLeave();
        expect(component.subscription.unsubscribe).toHaveBeenCalled();
      });
    });

    describe('displayTransmissionBanner', () => {
      it('return false if transmissionCtrl is pristine and transmission is automatic', () => {
        component.form = new UntypedFormGroup({ transmissionCtrl: new UntypedFormControl(null) });

        component.form.controls['transmissionCtrl'].markAsPristine();
        component.transmission = TransmissionType.Automatic;

        expect(component.displayTransmissionBanner()).toEqual(false);
      });
      it('return false if transmissionCtrl is dirty and transmission is manual', () => {
        component.form = new UntypedFormGroup({ transmissionCtrl: new UntypedFormControl(null) });

        component.form.controls['transmissionCtrl'].markAsDirty();
        component.transmission = TransmissionType.Manual;

        expect(component.displayTransmissionBanner()).toEqual(false);
      });
      it('return true if transmissionCtrl is dirty and transmission is automatic', () => {
        component.form = new UntypedFormGroup({ transmissionCtrl: new UntypedFormControl(null) });

        component.form.controls['transmissionCtrl'].markAsDirty();
        component.transmission = TransmissionType.Automatic;

        expect(component.displayTransmissionBanner()).toEqual(true);
      });
    });

  });
});
