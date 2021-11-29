import {
  ComponentFixture, TestBed, waitForAsync,
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
import { PassFinalisationCatCPage } from '../pass-finalisation.cat-c.page';

describe('PassFinalisationCatCPage', () => {
  let fixture: ComponentFixture<PassFinalisationCatCPage>;
  let component: PassFinalisationCatCPage;
  let store$: Store<StoreModel>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        PassFinalisationCatCPage,
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
    fixture = TestBed.createComponent(PassFinalisationCatCPage);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
    component.subscription = new Subscription();
  }));

  describe('Class', () => {
  });

});
