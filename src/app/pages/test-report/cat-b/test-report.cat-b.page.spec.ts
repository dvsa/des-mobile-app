import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestReport.CatBPage } from './test-report.cat-b.page';

describe('TestReport.CatBPage', () => {
  let component: TestReport.CatBPage;
  let fixture: ComponentFixture<TestReport.CatBPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestReport.CatBPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestReport.CatBPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
