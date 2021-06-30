import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { RouterTestingModule } from '@angular/router/testing';
import { TestReportCatAMod2Page } from '../test-report.cat-a-mod2.page';

describe('TestReportCatAMod2Page', () => {
  let component: TestReportCatAMod2Page;
  let fixture: ComponentFixture<TestReportCatAMod2Page>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestReportCatAMod2Page],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestReportCatAMod2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
