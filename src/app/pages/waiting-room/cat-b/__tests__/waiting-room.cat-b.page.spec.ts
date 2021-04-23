import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { PlatformMock } from 'ionic-mocks';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { TranslateServiceClassMock } from '@shared/helpers/__mocks__/translate';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';

import { WaitingRoomCatBPage } from '../waiting-room.cat-b.page';

describe('WaitingRoomCatBPage', () => {
  let component: WaitingRoomCatBPage;
  let fixture: ComponentFixture<WaitingRoomCatBPage>;
  let translate: TranslateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WaitingRoomCatBPage],
      imports: [
        IonicModule,
        TranslateModule.forChild(),
      ],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: Router, useClass: RouterMock },
        { provide: TranslateService, useClass: TranslateServiceClassMock },
        provideMockStore({}),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WaitingRoomCatBPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
