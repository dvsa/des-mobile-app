import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from '@app/app.module';
import { QuestionFooterComponent } from '../question-footer';

describe('QuestionFooterComponent', () => {
  let fixture: ComponentFixture<QuestionFooterComponent>;
  let component: QuestionFooterComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        QuestionFooterComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(QuestionFooterComponent);
    component = fixture.componentInstance;
  }));

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
      spyOn(component.questionPageChange, 'emit');
      component.questionNumber = 3;
      component.goToPreviousQuestion();
      expect(component.questionPageChange.emit).toHaveBeenCalledWith(2);
    });
  });

  describe('goToNextQuestion', () => {
    it('should add one to the question number and emit the value', () => {
      spyOn(component.questionPageChange, 'emit');
      component.questionNumber = 3;
      component.goToNextQuestion();
      expect(component.questionPageChange.emit).toHaveBeenCalledWith(4);
    });
  });

});
