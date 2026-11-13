import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TestReportAssessmentAnswer } from '@pages/test-report/cat-adi-part3/components/tr-assessment-answer/tr-assessment-answer';
import { TestReportAssessmentCard } from '@pages/test-report/cat-adi-part3/components/tr-assessment-card/tr-assessment-card';

import { MockComponent } from 'ng-mocks';

describe('TestReportAssessmentCard', () => {
  let fixture: ComponentFixture<TestReportAssessmentCard>;
  let component: TestReportAssessmentCard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, TestReportAssessmentCard, MockComponent(TestReportAssessmentAnswer)],
    });

    fixture = TestBed.createComponent(TestReportAssessmentCard);
    component = fixture.componentInstance;
  });

  describe('trAssessmentAnswerChange', () => {
    it('should emit trAssessmentAnswerChange with answer as a number', () => {
      vi.spyOn(component.answerChange, 'emit').mockReturnValue(undefined);
      component.trAssessmentAnswerChange(1, '2');
      expect(component.answerChange.emit).toHaveBeenCalledWith({ question: 1, answer: 2 });
    });
    it('should emit trAssessmentAnswerChange with answer as null', () => {
      vi.spyOn(component.answerChange, 'emit').mockReturnValue(undefined);
      component.trAssessmentAnswerChange(1, null);
      expect(component.answerChange.emit).toHaveBeenCalledWith({ question: 1, answer: null });
    });
  });
});
