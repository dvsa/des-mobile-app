import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { configureTestSuite } from 'ng-bullet';
import { StoreModule } from '@ngrx/store';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthenticationProviderMock } from './providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from './providers/authentication/authentication';
import { PlatformMock } from '../../mock/ionic-mocks/platform-mock';

describe('AppComponent', () => {
  jasmine.getEnv().allowRespy(true);
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

  const splashScreenSpy = {
    hide: () => {
    },
  } as SplashScreen;
  let authenticationProvider: AuthenticationProvider;
  let platform: Platform;

  configureTestSuite(() => {

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        StoreModule.forRoot({}),
      ],
      providers: [
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: Platform, useClass: PlatformMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    authenticationProvider = TestBed.inject(AuthenticationProvider);
    platform = TestBed.inject(Platform);
  }));

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  describe('onLogoutClick', () => {
    it('should call through to openLogoutModal', async () => {
      spyOn(component, 'openLogoutModal');
      await component.onLogoutClick();
      expect(component.openLogoutModal).toHaveBeenCalled();
    });
  });

  describe('isLogoutEnabled', () => {
    it('should call through to logoutEnabled', () => {
      spyOn(authenticationProvider, 'logoutEnabled');
      component.isLogoutEnabled();
      expect(authenticationProvider.logoutEnabled).toHaveBeenCalled();
    });
  });

  // TODO: spike on testing capacitor plugins
  xit('should initialize the app', async () => {
    spyOn(Plugins.prototype.StatusBar, 'setStyle').and.callThrough();
    TestBed.createComponent(AppComponent);
    expect(platform.ready).toHaveBeenCalled();
    await platform;
    expect(splashScreenSpy.hide).toHaveBeenCalled();
    expect(Plugins.StatusBar.setStyle).toHaveBeenCalled();
  });

});
