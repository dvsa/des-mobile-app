
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { SafetyQuestionComponent } from '../safety-question';
import { AppModule } from '../../../../../../app/app.module';
import { SafetyQuestion } from '../../../../../../providers/question/safety-question.model';
import { EventEmitter } from '@angular/core';
import { configureTestSuite } from 'ng-bullet';

const safetyQuestion: SafetyQuestion = {
  description: 'Fuel cutoff',
};

describe('SafetyQuestionComponent', () => {
  let fixture: ComponentFixture<SafetyQuestionComponent>;
  let component: SafetyQuestionComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        SafetyQuestionComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SafetyQuestionComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('safetyQuestionPassSelected', () => {
      it('should emit the correct event', () => {
        component.safetyQuestionOutcomeChange = new EventEmitter();
        spyOn(component.safetyQuestionOutcomeChange, 'emit');

        component.safetyQuestionsPassSelected();

        expect(component.safetyQuestionOutcomeChange.emit).toHaveBeenCalledWith('P');
      });
    });
    describe('safetyQuestionsDrivingFaultSelected', () => {
      it('should emit the correct event', () => {
        component.safetyQuestionOutcomeChange = new EventEmitter();
        spyOn(component.safetyQuestionOutcomeChange, 'emit');

        component.safetyQuestionsDrivingFaultSelected();

        expect(component.safetyQuestionOutcomeChange.emit).toHaveBeenCalledWith('DF');
      });
    });
    describe('findQuestion', () => {
      it('should return the question if it is found', () => {
        component.questions = [safetyQuestion];
        component.questionResult = { description: 'Fuel cutoff' };
        expect(component.findQuestion()).toEqual(safetyQuestion);
      });
      it('should return undefined if the question is not found', () => {
        component.questions = [safetyQuestion];
        component.questionResult = { description: 'Bad question' };
        expect(component.findQuestion()).toEqual(undefined);
      });
    });
  });

  describe('DOM', () => {

  });
});
