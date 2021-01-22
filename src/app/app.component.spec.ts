import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { configureTestSuite } from 'ng-bullet';
import { StoreModule } from '@ngrx/store';
import { Plugins } from '@capacitor/core';
import { AppComponent } from './app.component';

describe('AppComponent', () => {

  let splashScreenSpy;
  let platformReadySpy;
  let platformSpy;

  configureTestSuite(() => {
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy });

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        StoreModule.forRoot({}),
      ],
      providers: [
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: Platform, useValue: platformSpy },
      ],
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  // TODO: spike on testing capacitor plugins
  xit('should initialize the app', async () => {
    spyOn(Plugins.prototype.StatusBar, 'setStyle').and.callThrough();
    TestBed.createComponent(AppComponent);
    expect(platformSpy.ready).toHaveBeenCalled();
    await platformReadySpy;
    expect(splashScreenSpy.hide).toHaveBeenCalled();
    expect(Plugins.StatusBar.setStyle).toHaveBeenCalled();
  });

});
