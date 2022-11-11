import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { EventEmitter } from '@angular/core';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import {
  VehicleChecksQuestionCatAMod2Component,
} from '@pages/waiting-room-to-car/cat-a-mod2/components/vehicle-checks-question/vehicle-checks-question';
import { AppModule } from '@app/app.module';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

const safetyAndBalanceQuestion: VehicleChecksQuestion = {
  code: 'S04',
  description: 'Show me how you would check the parking brake for excessive wear.',
  shortName: 'Parking brake',
};

describe('VehicleChecksQuestionCatAMod2Component', () => {
  let fixture: ComponentFixture<VehicleChecksQuestionCatAMod2Component>;
  let component: VehicleChecksQuestionCatAMod2Component;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        VehicleChecksQuestionCatAMod2Component,
      ],
      imports: [
        IonicModule,
        AppModule,
      ],
    });

    fixture = TestBed.createComponent(VehicleChecksQuestionCatAMod2Component);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
  }));

  describe('Class', () => {
    describe('ngOnChanges', () => {
      it('should have questionFormControl form control be added to '
                + 'form if there is no form control already there', () => {
        component.questionFormControl = null;
        component.ngOnChanges();
        expect(component.formGroup.controls[component.questionFieldName])
          .toBe(component.questionFormControl);
      });
      it('should have questionOutcomeFormControl form control be added to '
                + 'form if there is no form control already there', () => {
        component.questionOutcomeFormControl = null;
        component.ngOnChanges();
        expect(component.formGroup.controls[component.questionOutcomeFieldName])
          .toBe(component.questionOutcomeFormControl);
      });
      it('should have questionFormControl form control be patched with '
                + 'findQuestion() if questionResult is already valid', () => {
        spyOn(component, 'findQuestion')
          .and
          .returnValue({
            shortName: 'shortName',
            code: 'test',
            description: 'Description',
          });
        component.questionResult = {
          outcome: 'P',
          code: 'test',
          description: 'Description',
        };
        component.questionFormControl = new UntypedFormControl();
        component.ngOnChanges();
        expect(component.questionFormControl.value)
          .toBe(component.findQuestion());
      });
      it('should have questionOutcomeFormControl form control be patched with '
                + 'questionResult.outcome if questionResult is already valid', () => {
        spyOn(component, 'findQuestion')
          .and
          .returnValue({
            shortName: 'shortName',
            code: 'test',
            description: 'Description',
          });
        component.questionResult = {
          outcome: 'P',
          code: 'test',
          description: 'Description',
        };
        component.questionOutcomeFormControl = new UntypedFormControl();
        component.ngOnChanges();
        expect(component.questionOutcomeFormControl.value)
          .toBe(component.questionResult.outcome);
      });
    });
    describe('isOptionDisabled', () => {
      it(`should return true if the question is in the list of questions to disable
          and not equal to the currently selected question`,
      () => {
        component.questionResult = { code: 'S03' };
        component.questionsToDisable = [
          safetyAndBalanceQuestion,
        ];
        const result = component.isOptionDisabled({
          code: 'S04',
          description: '',
          shortName: '',
        });
        expect(result)
          .toEqual(true);
      });
      it('should return false if the question is not in the list of questions to disable', () => {
        component.questionResult = { code: 'S04' };
        component.questionsToDisable = [];
        const result = component.isOptionDisabled({
          code: 'S04',
          description: '',
          shortName: '',
        });
        expect(result)
          .toEqual(false);
      });
      it(`should return false if the question is not in the list of questions to disable
          and is equal to the currently selected question`,
      () => {
        component.questionResult = { code: 'S05' };
        component.questionsToDisable = [{ code: 'S04' }];
        const result = component.isOptionDisabled({
          code: 'S05',
          description: '',
          shortName: '',
        });
        expect(result)
          .toEqual(false);
      });
    });
    describe('safetyAndBalanceQuestionChanged', () => {
      it('should return if there is no safetyAndBalanceQuestion', () => {
        component.safetyAndBalanceQuestionChanged(null);
        expect(component.safetyAndBalanceQuestionChanged(null))
          .toEqual(undefined);

        spyOn(component.safetyAndBalanceQuestionChange, 'emit');

        component.safetyAndBalanceQuestionChanged(null);

        expect(component.safetyAndBalanceQuestionChange.emit).not.toHaveBeenCalled();
      });
      it('should emit the correct event', () => {
        component.safetyAndBalanceQuestionChange = new EventEmitter();
        spyOn(component.safetyAndBalanceQuestionChange, 'emit');

        component.safetyAndBalanceQuestionChanged(safetyAndBalanceQuestion);

        expect(component.safetyAndBalanceQuestionChange.emit)
          .toHaveBeenCalledWith({
            code: 'S04',
            description: 'Parking brake',
          });
      });
    });
    describe('safetyAndBalancePassSelected', () => {
      it('should emit the correct event', () => {
        component.safetyAndBalanceQuestionOutcomeChange = new EventEmitter();
        spyOn(component.safetyAndBalanceQuestionOutcomeChange, 'emit');

        component.safetyAndBalancePassSelected();

        expect(component.safetyAndBalanceQuestionOutcomeChange.emit)
          .toHaveBeenCalledWith('P');
      });
    });
    describe('safetyAndBalanceDrivingFaultSelected', () => {
      it('should emit the correct event', () => {
        component.safetyAndBalanceQuestionOutcomeChange = new EventEmitter();
        spyOn(component.safetyAndBalanceQuestionOutcomeChange, 'emit');

        component.safetyAndBalanceDrivingFaultSelected();

        expect(component.safetyAndBalanceQuestionOutcomeChange.emit)
          .toHaveBeenCalledWith('DF');
      });
    });
    describe('findQuestion', () => {
      it('should return the question if it is found', () => {
        component.questions = [safetyAndBalanceQuestion];
        component.questionResult = { code: 'S04' };
        expect(component.findQuestion())
          .toEqual(safetyAndBalanceQuestion);
      });
      it('should return undefined if the question is not found', () => {
        component.questions = [safetyAndBalanceQuestion];
        component.questionResult = { code: 'B04' };
        expect(component.findQuestion())
          .toEqual(undefined);
      });
    });
    describe('shouldShowOutcomeFields', () => {
      it('should return true if all the required data is present', () => {
        component.questionResult = {
          code: 'S04',
          description: 'Test',
        } as QuestionResult;

        expect(component.shouldShowOutcomeFields())
          .toEqual(true);
      });
      it('should return false if question result is not defined', () => {
        expect(component.shouldShowOutcomeFields())
          .toEqual(false);
      });
      it('should return false if all the question code is missing from the result object', () => {
        component.questionResult = {
          description: 'Test',
        } as QuestionResult;

        expect(component.shouldShowOutcomeFields())
          .toEqual(false);
      });
      it('should return false if all the question description is missing from the result object', () => {
        component.questionResult = {
          code: 'S04',
        } as QuestionResult;

        expect(component.shouldShowOutcomeFields())
          .toEqual(false);
      });
    });
  });
});
