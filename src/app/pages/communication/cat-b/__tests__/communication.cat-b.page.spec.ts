import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { PlatformMock } from 'ionic-mocks';
import { Router } from '@angular/router';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { provideMockStore } from '@ngrx/store/testing';

import { CommunicationCatBPage } from '../communication.cat-b.page';

describe('CommunicationCatBPage', () => {
  let component: CommunicationCatBPage;
  let fixture: ComponentFixture<CommunicationCatBPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommunicationCatBPage],
      imports: [IonicModule],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: Router, useClass: RouterMock },
        provideMockStore({}),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CommunicationCatBPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
