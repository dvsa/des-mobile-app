import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import {
  AssessmentAnswerComponent,
} from '@pages/test-report/cat-adi-part3/components/assessment-answer/assessment-answer';

describe('AssessmentAnswerComponent', () => {
  let fixture: ComponentFixture<AssessmentAnswerComponent>;
  let component: AssessmentAnswerComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AssessmentAnswerComponent,
      ],
      imports: [
        IonicModule,
      ],
    });

    fixture = TestBed.createComponent(AssessmentAnswerComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('valueChanged', () => {
      it('should dispatch a value via answerToggled', () => {
        spyOn(component.answerToggled, 'emit');
        component.valueChanged('some val');
        expect(component.answerToggled.emit).toHaveBeenCalledWith('some val');
      });
    });
  });
});
