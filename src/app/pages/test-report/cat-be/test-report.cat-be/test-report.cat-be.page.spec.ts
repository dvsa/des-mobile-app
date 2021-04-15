import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestReport.CatBePage } from './test-report.cat-be.page';

describe('TestReport.CatBePage', () => {
  let component: TestReport.CatBePage;
  let fixture: ComponentFixture<TestReport.CatBePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestReport.CatBePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestReport.CatBePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
