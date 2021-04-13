import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TestReportCatBPage } from '@pages/test-report/cat-b/test-report.cat-b.page';


describe('TestReportCatBPage', () => {
  let component: TestReportCatBPage;
  let fixture: ComponentFixture<TestReportCatBPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestReportCatBPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestReportCatBPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
