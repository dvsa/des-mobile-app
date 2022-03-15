import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AppModule } from '@app/app.module';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import { EventEmitter } from '@angular/core';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { configureTestSuite } from 'ng-bullet';
import { VehicleChecksQuestionComponent } from '../vehicle-checks-question.cat-adi-part2';

const vehicleChecksQuestion: VehicleChecksQuestion = {
  code: 'T4',
  // tslint:disable-next-line:max-line-length
  description: 'Tell me how you would check the tyres to ensure that they have sufficient tread depth '
      + 'and that their general condition is safe to use on the road.',
  shortName: 'Sufficient tread',
};

describe('VehicleChecksQuestionComponent', () => {
  let fixture: ComponentFixture<VehicleChecksQuestionComponent>;
  let component: VehicleChecksQuestionComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        VehicleChecksQuestionComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VehicleChecksQuestionComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('isOptionDisabled', () => {
      it(`should return true if the question is in the list of questions to disable
          and not equal to the currently selected question`,
      () => {
        component.questionResult = { code: 'T3' };
        component.questionsToDisable = [
          vehicleChecksQuestion,
        ];
        const result = component.isOptionDisabled({ code: 'T4', description: '', shortName: '' });
        expect(result).toEqual(true);
      });
      it('should return false if the question is not in the list of questions to disable', () => {
        component.questionResult = { code: 'T4' };
        component.questionsToDisable = [];
        const result = component.isOptionDisabled({ code: 'T4', description: '', shortName: '' });
        expect(result).toEqual(false);
      });
      it(`should return false if the question is not in the list of questions to disable
          and is equal to the currently selected question`,
      () => {
        component.questionResult = { code: 'T5' };
        component.questionsToDisable = [{ code: 'T4' }];
        const result = component.isOptionDisabled({ code: 'T5', description: '', shortName: '' });
        expect(result).toEqual(false);
      });
    });
    describe('vehicleChecksQuestionChanged', () => {
      it('should emit the correct event', () => {
        component.vehicleChecksQuestionChange = new EventEmitter();
        spyOn(component.vehicleChecksQuestionChange, 'emit');

        component.vehicleChecksQuestionChanged(vehicleChecksQuestion);

        expect(component.vehicleChecksQuestionChange.emit).toHaveBeenCalledWith({
          code: 'T4',
          description: 'Sufficient tread',
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
        component.questionResult = { code: 'T4' };
        expect(component.findQuestion()).toEqual(vehicleChecksQuestion);
      });
      it('should return undefined if the question is not found', () => {
        component.questions = [vehicleChecksQuestion];
        component.questionResult = { code: 'B4' };
        expect(component.findQuestion()).toEqual(undefined);
      });
    });
    describe('shouldShowOutcomeFields', () => {
      it('should return true if all the required data is present', () => {
        component.questionResult = {
          code: 'T4',
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
          code: 'T4',
        } as QuestionResult;

        expect(component.shouldShowOutcomeFields()).toEqual(false);
      });
    });
  });
});
