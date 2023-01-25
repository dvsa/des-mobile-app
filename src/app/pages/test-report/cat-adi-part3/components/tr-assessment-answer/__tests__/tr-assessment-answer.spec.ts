import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  TestReportAssessmentAnswer,
} from '@pages/test-report/cat-adi-part3/components/tr-assessment-answer/tr-assessment-answer';

describe('TestReportAssessmentAnswer', () => {
  let fixture: ComponentFixture<TestReportAssessmentAnswer>;
  let component: TestReportAssessmentAnswer;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestReportAssessmentAnswer,
      ],
    });

    fixture = TestBed.createComponent(TestReportAssessmentAnswer);
    component = fixture.componentInstance;
  }));

  describe('valueChanged', () => {
    it('should emit answerChanged with null if key and answer match', () => {
      spyOn(component.answerChanged, 'emit');
      component.answer = 1;
      component.valueChanged('1');
      expect(component.answerChanged.emit).toHaveBeenCalledWith(null);
    });
    it('should emit answerChanged with the passed in key if it and answer do not match', () => {
      spyOn(component.answerChanged, 'emit');
      component.answer = 1;
      component.valueChanged('test');
      expect(component.answerChanged.emit).toHaveBeenCalledWith('test');
    });
  });

  describe('hasBeenMissed', () => {
    it('should return true if showMissing is true and hasValue is false', () => {
      component.showMissing = true;
      spyOn(component, 'hasValue').and.returnValue(false);
      expect(component.hasBeenMissed()).toBe(true);
    });
    it('should return false if showMissing is false and hasValue is false', () => {
      component.showMissing = false;
      spyOn(component, 'hasValue').and.returnValue(false);
      expect(component.hasBeenMissed()).toBe(false);
    });
    it('should return false if showMissing is false and hasValue is true', () => {
      component.showMissing = false;
      spyOn(component, 'hasValue').and.returnValue(true);
      expect(component.hasBeenMissed()).toBe(false);
    });
    it('should return false if showMissing is true and hasValue is true', () => {
      component.showMissing = true;
      spyOn(component, 'hasValue').and.returnValue(true);
      expect(component.hasBeenMissed()).toBe(false);
    });
  });

  describe('hasValue', () => {
    it('should return true if answer is a number between 0 and 3', () => {
      component.answer = 1;
      expect(component.hasValue()).toBe(true);
    });
    it('should return false if answer is not a number between 0 and 3', () => {
      component.answer = 10;
      expect(component.hasValue()).toBe(false);
    });
  });

  describe('errorHighlighting', () => {
    it('should set both items to the value of hasBeenMissed', () => {
      spyOn(component, 'hasBeenMissed').and.returnValue(true);
      expect(component.errorHighlighting()).toEqual({
        'ng-dirty': true,
        'ng-invalid': true,
      });
    });
  });
});
