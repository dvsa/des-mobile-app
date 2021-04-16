import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { PlatformMock } from 'ionic-mocks';

import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouterMock } from '@mocks/angular-mocks/router-mock';

import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { WaitingRoomCatCPage } from '../waiting-room.cat-c.page';

describe('WaitingRoomCatCPage', () => {
  let component: WaitingRoomCatCPage;
  let fixture: ComponentFixture<WaitingRoomCatCPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WaitingRoomCatCPage],
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

    fixture = TestBed.createComponent(WaitingRoomCatCPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
