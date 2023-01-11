import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { QuestionProvider } from '@providers/question/question';
import { AppModule } from '@app/app.module';
import { QuestionProviderMock } from '@providers/question/__mocks__/question.mock';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import {
  UntypedFormControl,
  UntypedFormGroup, ReactiveFormsModule, Validators,
} from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  TellMeQuestionCardComponent,
} from '@pages/waiting-room-to-car/cat-b/components/tell-me-question-card/tell-me-question-card';

describe('TellMeQuestionCardComponent', () => {
  let component: TellMeQuestionCardComponent;
  let fixture: ComponentFixture<TellMeQuestionCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        TellMeQuestionCardComponent,
      ],
      imports: [
        AppModule,
        ReactiveFormsModule,
      ],
      providers: [
        {
          provide: RouteByCategoryProvider,
          useClass: RouteByCategoryProviderMock,
        },
        {
          provide: AuthenticationProvider,
          useClass: AuthenticationProviderMock,
        },
        {
          provide: DateTimeProvider,
          useClass: DateTimeProviderMock,
        },
        {
          provide: QuestionProvider,
          useClass: QuestionProviderMock,
        },
        {
          provide: FaultCountProvider,
          useClass: FaultCountProvider,
        },
      ],
    });

    fixture = TestBed.createComponent(TellMeQuestionCardComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Class', () => {
    describe('tellMeQuestionChanged', () => {
      it('should emit the correct event with the parameter given', () => {
        spyOn(component.tellMeQuestionChange, 'emit');
        component.tellMeQuestionChanged({
          code: 'A',
          description: 'B',
          shortName: 'C',
        });
        expect(component.tellMeQuestionChange.emit).toHaveBeenCalledWith({
          code: 'A',
          description: 'B',
          shortName: 'C',
        });
      });
    });
    describe('tellMeQuestionOutcomeChanged', () => {
      it('should emit the correct event with the parameter given', () => {
        spyOn(component.tellMeQuestionOutcomeChange, 'emit');
        component.tellMeQuestionOutcomeChanged('test');
        expect(component.tellMeQuestionOutcomeChange.emit).toHaveBeenCalledWith('test');
      });
    });
    describe('questionInvalid', () => {
      it('should return false if there is no tellMeQuestion', () => {
        component.formGroup.controls.tellMeQuestion = null;
        expect(component.questionInvalid).toBeFalsy();
      });
      it('should return true if there is a tellMeQuestion and the outcome is both not valid and dirty', () => {
        const formControl = new UntypedFormControl(null, [Validators.required]);
        component.formGroup.addControl('tellMeQuestion', formControl);
        component.formGroup.controls.tellMeQuestion.markAsDirty();
        expect(component.questionInvalid).toBeTruthy();
      });
      it('should return false if there is a tellMeQuestion and the outcome is both valid and dirty', () => {
        const formControl = new UntypedFormControl(1, [Validators.required]);
        component.formGroup.addControl('tellMeQuestion', formControl);
        component.formGroup.controls.tellMeQuestion.markAsDirty();
        expect(component.questionInvalid).toBeFalsy();
      });
      it('should return false if there is a tellMeQuestion and the outcome is both valid and clean', () => {
        const formControl = new UntypedFormControl(1, [Validators.required]);
        component.formGroup.addControl('tellMeQuestion', formControl);
        component.formGroup.controls.tellMeQuestion.markAsPristine();
        expect(component.questionInvalid).toBeFalsy();
      });
      it('should return false if there is a tellMeQuestion and the outcome is both not valid and clean', () => {
        const formControl = new UntypedFormControl(null, [Validators.required]);
        component.formGroup.addControl('tellMeQuestion', formControl);
        component.formGroup.controls.tellMeQuestion.markAsPristine();
        expect(component.questionInvalid).toBeFalsy();
      });
    });

    describe('outcomeInvalid', () => {
      it('should return false if there is no tellMeQuestion', () => {
        component.formGroup.controls.tellMeQuestionOutcome = null;
        expect(component.outcomeInvalid).toBeFalsy();
      });
      it('should return true if there is a tellMeQuestionOutcome and the outcome is both not valid and dirty', () => {
        const formControl = new UntypedFormControl(null, [Validators.required]);
        component.formGroup.addControl('tellMeQuestionOutcome', formControl);
        component.formGroup.controls.tellMeQuestionOutcome.markAsDirty();
        expect(component.outcomeInvalid).toBeTruthy();
      });
      it('should return false if there is a tellMeQuestionOutcome and the outcome is both valid and dirty', () => {
        const formControl = new UntypedFormControl(1, [Validators.required]);
        component.formGroup.addControl('tellMeQuestionOutcome', formControl);
        component.formGroup.controls.tellMeQuestionOutcome.markAsDirty();
        expect(component.outcomeInvalid).toBeFalsy();
      });
      it('should return false if there is a tellMeQuestionOutcome and the outcome is both valid and clean', () => {
        const formControl = new UntypedFormControl(1, [Validators.required]);
        component.formGroup.addControl('tellMeQuestionOutcome', formControl);
        component.formGroup.controls.tellMeQuestionOutcome.markAsPristine();
        expect(component.outcomeInvalid).toBeFalsy();
      });
      it('should return false if there is a tellMeQuestionOutcome and the outcome is both not valid and clean', () => {
        const formControl = new UntypedFormControl(null, [Validators.required]);
        component.formGroup.addControl('tellMeQuestionOutcome', formControl);
        component.formGroup.controls.tellMeQuestionOutcome.markAsPristine();
        expect(component.outcomeInvalid).toBeFalsy();
      });
    });
  });
});
