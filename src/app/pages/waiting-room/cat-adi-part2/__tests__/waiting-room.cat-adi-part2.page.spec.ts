import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { PlatformMock } from 'ionic-mocks';
import { provideMockStore } from '@ngrx/store/testing';

import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouterMock } from '@mocks/angular-mocks/router-mock';

import { AuthenticationProvider } from '@providers/authentication/authentication';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';

import { WaitingRoomCatAdiPart2Page } from '../waiting-room.cat-adi-part2.page';

describe('WaitingRoomCatADIPart2Page', () => {
  let component: WaitingRoomCatAdiPart2Page;
  let fixture: ComponentFixture<WaitingRoomCatAdiPart2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WaitingRoomCatAdiPart2Page],
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

    fixture = TestBed.createComponent(WaitingRoomCatAdiPart2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
