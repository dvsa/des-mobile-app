import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, Platform } from '@ionic/angular';
import { PlatformMock } from 'ionic-mocks';
import { Router } from '@angular/router';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { provideMockStore } from '@ngrx/store/testing';

import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { NavMock } from '@mocks/angular-mocks/nav-mock';

import {
  WaitingRoomToCarBasePageComponent,
} from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { WaitingRoomToCarCatBPage } from '../waiting-room-to-car.cat-b.page';

describe('WaitingRoomToCarCatBPage', () => {
  let component: WaitingRoomToCarCatBPage;
  let fixture: ComponentFixture<WaitingRoomToCarCatBPage>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [WaitingRoomToCarCatBPage],
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

    fixture = TestBed.createComponent(WaitingRoomToCarCatBPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call through to the base page init method', () => {
      spyOn(WaitingRoomToCarBasePageComponent.prototype, 'onInitialisation');
      component.ngOnInit();
      expect(WaitingRoomToCarBasePageComponent.prototype.onInitialisation).toHaveBeenCalled();
    });
  });

});
