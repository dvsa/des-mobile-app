import {
  ComponentFixture, TestBed, waitForAsync, fakeAsync, tick,
} from '@angular/core/testing';
import {
  NavControllerMock,
  PlatformMock,
} from 'ionic-mocks';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { MockComponent } from 'ng-mocks';
import { configureTestSuite } from 'ng-bullet';
import { Subscription } from 'rxjs';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { TransmissionComponent } from '@components/common/transmission/transmission';
import { FinalisationHeaderComponent } from '@components/test-finalisation/finalisation-header/finalisation-header';
import { LanguagePreferencesComponent } from '@components/test-finalisation/language-preference/language-preference';
import { DebriefWitnessedComponent } from '@components/test-finalisation/debrief-witnessed/debrief-witnessed';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import {
  PassCertificateNumberComponent,
} from '@pages/pass-finalisation/components/pass-certificate-number/pass-certificate-number';
import {
  LicenseProvidedComponent,
} from '@pages/pass-finalisation/components/license-provided/license-provided';
import {
  LicenceProvidedWarningBannerComponent,
} from '@pages/pass-finalisation/components/licence-provided-warning-banner/licence-provided-warning-banner';
import {
  IonicModule, NavController, Platform,
} from '@ionic/angular';
import { AppModule } from '@app/app.module';
import { D255Component } from '@components/test-finalisation/d255/d255';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TransmissionType } from '@shared/models/transmission-type';
import { PersistTests } from '@store/tests/tests.actions';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { PassFinalisationValidationError } from '@pages/pass-finalisation/pass-finalisation.actions';
import {
  PASS_CERTIFICATE_NUMBER_CTRL,
} from '@pages/pass-finalisation/components/pass-certificate-number/pass-certificate-number.constants';
import { PassFinalisationCatDPage } from '../pass-finalisation.cat-d.page';

describe('PassFinalisationCatDPage', () => {
  let fixture: ComponentFixture<PassFinalisationCatDPage>;
  let component: PassFinalisationCatDPage;
  let store$: Store<StoreModel>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

  const automaticManualBannerConditions = [
    {
      category: TestCategory.D,
      code78: true,
      transmission: TransmissionType.Automatic,
      automaticBanner: true,
      manualBanner: false,
      desc: 'Automatic banner shown when automatic transmission and code78 present',
    },
    {
      category: TestCategory.D,
      code78: false,
      transmission: TransmissionType.Automatic,
      automaticBanner: false,
      manualBanner: true,
      desc: 'Manual banner shown when automatic transmission and no code78 present',
    },
    {
      category: TestCategory.D,
      code78: false,
      transmission: TransmissionType.Manual,
      automaticBanner: false,
      manualBanner: true,
      desc: 'Manual banner shown when manual transmission and no code78 present',
    },
    {
      category: TestCategory.D,
      code78: true,
      transmission: TransmissionType.Manual,
      automaticBanner: false,
      manualBanner: true,
      desc: 'Manual banner shown when manual transmission and code78 present',
    },
    {
      category: TestCategory.DE,
      code78: true,
      transmission: TransmissionType.Automatic,
      automaticBanner: true,
      manualBanner: false,
      desc: 'Automatic banner shown when automatic transmission and code78 present',
    },
    {
      category: TestCategory.DE,
      code78: false,
      transmission: TransmissionType.Automatic,
      automaticBanner: false,
      manualBanner: true,
      desc: 'Manual banner shown when automatic transmission and no code78 present',
    },
    {
      category: TestCategory.DE,
      code78: false,
      transmission: TransmissionType.Manual,
      automaticBanner: false,
      manualBanner: true,
      desc: 'Manual banner shown when manual transmission and no code78 present',
    },
    {
      category: TestCategory.DE,
      code78: true,
      transmission: TransmissionType.Manual,
      automaticBanner: false,
      manualBanner: true,
      desc: 'Manual banner shown when manual transmission and code78 present',
    },
    {
      category: TestCategory.D1,
      code78: true,
      transmission: TransmissionType.Automatic,
      automaticBanner: true,
      manualBanner: false,
      desc: 'Automatic banner shown when automatic transmission and code78 present',
    },
    {
      category: TestCategory.D1,
      code78: false,
      transmission: TransmissionType.Automatic,
      automaticBanner: false,
      manualBanner: true,
      desc: 'Manual banner shown when automatic transmission and no code78 present',
    },
    {
      category: TestCategory.D1,
      code78: false,
      transmission: TransmissionType.Manual,
      automaticBanner: false,
      manualBanner: true,
      desc: 'Manual banner shown when manual transmission and no code78 present',
    },
    {
      category: TestCategory.D1,
      code78: true,
      transmission: TransmissionType.Manual,
      automaticBanner: false,
      manualBanner: true,
      desc: 'Manual banner shown when manual transmission and code78 present',
    },
    {
      category: TestCategory.D1E,
      code78: true,
      transmission: TransmissionType.Automatic,
      automaticBanner: true,
      manualBanner: false,
      desc: 'Automatic banner shown when automatic transmission and code78 present',
    },
    {
      category: TestCategory.D1E,
      code78: false,
      transmission: TransmissionType.Automatic,
      automaticBanner: false,
      manualBanner: true,
      desc: 'Manual banner shown when automatic transmission and no code78 present',
    },
    {
      category: TestCategory.D1E,
      code78: false,
      transmission: TransmissionType.Manual,
      automaticBanner: false,
      manualBanner: true,
      desc: 'Manual banner shown when manual transmission and no code78 present',
    },
    {
      category: TestCategory.D1E,
      code78: true,
      transmission: TransmissionType.Manual,
      automaticBanner: false,
      manualBanner: true,
      desc: 'Manual banner shown when manual transmission and code78 present',
    },
  ];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        PassFinalisationCatDPage,
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
      imports: [
        RouterTestingModule.withRoutes([]),
        IonicModule,
        AppModule,
      ],
      providers: [
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: Router, useValue: routerSpy },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: NavController, useClass: NavControllerMock },
        OutcomeBehaviourMapProvider,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(PassFinalisationCatDPage);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
    component.subscription = new Subscription();
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
        expect(store$.dispatch)
          .toHaveBeenCalledWith(PassFinalisationValidationError(`${PASS_CERTIFICATE_NUMBER_CTRL} is invalid`));
        expect(store$.dispatch)
          .not
          .toHaveBeenCalledWith(PassFinalisationValidationError('notRequiredControl is blank'));
      }));
    });
    describe('shouldShowAutomaticBanner & shouldShowManualBanner', () => {
      automaticManualBannerConditions.forEach((cat) => {
        it(`${cat.desc} (${cat.category})`, () => {
          component.transmission = cat.transmission;
          component.code78Present = cat.code78;
          component.testCategory = cat.category;
          expect(component.shouldShowAutomaticBanner()).toEqual(cat.automaticBanner);
          expect(component.shouldShowManualBanner()).toEqual(cat.manualBanner);
        });
      });
    });
    describe('shouldHideBanner', () => {
      it('should hide banner when only transmission is selected', () => {
        component.transmission = TransmissionType.Manual;
        expect(component.shouldShowCode78Banner()).toEqual(false);
      });
    });
  });

});
