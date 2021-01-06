import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertController, IonicModule, Platform } from '@ionic/angular';
import { AlertControllerMock, PlatformMock } from 'ionic-mocks';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { configureTestSuite } from 'ng-bullet';
import { StoreModule } from '@ngrx/store';
import { DashboardPage } from './dashboard.page';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { appInfoReducer } from '../../../store/app-info/app-info.reducer';
import { AuthenticationProviderMock } from '../../providers/authentication/__mocks__/authentication.mock';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardPage],
      imports: [
        RouterTestingModule.withRoutes(
          [
            { path: '', component: DashboardPage },
          ],
        ),
        IonicModule.forRoot(),
        StoreModule.forRoot({ appInfo: appInfoReducer }),
      ],
      providers: [
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: AlertController, useFactory: () => AlertControllerMock.instance() },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
