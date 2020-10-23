import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertController, IonicModule, LoadingController, Platform } from '@ionic/angular';

import { LoginPage } from './login.page';
import { AlertControllerMock, LoadingControllerMock, PlatformMock } from 'ionic-mocks';
import { AppConfigProvider } from '../providers/app-config/app-config';
import { AppConfigProviderMock } from '../providers/app-config/_mock_/app-config.mock';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { AuthenticationProviderMock } from '../providers/authentication/_mocks_/authentication.mock';
import { SecureStorage } from '@ionic-native/secure-storage/ngx';
import { SecureStorageMock } from '@ionic-native-mocks/secure-storage';
import { DataStoreProvider } from '../providers/data-store/data-store';
import { DataStoreProviderMock } from '../providers/data-store/_mock_/data-store.mock';
import { NetworkStateProvider } from '../providers/network-state/network-state';
import { NetworkStateProviderMock } from '../providers/network-state/_mock_/network-state.mock';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs-compat/add/observable/from';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: SecureStorage, useClass: SecureStorageMock },
        { provide: DataStoreProvider, useClass: DataStoreProviderMock },
        { provide: NetworkStateProvider, useClass: NetworkStateProviderMock },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: Observable.from([{ hasUserLoggedOut: true }]),
          },
        },
        { provide: AlertController, useFactory: () => AlertControllerMock.instance() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
