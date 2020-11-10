import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertController, IonicModule, Platform } from '@ionic/angular';

import { HomePage } from './home.page';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { AuthenticationProviderMock } from '../providers/authentication/_mocks_/authentication.mock';
import { AlertControllerMock, PlatformMock } from 'ionic-mocks';
import { RouterTestingModule, setupTestingRouter } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePage ],
      imports: [
        RouterTestingModule.withRoutes(
          [
            { path: '', component: HomePage }
            ]
        ),
        IonicModule.forRoot()
      ],
      providers: [
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: AlertController, useFactory: () => AlertControllerMock.instance() },
        { provide: Router, useValue: routerSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
