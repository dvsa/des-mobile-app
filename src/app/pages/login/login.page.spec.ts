import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AlertController, IonicModule, LoadingController, Platform,
} from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { AlertControllerMock, LoadingControllerMock, PlatformMock } from 'ionic-mocks';
import { SecureStorage } from '@ionic-native/secure-storage/ngx';
import { SecureStorageMock } from '@ionic-native-mocks/secure-storage';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { StoreModule } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginPage } from './login.page';
import { AppConfigProvider } from '../../providers/app-config/app-config';
import { AppConfigProviderMock } from '../../providers/app-config/__mocks__/app-config.mock';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { AuthenticationProviderMock } from '../../providers/authentication/__mocks__/authentication.mock';
import { DataStoreProvider } from '../../providers/data-store/data-store';
import { DataStoreProviderMock } from '../../providers/data-store/__mocks__/data-store.mock';
import { NetworkStateProvider } from '../../providers/network-state/network-state';
import { NetworkStateProviderMock } from '../../providers/network-state/__mocks__/network-state.mock';
import { LoginRouterMock } from './_mock_/login.page.mock';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [
        IonicModule.forRoot(), RouterTestingModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: SecureStorage, useClass: SecureStorageMock },
        { provide: DataStoreProvider, useClass: DataStoreProviderMock },
        { provide: NetworkStateProvider, useClass: NetworkStateProviderMock },
        { provide: Router, useClass: LoginRouterMock },
        {
          provide: ActivatedRoute,
          useValue: {
            // eslint-disable-next-line rxjs/finnish
            params: of([{ hasUserLoggedOut: true }]),
            // eslint-disable-next-line rxjs/finnish
            queryParams: of({
              hasUserLoggedOut: true,
            }),
          },
        },
        { provide: AlertController, useFactory: () => AlertControllerMock.instance() },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
