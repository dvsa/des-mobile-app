import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { TestReportCatAMod1Page } from '@pages/test-report/cat-a-mod1/test-report.cat-a-mod1.page';

describe('TestReportCatAMod1Page', () => {
  let component: TestReportCatAMod1Page;
  let fixture: ComponentFixture<TestReportCatAMod1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestReportCatAMod1Page],
      imports: [IonicModule.forRoot()],
      providers: [
        // { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestReportCatAMod1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
