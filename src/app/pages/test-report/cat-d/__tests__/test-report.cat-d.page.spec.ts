import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { RouterTestingModule } from '@angular/router/testing';
import { TestReportCatDPage } from '../test-report.cat-d.page';

describe('TestReportCatDPage', () => {
  let component: TestReportCatDPage;
  let fixture: ComponentFixture<TestReportCatDPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestReportCatDPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestReportCatDPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
