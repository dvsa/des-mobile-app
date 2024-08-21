import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { AppModule } from '@app/app.module';
import { IonicModule } from '@ionic/angular';
import { SafetyQuestion } from '@providers/question/safety-question.model';
import { SafetyQuestionComponent } from '../safety-question';

const safetyQuestion: SafetyQuestion = {
  description: 'Fuel cutoff',
};

describe('SafetyQuestionComponent', () => {
  let fixture: ComponentFixture<SafetyQuestionComponent>;
  let component: SafetyQuestionComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SafetyQuestionComponent],
      imports: [IonicModule, AppModule],
    });

    fixture = TestBed.createComponent(SafetyQuestionComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
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
    describe('ngOnChanges', () => {
      it(
        'should have safetyQuestionFormControl form control be added to ' +
          'form if there is no form control already there',
        () => {
          component.safetyQuestionFormControl = null;
          component.ngOnChanges();
          expect(component.formGroup.controls[component.safetyQuestionFieldName]).toBe(
            component.safetyQuestionFormControl
          );
        }
      );
      it(
        'should have safetyQuestionFormControl form control be patched with ' +
          'findQuestion() if questionResult is already valid',
        () => {
          spyOn(component, 'findQuestion').and.returnValue({
            outcome: 'P',
            description: 'Description',
          });
          component.questionResult = {
            outcome: 'P',
            description: 'Description',
          };
          component.safetyQuestionFormControl = new UntypedFormControl();
          component.ngOnChanges();
          expect(component.safetyQuestionFormControl.value).toBe(component.findQuestion());
        }
      );
      it(
        'should have safetyQuestionOutcomeFormControl form control be patched with ' +
          'questionResult.outcome if questionResult is already valid',
        () => {
          spyOn(component, 'findQuestion').and.returnValue({
            outcome: 'P',
            description: 'Description',
          });
          component.questionResult = {
            outcome: 'P',
            description: 'Description',
          };
          component.safetyQuestionOutcomeFormControl = new UntypedFormControl();
          component.ngOnChanges();
          expect(component.safetyQuestionOutcomeFormControl.value).toBe(component.questionResult.outcome);
        }
      );
    });
  });
});
