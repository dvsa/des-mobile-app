import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QuestionScoreComponent } from '@pages/test-report/cat-cpc/components/question-score/question-score';

describe('QuestionScoreComponent', () => {
  let fixture: ComponentFixture<QuestionScoreComponent>;
  let component: QuestionScoreComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        QuestionScoreComponent,
      ],
    });

    fixture = TestBed.createComponent(QuestionScoreComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    it('should set the correct default values', () => {
      expect(component.displayPercentage).toBe(true);
      expect(component.label).toBe('Total:');
    });
  });
});
