// import {
//   waitForAsync,
//   TestBed,
// } from '@angular/core/testing';
// import { Platform } from '@ionic/angular';
// import { configureTestSuite } from 'ng-bullet';
// import { Store } from '@ngrx/store';
// import { PlatformMock } from 'ionic-mocks';
// import { Router } from '@angular/router';
// import { MockStore, provideMockStore } from '@ngrx/store/testing';
// import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
//
// import { RouterMock } from '@mocks/angular-mocks/router-mock';
// import { AuthenticationProvider } from '@providers/authentication/authentication';
// import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
// import { StoreModel } from '@shared/models/store.model';
// import { TestsModel } from '@store/tests/tests.model';
// import { TestStatus } from '@store/tests/test-status/test-status.model';
// import { PassFinalisationPageComponent } from '../pass-finalisation-base-page';
//
// describe('PassFinalisationPageComponent', () => {
//   let platform: Platform;
//   let authenticationProvider: AuthenticationProvider;
//   let router: Router;
//   let store$: Store<StoreModel>;
//
//   let basePageComponent: PassFinalisationPageComponent;
//   const initialState = {
//     tests: {
//       currentTest: { slotId: '1234' },
//       startedTests: {
//         1234: {
//           journalData: {
//             candidate: {
//               candidateName: { title: 'Mr', firstName: 'Homer', lastName: 'Simpson' },
//             },
//           },
//         } as TestResultSchemasUnion,
//       },
//       testStatus: { 1234: TestStatus.Booked },
//     } as TestsModel,
//   } as StoreModel;
//
//   configureTestSuite(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         { provide: Platform, useFactory: () => PlatformMock.instance() },
//         { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
//         { provide: Router, useClass: RouterMock },
//         provideMockStore({ initialState }),
//       ],
//     });
//   });
//
//   beforeEach(waitForAsync(() => {
//     platform = TestBed.inject(Platform);
//     authenticationProvider = TestBed.inject(AuthenticationProvider);
//     router = TestBed.inject(Router);
//     store$ = TestBed.inject(MockStore);
//
//     class BasePageClass extends PassFinalisationPageComponent {
//       constructor(
//         sto$: Store<StoreModel>,
//         plat: Platform,
//         auth: AuthenticationProvider,
//         rout: Router,
//       ) {
//         super(platform, authenticationProvider, router, store$);
//       }
//     }
//     basePageComponent = new BasePageClass(store$, platform, authenticationProvider, router);
//   }));
//
//   describe('onInitialisation', () => {
//     it('should resolve state variables', () => {
//       basePageComponent.onInitialisation();
//       basePageComponent.commonPageState.candidateName$
//         .subscribe((res) => expect(res).toEqual('Mr Homer Simpson'));
//     });
//   });
//
// });

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommunicationPage } from '@pages/communication/communication.page';
import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MockComponent } from 'ng-mocks';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '@app/app.module';
import { initialState as preTestDeclarationInitialState } from '@store/tests/pre-test-declarations/pre-test-declarations.reducer';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { Platform } from '@ionic/angular';
import { PlatformMock } from 'ionic-mocks';
import { Router } from '@angular/router';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';
import { DeviceAuthenticationProviderMock } from '@providers/device-authentication/__mocks__/device-authentication.mock';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { Subscription } from 'rxjs';
import { D255Component } from '@components/test-finalisation/d255/d255';
import { DebriefWitnessedComponent } from '@components/test-finalisation/debrief-witnessed/debrief-witnessed';
import { LanguagePreferencesComponent } from '@components/test-finalisation/language-preference/language-preference';
import { TransmissionComponent } from '@components/common/transmission/transmission';
import { FinalisationHeaderComponent } from '@components/test-finalisation/finalisation-header/finalisation-header';
import { PassCertificateNumberComponent } from '@pages/pass-finalisation/components/pass-certificate-number/pass-certificate-number';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { LicenceProvidedWarningBannerComponent } from '@pages/pass-finalisation/components/licence-provided-warning-banner/licence-provided-warning-banner';
import { LicenseProvidedComponent } from '@pages/pass-finalisation/components/license-provided/license-provided';
import { PassFinalisationCatBPage } from '@pages/pass-finalisation/cat-b/pass-finalisation.cat-b.page';

fdescribe('PassFinalisationCatBPage', () => {
  let fixture: ComponentFixture<PassFinalisationCatBPage>;
  let component: PassFinalisationCatBPage;
  let store$: Store<StoreModel>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        CommunicationPage,
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
                conductedLanguage: 'English',
              },
            },
          },
        })),
      ],
      providers: [
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: Router, useValue: routerSpy },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: DeviceAuthenticationProvider, useClass: DeviceAuthenticationProviderMock },
        { provide: DeviceProvider, useClass: DeviceProviderMock },
      ],
    });

  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(PassFinalisationCatBPage);
    component = fixture.componentInstance;
    component.subscription = new Subscription(); store$ = TestBed.get(Store);
    spyOn(store$, 'dispatch');
  }));

  describe('Class', () => {
    it('should create component', () => {
      expect(component)
        .toBeTruthy();
    });
  });
});
