import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import {
  NavParamsMock, ConfigMock, PlatformMock, AlertControllerMock,
} from 'ionic-mocks';
import { MockComponent } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import {
  AlertController, Config, IonicModule, NavParams, Platform,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { ErrorPage } from './error';
import { ErrorMessageComponent } from '../../../components/common/error-message/error-message';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { AuthenticationProviderMock } from '../../providers/authentication/__mocks__/authentication.mock';

describe('ErrorPage', () => {
  let fixture: ComponentFixture<ErrorPage>;
  let component: ErrorPage;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        ErrorPage,
        MockComponent(ErrorMessageComponent),
      ],
      imports: [
        IonicModule,
      ],
      providers: [
        { provide: Router, useFactory: () => {} },
        { provide: NavParams, useFactory: () => NavParamsMock.instance() },
        { provide: Config, useFactory: () => ConfigMock.instance() },
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AlertController, useFactory: () => AlertControllerMock.instance() },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ErrorPage);
    component = fixture.componentInstance;
  }));

  it('should navigation back to the last page in the stack', () => {
    spyOn(component.location, 'back');
    component.goBack();
    expect(component.location.back).toHaveBeenCalled();
  });

  describe('DOM', () => {
    it('should display an error message', () => {
      expect(fixture.debugElement.query(By.css('.error'))).not.toBeNull();
    });
  });
});
