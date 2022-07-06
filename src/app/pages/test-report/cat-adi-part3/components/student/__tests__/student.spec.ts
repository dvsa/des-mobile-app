import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import {
  AssessmentAnswerComponent,
} from '@pages/test-report/cat-adi-part3/components/assessment-answer/assessment-answer';
import { MockComponent } from 'ng-mocks';
import { StudentComponent } from '@pages/test-report/cat-adi-part3/components/student/student';

describe('StudentComponent', () => {
  let fixture: ComponentFixture<StudentComponent>;
  let component: StudentComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        StudentComponent,
        MockComponent(AssessmentAnswerComponent),
      ],
      imports: [
        IonicModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(StudentComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('studentLevelChanged', () => {
      it('should dispatch a value via studentLevelChange', () => {
        spyOn(component.studentLevelChange, 'emit');
        component.studentLevelChanged('beginner');
        expect(component.studentLevelChange.emit).toHaveBeenCalledWith('beginner');
      });
    });
  });
});
