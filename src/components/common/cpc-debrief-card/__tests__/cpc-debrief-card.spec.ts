import { Question } from '@dvsa/mes-test-schema/categories/CPC';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { IonicModule } from '@ionic/angular';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AppModule } from '@app/app.module';
import { CPCDebriefCardComponent } from '../cpc-debrief-card';
import { ComponentsModule } from '../../common-components.module';

describe('CPCDebriefCardComponent', () => {
  let fixture: ComponentFixture<CPCDebriefCardComponent>;
  let component: CPCDebriefCardComponent;
  let question: Question;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule,
        AppModule,
        ComponentsModule,
        StoreModule.forRoot({}),
        TranslateModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(CPCDebriefCardComponent);
    component = fixture.componentInstance;
    question = {
      questionCode: 'Q12',
      subtitle: 'Show me: ',
      answer1: {
        selected: true,
        label: '',
      },
      answer2: {
        selected: true,
        label: '',
      },
      answer3: {
        selected: true,
        label: '',
      },
      answer4: {
        selected: true,
        label: '',
      },
      additionalItems: [],
      title: 'Loading the vehicle',
      score: 20,
    };
  }));

  describe('getFormattedQuestion', () => {
    it('should return correct format', () => {
      const result = component.getFormattedQuestion(question);
      expect(result).toEqual('Q12 - Loading the vehicle');
    });
  });

  describe('getQuestionPercentage', () => {
    it('should return the correct percentage', () => {
      const result = component.getQuestionPercentage(question);
      expect(result).toEqual(20);
    });
  });

  describe('shouldTickBox', () => {
    it('should return true when the question score is 15 or greater.', () => {
      const result = component.shouldTickBox(question);
      expect(result).toEqual(true);
    });
    it('should return false when the question score is less than 15', () => {
      question.score = 14;
      const result = component.shouldTickBox(question);
      expect(result).toEqual(false);
    });
  });

  describe('isPass', () => {
    it('should return true if the testOutcome equals Pass', () => {
      component.testOutcome = 'Pass';
      expect(component.isPass()).toEqual(true);
    });
    it('should return false if the testOutcome does not equal Pass', () => {
      component.testOutcome = 'Fail';
      expect(component.isPass()).toEqual(false);
    });
  });

  describe('cardHeader', () => {
    it('should display the header as Debrief if it is a detailed test view', () => {
      component.isDetailedTestView = true;
      expect(component.getCardHeader()).toEqual('Debrief');
    });

    it('should display the header as Test details if it is not a detailed test view', () => {
      component.isDetailedTestView = false;
      expect(component.getCardHeader()).toEqual('Test details');
    });
  });
});
