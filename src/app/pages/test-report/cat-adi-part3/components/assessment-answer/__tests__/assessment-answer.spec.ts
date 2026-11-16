import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AssessmentAnswerComponent } from '@pages/test-report/cat-adi-part3/components/assessment-answer/assessment-answer';

describe('AssessmentAnswerComponent', () => {
  let fixture: ComponentFixture<AssessmentAnswerComponent>;
  let component: AssessmentAnswerComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AssessmentAnswerComponent],
    });

    fixture = TestBed.createComponent(AssessmentAnswerComponent);
    component = fixture.componentInstance;
  });

  describe('Class', () => {
    describe('valueChanged', () => {
      it('should dispatch a value via answerToggled', () => {
        vi.spyOn(component.answerToggled, 'emit').mockReturnValue(undefined);
        component.valueChanged('some val');
        expect(component.answerToggled.emit).toHaveBeenCalledWith('some val');
      });
    });
  });
});
