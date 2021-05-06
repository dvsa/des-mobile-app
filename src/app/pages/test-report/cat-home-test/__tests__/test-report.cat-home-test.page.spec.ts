import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { TestReportCatHomeTestPage } from '@pages/test-report/cat-home-test/test-report.cat-home-test.page';

describe('TestReportCatHomeTestPage', () => {
  let component: TestReportCatHomeTestPage;
  let fixture: ComponentFixture<TestReportCatHomeTestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestReportCatHomeTestPage],
      imports: [IonicModule.forRoot()],
      providers: [
        // { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestReportCatHomeTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
