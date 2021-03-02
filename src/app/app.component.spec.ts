// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import {
//   async, ComponentFixture, fakeAsync, flushMicrotasks, TestBed,
// } from '@angular/core/testing';
// import { MenuController, Platform } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { configureTestSuite } from 'ng-bullet';
// import { Store, StoreModule } from '@ngrx/store';
// import { Capacitor, Plugins, StatusBarStyle } from '@capacitor/core';
// import { Router } from '@angular/router';
// import { AppComponent } from './app.component';
// import { AuthenticationProviderMock } from './providers/authentication/__mocks__/authentication.mock';
// import { AuthenticationProvider } from './providers/authentication/authentication';
// import { PlatformMock } from '../../mock/ionic-mocks/platform-mock';
// import { MenuControllerMock } from '../../mock/ionic-mocks/menu-controller';
// import { LoadAppVersion } from '../store/app-info/app-info.actions';
//
// describe('AppComponent', () => {
//   jasmine.getEnv().allowRespy(true);
//   let component: AppComponent;
//   let fixture: ComponentFixture<AppComponent>;
//   const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
//   Plugins.StatusBar = jasmine.createSpyObj('StatusBar', ['setStyle', 'setOverlaysWebView', 'setBackgroundColor']);
//
//   const splashScreenSpy = {
//     hide: () => {
//     },
//   } as SplashScreen;
//   let authenticationProvider: AuthenticationProvider;
//   let platform: Platform;
//   let menuController: MenuController;
//   let store$: Store;
//   let splashScreen: SplashScreen;
//
//   configureTestSuite(() => {
//     TestBed.configureTestingModule({
//       declarations: [AppComponent],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//       imports: [
//         StoreModule.forRoot({}),
//       ],
//       providers: [
//         { provide: SplashScreen, useValue: splashScreenSpy },
//         { provide: Platform, useClass: PlatformMock },
//         { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
//         { provide: Router, useValue: routerSpy },
//         { provide: MenuController, useClass: MenuControllerMock },
//       ],
//     });
//   });
//
//   beforeEach(async(() => {
//     fixture = TestBed.createComponent(AppComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//
//     authenticationProvider = TestBed.inject(AuthenticationProvider);
//     platform = TestBed.inject(Platform);
//     menuController = TestBed.inject(MenuController);
//     store$ = TestBed.inject(Store);
//     splashScreen = TestBed.inject(SplashScreen);
//   }));
//
//   it('should create the app', () => {
//     const app = fixture.debugElement.componentInstance;
//     expect(app).toBeTruthy();
//   });
//
//   describe('initializeApp', () => {
//     beforeEach(() => {
//       spyOn(platform, 'ready').and.returnValue(Promise.resolve(''));
//       spyOn(store$, 'dispatch');
//       spyOn(splashScreen, 'hide');
//       spyOn(component, 'configureStatusBar').and.returnValue(Promise.resolve());
//       spyOn(component, 'disableMenuSwipe').and.returnValue(Promise.resolve());
//       spyOn(component, 'isLogoutEnabled').and.returnValue(true);
//     });
//     it('should run app initialisation code', fakeAsync(() => {
//       component.initializeApp();
//       flushMicrotasks();
//       expect(store$.dispatch).toHaveBeenCalledWith(LoadAppVersion());
//       expect(splashScreen.hide).toHaveBeenCalled();
//       expect(component.configureStatusBar).toHaveBeenCalled();
//       expect(component.disableMenuSwipe).toHaveBeenCalled();
//       expect(component.logoutEnabled).toEqual(true);
//     }));
//   });
//
//   describe('getTextZoom', () => {
//     it('should return regular when not zoom', () => {
//       expect(component.getTextZoom(null)).toEqual('regular');
//     });
//     it('should return regular when zoom is less than 106', () => {
//       expect(component.getTextZoom(100)).toEqual('regular');
//     });
//     it('should return x-large when zoom is 131 or above', () => {
//       expect(component.getTextZoom(132)).toEqual('x-large');
//     });
//     it('should return large when zoom is 106 or above', () => {
//       expect(component.getTextZoom(107)).toEqual('large');
//     });
//   });
//
//   describe('getTextZoomClass', () => {
//     it('should concatenate the value from getTextZoom to a text-zoom string', () => {
//       spyOn(component, 'getTextZoom').and.returnValue('regular');
//       expect(component.getTextZoomClass()).toEqual('text-zoom-regular');
//     });
//   });
//
//   describe('configureStatusBar', () => {
//     beforeEach(() => {
//       spyOn(Capacitor, 'isPluginAvailable').and.returnValue(true);
//       spyOn(Plugins.StatusBar, 'setStyle');
//       spyOn(Plugins.StatusBar, 'setOverlaysWebView');
//       spyOn(Plugins.StatusBar, 'setBackgroundColor');
//     });
//     it('should set status bar styles when plugin is available', fakeAsync(() => {
//       component.configureStatusBar();
//       flushMicrotasks();
//       expect(Plugins.StatusBar.setStyle).toHaveBeenCalledWith({ style: StatusBarStyle.Dark });
//       expect(Plugins.StatusBar.setOverlaysWebView).toHaveBeenCalledWith({ overlay: false });
//       expect(Plugins.StatusBar.setBackgroundColor).toHaveBeenCalledWith({ color: '#000000' });
//     }));
//   });
//
//   describe('disableMenuSwipe', () => {
//     it('should call swipeGesture with false to disable side menu swipe', async () => {
//       spyOn(menuController, 'swipeGesture');
//       await component.disableMenuSwipe();
//       expect(menuController.swipeGesture).toHaveBeenCalledWith(false);
//     });
//   });
//
//   describe('onLogoutClick', () => {
//     it('should call through to openLogoutModal', async () => {
//       spyOn(component, 'openLogoutModal');
//       await component.onLogoutClick();
//       expect(component.openLogoutModal).toHaveBeenCalled();
//     });
//   });
//
//   describe('isLogoutEnabled', () => {
//     it('should call through to logoutEnabled', () => {
//       spyOn(authenticationProvider, 'logoutEnabled');
//       component.isLogoutEnabled();
//       expect(authenticationProvider.logoutEnabled).toHaveBeenCalled();
//     });
//   });
//
// });
