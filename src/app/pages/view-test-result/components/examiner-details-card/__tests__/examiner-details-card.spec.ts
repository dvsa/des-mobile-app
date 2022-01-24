import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';
import { DataRowComponent } from '@components/common/data-row/data-row';
import { configureTestSuite } from 'ng-bullet';
import { ExaminerDetailsCardComponent } from '../examiner-details';

describe('ExaminerDetailsCardComponent', () => {
  let fixture: ComponentFixture<ExaminerDetailsCardComponent>;
  let component: ExaminerDetailsCardComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        ExaminerDetailsCardComponent,
        MockComponent(DataRowComponent),
      ],
      imports: [
        IonicModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ExaminerDetailsCardComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });

});
