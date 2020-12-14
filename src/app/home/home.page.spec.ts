import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertController, IonicModule, Platform } from '@ionic/angular';
import { AlertControllerMock, PlatformMock } from 'ionic-mocks';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { configureTestSuite } from 'ng-bullet';
import { StoreModule } from '@ngrx/store';
import { HomePage } from './home.page';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { appInfoReducer } from '../../store/app-info/app-info.reducer';
import { AuthenticationProviderMock } from '../providers/authentication/__mocks__/authentication.mock';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [
        RouterTestingModule.withRoutes(
          [
            { path: '', component: HomePage },
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
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
