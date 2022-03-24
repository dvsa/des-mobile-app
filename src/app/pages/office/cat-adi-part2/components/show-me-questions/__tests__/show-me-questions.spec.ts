import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../../../app/app.module';
import { ShowMeQuestionsCatADI2Component } from '../show-me-questions';
import { VehicleChecksQuestion } from '../../../../../../providers/question/vehicle-checks-question.model';
import { CompetencyOutcome } from '../../../../../../shared/models/competency-outcome';

const vehicleChecksQuestion: VehicleChecksQuestion = {
  code: 'A15',
  description: 'When it is safe to do so can you show me how you wash and clean the rear windscreen.',
  shortName: 'Rear windscreen',
};

describe('ShowMeQuestionsCatADI2Component', () => {
  let fixture: ComponentFixture<ShowMeQuestionsCatADI2Component>;
  let component: ShowMeQuestionsCatADI2Component;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        ShowMeQuestionsCatADI2Component,
      ],
      imports: [
        IonicModule,
        AppModule,
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ShowMeQuestionsCatADI2Component);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('isOptionDisabled', () => {
      it('should return false if the question code is N/A', () => {
        const result = component.isOptionDisabled({ code: 'N/A', description: '', shortName: '' });
        expect(result).toEqual(false);
      });
      it(`should return true if the question is in the list of questions to disable
          and not equal to the currently selected question`,
        () => {
          component.questionResult = { code: 'A14' };
          component.questionsToDisable = [
            vehicleChecksQuestion,
          ];
          const result = component.isOptionDisabled({ code: 'A15', description: '', shortName: '' });
          expect(result).toEqual(true);
        });
      it('should return false if the question is not in the list of questions to disable', () => {
        component.questionResult = { code: 'A15' };
        component.questionsToDisable = [];
        const result = component.isOptionDisabled({ code: 'A15', description: '', shortName: '' });
        expect(result).toEqual(false);
      });
      it(`should return false if the question is not in the list of questions to disable
          and is equal to the currently selected question`,
        () => {
          component.questionResult = { code: 'A15' };
          component.questionsToDisable = [{ code: 'A15' }];
          const result = component.isOptionDisabled({ code: 'A15', description: '', shortName: '' });
          expect(result).toEqual(false);
        });
    });

    describe('vehicleChecksQuestionChanged', () => {
      it('should emit the correct event', () => {
        component.showMeQuestionsChange = new EventEmitter();
        spyOn(component.showMeQuestionsChange, 'emit');
        component.questionResult = {
          outcome: 'P',
        },
        component.showMeQuestionsChanged(vehicleChecksQuestion);
        expect(component.showMeQuestionsChange.emit).toHaveBeenCalledWith({
          code: 'A15',
          description: 'Rear windscreen',
          outcome: 'P',
        });
      });
    });

    describe('showMeOutcomeChanged', () => {
      it('should emit the correct event', () => {
        component.showMeQuestionsChange = new EventEmitter();
        spyOn(component.showMeQuestionsChange, 'emit');
        component.questionResult = {
          code: 'A15',
          description: 'Rear windscreen',
        },
          component.showMeOutcomeChanged(CompetencyOutcome.P);
        expect(component.showMeQuestionsChange.emit).toHaveBeenCalledWith({
          code: 'A15',
          description: 'Rear windscreen',
          outcome: 'P',
        });
      });
    });

    describe('findQuestion', () => {
      it('should return the question if it is found', () => {
        component.questions = [vehicleChecksQuestion];
        component.questionResult = { code: 'A15' };
        expect(component.findQuestion()).toEqual(vehicleChecksQuestion);
      });
      it('should return undefined if the question is not found', () => {
        component.questions = [vehicleChecksQuestion];
        component.questionResult = { code: 'A17' };
        expect(component.findQuestion()).toEqual(undefined);
      });
    });

    describe('updateShowMeQuestionAttributes', () => {
      describe('when called with shouldEnableDisableFields as true', () => {
        it('should return checked as true and disabled as true when no S, no D and no DF', () => {
          component.serious = false;
          component.dangerous = false;
          component.drivingFaults = 0;
          component.questionNumber = 1;
          component.updateShowMeQuestionAttributes(true);
          expect(component.checked).toEqual(true);
          expect(component.disabled).toEqual(true);
        });
        it('should return checked as true and disabled as true when no S, no D and 1 DF when 2nd question', () => {
          component.serious = false;
          component.dangerous = false;
          component.drivingFaults = 1;
          component.questionNumber = 2;
          component.updateShowMeQuestionAttributes(true);
          expect(component.checked).toEqual(true);
          expect(component.disabled).toEqual(true);
        });

        it('should return checked as true and disabled as false when S, no D and 0 DF when 2nd question', () => {
          component.serious = true;
          component.dangerous = false;
          component.drivingFaults = 0;
          component.questionNumber = 2;
          component.updateShowMeQuestionAttributes(true);
          expect(component.checked).toEqual(true);
          expect(component.disabled).toEqual(false);
        });
        it('should return checked as true and disabled as false when no S, D and 0 DF when 2nd question', () => {
          component.serious = false;
          component.dangerous = true;
          component.drivingFaults = 0;
          component.questionNumber = 2;
          component.updateShowMeQuestionAttributes(true);
          expect(component.checked).toEqual(true);
          expect(component.disabled).toEqual(false);
        });

        it('should return checked as false and disabled as true when S, D and 0 DF', () => {
          component.serious = true;
          component.dangerous = true;
          component.drivingFaults = 0;
          component.questionNumber = 1;
          component.updateShowMeQuestionAttributes(true);
          expect(component.checked).toEqual(false);
          expect(component.disabled).toEqual(true);
        });
        it('should return checked as false and disabled as true when S, D and 1 DF', () => {
          component.serious = true;
          component.dangerous = true;
          component.drivingFaults = 1;
          component.questionNumber = 1;
          component.updateShowMeQuestionAttributes(true);
          expect(component.checked).toEqual(false);
          expect(component.disabled).toEqual(true);
        });
        it('should return checked as false and disabled as true when S, D and 2 DF', () => {
          component.serious = true;
          component.dangerous = true;
          component.drivingFaults = 2;
          component.questionNumber = 1;
          component.updateShowMeQuestionAttributes(true);
          expect(component.checked).toEqual(false);
          expect(component.disabled).toEqual(true);
        });
      });
      describe('when called with shouldEnableDisableFields as false', () => {
        it('should return checked as true and disabled unchanged when no S, no D and no DF', () => {
          component.serious = false;
          component.dangerous = false;
          component.drivingFaults = 0;
          component.questionNumber = 1;
          component.disabled = false;
          component.updateShowMeQuestionAttributes(false);
          expect(component.checked).toEqual(true);
          expect(component.disabled).toEqual(false);
        });
        it('should return checked as true and disabled unchanged when no S, no D and 1 DF when 2nd question', () => {
          component.serious = false;
          component.dangerous = false;
          component.drivingFaults = 1;
          component.questionNumber = 2;
          component.disabled = false;
          component.updateShowMeQuestionAttributes(false);
          expect(component.checked).toEqual(true);
          expect(component.disabled).toEqual(false);
        });

        it('should return checked as true and disabled unchanged when S, no D and 0 DF when 2nd question', () => {
          component.serious = true;
          component.dangerous = false;
          component.drivingFaults = 0;
          component.questionNumber = 2;
          component.disabled = true;
          component.updateShowMeQuestionAttributes(false);
          expect(component.checked).toEqual(true);
          expect(component.disabled).toEqual(true);
        });
        it('should return checked as true and disabled unchanged when no S, D and 0 DF when 2nd question', () => {
          component.serious = false;
          component.dangerous = true;
          component.drivingFaults = 0;
          component.questionNumber = 2;
          component.disabled = true;
          component.updateShowMeQuestionAttributes(false);
          expect(component.checked).toEqual(true);
          expect(component.disabled).toEqual(true);
        });

        it('should return checked as false and disabled unchanged when S, D and 0 DF', () => {
          component.serious = true;
          component.dangerous = true;
          component.drivingFaults = 0;
          component.questionNumber = 1;
          component.disabled = false;
          component.updateShowMeQuestionAttributes(false);
          expect(component.checked).toEqual(false);
          expect(component.disabled).toEqual(false);
        });
        it('should return checked as false and disabled unchanged when S, D and 1 DF', () => {
          component.serious = true;
          component.dangerous = true;
          component.drivingFaults = 1;
          component.questionNumber = 1;
          component.disabled = false;
          component.updateShowMeQuestionAttributes(false);
          expect(component.checked).toEqual(false);
          expect(component.disabled).toEqual(false);
        });
        it('should return checked as false and disabled unchanged when S, D and 2 DF', () => {
          component.serious = true;
          component.dangerous = true;
          component.drivingFaults = 2;
          component.questionNumber = 1;
          component.disabled = false;
          component.updateShowMeQuestionAttributes(false);
          expect(component.checked).toEqual(false);
          expect(component.disabled).toEqual(false);
        });

      });
    });
  });
});
