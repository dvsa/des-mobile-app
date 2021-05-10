import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, Platform } from '@ionic/angular';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import {
  initialState as preTestDeclarationInitialState,
} from '@store/tests/pre-test-declarations/pre-test-declarations.reducer';
import { Router } from '@angular/router';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';
import { configureTestSuite } from 'ng-bullet';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { PlatformMock } from 'ionic-mocks';
import { provideMockStore } from '@ngrx/store/testing';
import { CommunicationPage } from '../communication.page';
import { AppModule } from '@app-module/app.module';
import { MockComponent } from 'ng-mocks';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { EndTestLinkComponent } from '@components/common/end-test-link/end-test-link';
import { ProvidedEmailComponent } from '@pages/communication/components/provided-email/provided-email';
import { NewEmailComponent } from '@pages/communication/components/new-email/new-email';
import { PostalAddressComponent } from '@pages/communication/components/postal-address/postal-address';
import { PrivacyNoticeComponent } from '@pages/communication/components/privacy-notice/privacy-notice';
import { AppInfoStateModel } from '@store/app-info/app-info.model';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { DeviceAuthenticationProviderMock } from '@providers/device-authentication/__mocks__/device-authentication.mock';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { Subscription } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { translateServiceMock } from '@shared/mocks/translate';

fdescribe('Communication.Page', () => {
  let component: CommunicationPage;
  let fixture: ComponentFixture<CommunicationPage>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
  let store$: Store<StoreModel>;
  const initialState = {
    appInfo: { versionNumber: '4.0' } as AppInfoStateModel,
    tests: {
      currentTest: { slotId: '123' },
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
    },
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        CommunicationPage,
        MockComponent(PracticeModeBanner),
        MockComponent(EndTestLinkComponent),
        MockComponent(ProvidedEmailComponent),
        MockComponent(NewEmailComponent),
        MockComponent(PostalAddressComponent),
        MockComponent(PrivacyNoticeComponent),
      ],
      imports: [
        IonicModule,
        AppModule,
        TranslateModule,
      ],
      providers: [
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: Router, useValue: routerSpy },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        provideMockStore({ initialState }),
        { provide: DeviceAuthenticationProvider, useClass: DeviceAuthenticationProviderMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
        { provide: TranslateService, useValue: translateServiceMock },

      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CommunicationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
    component.subscription = new Subscription();
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
