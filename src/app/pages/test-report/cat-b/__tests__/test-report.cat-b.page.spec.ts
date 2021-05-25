import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { TestReportCatBPage } from '@pages/test-report/cat-b/test-report.cat-b.page';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { PlatformMock } from 'ionic-mocks';
import { Router } from '@angular/router';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { provideMockStore } from '@ngrx/store/testing';

// @TODO - MES-6883 - enable unit tests
xdescribe('TestReportCatBPage', () => {
  let component: TestReportCatBPage;
  let fixture: ComponentFixture<TestReportCatBPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestReportCatBPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: Router, useClass: RouterMock },
        provideMockStore({}),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestReportCatBPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
