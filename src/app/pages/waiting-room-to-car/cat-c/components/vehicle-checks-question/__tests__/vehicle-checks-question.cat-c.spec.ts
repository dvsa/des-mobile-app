import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { EventEmitter } from '@angular/core';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from '@app/app.module';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import { VehicleChecksQuestionCatCComponent } from '../vehicle-checks-question.cat-c';

const vehicleChecksQuestion: VehicleChecksQuestion = {
  code: 'S04',
  description: 'Show me how you would check the parking brake for excessive wear.',
  shortName: 'Parking brake',
};

describe('VehicleChecksQuestionComponent', () => {
  let fixture: ComponentFixture<VehicleChecksQuestionCatCComponent>;
  let component: VehicleChecksQuestionCatCComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        VehicleChecksQuestionCatCComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(VehicleChecksQuestionCatCComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('isOptionDisabled', () => {
      it(`should return true if the question is in the list of questions to disable
          and not equal to the currently selected question`,
      () => {
        component.questionResult = { code: 'S03' };
        component.questionsToDisable = [
          vehicleChecksQuestion,
        ];
        const result = component.isOptionDisabled({ code: 'S04', description: '', shortName: '' });
        expect(result).toEqual(true);
      });
      it('should return false if the question is not in the list of questions to disable', () => {
        component.questionResult = { code: 'S04' };
        component.questionsToDisable = [];
        const result = component.isOptionDisabled({ code: 'S04', description: '', shortName: '' });
        expect(result).toEqual(false);
      });
      it(`should return false if the question is not in the list of questions to disable
          and is equal to the currently selected question`,
      () => {
        component.questionResult = { code: 'S05' };
        component.questionsToDisable = [{ code: 'S04' }];
        const result = component.isOptionDisabled({ code: 'S05', description: '', shortName: '' });
        expect(result).toEqual(false);
      });
    });
    describe('vehicleChecksQuestionChanged', () => {
      it('should emit the correct event', () => {
        component.vehicleChecksQuestionChange = new EventEmitter();
        spyOn(component.vehicleChecksQuestionChange, 'emit');
        component.vehicleChecksQuestionChanged(vehicleChecksQuestion);
        expect(component.vehicleChecksQuestionChange.emit).toHaveBeenCalledWith({
          code: 'S04',
          description: 'Parking brake',
        });
      });
    });
    describe('vehicleChecksPassSelected', () => {
      it('should emit the correct event', () => {
        component.vehicleChecksQuestionOutcomeChange = new EventEmitter();
        spyOn(component.vehicleChecksQuestionOutcomeChange, 'emit');
        component.vehicleChecksPassSelected();
        expect(component.vehicleChecksQuestionOutcomeChange.emit).toHaveBeenCalledWith('P');
      });
    });
    describe('vehicleChecksDrivingFaultSelected', () => {
      it('should emit the correct event', () => {
        component.vehicleChecksQuestionOutcomeChange = new EventEmitter();
        spyOn(component.vehicleChecksQuestionOutcomeChange, 'emit');
        component.vehicleChecksDrivingFaultSelected();
        expect(component.vehicleChecksQuestionOutcomeChange.emit).toHaveBeenCalledWith('DF');
      });
    });
    describe('findQuestion', () => {
      it('should return the question if it is found', () => {
        component.questions = [vehicleChecksQuestion];
        component.questionResult = { code: 'S04' };
        expect(component.findQuestion()).toEqual(vehicleChecksQuestion);
      });
      it('should return undefined if the question is not found', () => {
        component.questions = [vehicleChecksQuestion];
        component.questionResult = { code: 'B04' };
        expect(component.findQuestion()).toEqual(undefined);
      });
    });
    describe('shouldShowOutcomeFields', () => {
      it('should return true if all the required data is present', () => {
        component.questionResult = {
          code: 'S04',
          description: 'Test',
        } as QuestionResult;
        expect(component.shouldShowOutcomeFields()).toEqual(true);
      });
      it('should return false if question result is not defined', () => {
        expect(component.shouldShowOutcomeFields()).toEqual(false);
      });
      it('should return false if all the question code is missing from the result object', () => {
        component.questionResult = {
          description: 'Test',
        } as QuestionResult;
        expect(component.shouldShowOutcomeFields()).toEqual(false);
      });
      it('should return false if all the question description is missing from the result object', () => {
        component.questionResult = {
          code: 'S04',
        } as QuestionResult;
        expect(component.shouldShowOutcomeFields()).toEqual(false);
      });
    });
  });
});
