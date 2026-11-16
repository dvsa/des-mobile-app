import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { QuestionFooterComponent } from '../question-footer';

describe('QuestionFooterComponent', () => {
  let fixture: ComponentFixture<QuestionFooterComponent>;
  let component: QuestionFooterComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QuestionFooterComponent],
    });

    fixture = TestBed.createComponent(QuestionFooterComponent);
    component = fixture.componentInstance;
  });

  describe('showPreviousPageButton', () => {
    it('should return false which hides previous question button on Q1', () => {
      component.questionNumber = 1;
      expect(component.showPreviousPageButton()).toEqual(false);
    });
    it('should return true which shows previous question button on Q2', () => {
      component.questionNumber = 2;
      expect(component.showPreviousPageButton()).toEqual(true);
    });
  });

  describe('showNextPageButton', () => {
    it('should return true which shows next question button on Q1', () => {
      component.questionNumber = 1;
      expect(component.showNextPageButton()).toEqual(true);
    });
    it('should return false which hides next question button on Q5', () => {
      component.questionNumber = 5;
      expect(component.showNextPageButton()).toEqual(false);
    });
  });

  describe('showViewSummaryButton', () => {
    it('should return false which hides test summary button on Q4', () => {
      component.questionNumber = 4;
      expect(component.showViewSummaryButton()).toEqual(false);
    });
    it('should return true which shows test summary button on Q5', () => {
      component.questionNumber = 5;
      expect(component.showViewSummaryButton()).toEqual(true);
    });
  });

  describe('goToPreviousQuestion', () => {
    it('should deduct one to the question number and emit the value', () => {
      vi.spyOn(component.questionPageChange, 'emit').mockReturnValue(undefined);
      component.questionNumber = 3;
      component.goToPreviousQuestion();
      expect(component.questionPageChange.emit).toHaveBeenCalledWith(2);
    });
  });

  describe('goToNextQuestion', () => {
    it('should add one to the question number and emit the value', () => {
      vi.spyOn(component.questionPageChange, 'emit').mockReturnValue(undefined);
      component.questionNumber = 3;
      component.goToNextQuestion();
      expect(component.questionPageChange.emit).toHaveBeenCalledWith(4);
    });
  });

  describe('goToSummary', () => {
    it('should emit testSummaryRequested with true if isDelegated is false', () => {
      vi.spyOn(component.testSummaryRequested, 'emit').mockReturnValue(undefined);
      component.isDelegated = false;
      component.goToSummary();
      expect(component.testSummaryRequested.emit).toHaveBeenCalledWith(true);
    });
    it('should not emit testSummaryRequested with true ' + 'if isDelegated is true and isFormValid is false', () => {
      vi.spyOn(component.testSummaryRequested, 'emit').mockReturnValue(undefined);
      vi.spyOn(component, 'isFormValid').mockReturnValue(Promise.resolve(false));
      component.isDelegated = true;
      component.goToSummary();
      expect(component.testSummaryRequested.emit).not.toHaveBeenCalledWith(true);
    });
  });

  describe('createToast', () => {
    it('should call toastController.create with the correct params', async () => {
      vi.spyOn(component.toastController, 'create');
      await component.createToast('string');
      expect(component.toastController.create).toHaveBeenCalledWith({
        message: 'string',
        position: 'top',
        cssClass: 'mes-toast-message-error',
        duration: 5000,
        buttons: [{ text: 'X', role: 'cancel' }],
      });
    });
  });
});
