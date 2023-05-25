import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import {
  AssessmentAnswerComponent,
} from '@pages/test-report/cat-adi-part3/components/assessment-answer/assessment-answer';
import { MockComponent } from 'ng-mocks';
import { StudentComponent } from '@pages/test-report/cat-adi-part3/components/student/student';
import { HeaderComponent } from '@components/common/header-component/header.component';

describe('StudentComponent', () => {
  let fixture: ComponentFixture<StudentComponent>;
  let component: StudentComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        StudentComponent,
        MockComponent(HeaderComponent),
        MockComponent(AssessmentAnswerComponent),
      ],
      imports: [
        IonicModule,
      ],
    });
  }));

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
