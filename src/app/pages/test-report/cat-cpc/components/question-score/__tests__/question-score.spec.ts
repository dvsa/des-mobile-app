import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionScoreComponent } from '@pages/test-report/cat-cpc/components/question-score/question-score';
import { beforeEach, describe, expect, it } from 'vitest';

describe('QuestionScoreComponent', () => {
  let fixture: ComponentFixture<QuestionScoreComponent>;
  let component: QuestionScoreComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QuestionScoreComponent],
    });

    fixture = TestBed.createComponent(QuestionScoreComponent);
    component = fixture.componentInstance;
  });

  describe('Class', () => {
    it('should set the correct default values', () => {
      expect(component.displayPercentage).toBe(true);
      expect(component.label).toBe('Total:');
    });
  });
});
