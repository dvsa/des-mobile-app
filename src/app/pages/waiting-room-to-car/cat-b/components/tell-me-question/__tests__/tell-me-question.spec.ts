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
import { TellMeQuestionComponent } from '@pages/waiting-room-to-car/cat-b/components/tell-me-question/tell-me-question';

describe('TellMeQuestionComponent', () => {
  let component: TellMeQuestionComponent;
  let fixture: ComponentFixture<TellMeQuestionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        TellMeQuestionComponent,
      ],
      imports: [
        AppModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: QuestionProvider, useClass: QuestionProviderMock },
        { provide: FaultCountProvider, useClass: FaultCountProvider },
      ],
    });

    fixture = TestBed.createComponent(TellMeQuestionComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    component.formControl = new UntypedFormControl(null, [Validators.required]);
  }));

  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });

  describe('Class', () => {
    describe('ngOnChanges', () => {
      it('should have fieldName form control be added to form if there is no form control already there', () => {
        component.formControl = null;
        component.ngOnChanges();
        expect(component.formGroup.controls.tellMeQuestion).toBeTruthy();
      });
    });

    describe('invalid', () => {
      it('should return true if the formControl is invalid and dirty', () => {
        component.formControl.setValue(null);
        component.formControl.markAsDirty();
        expect(component.invalid).toBeTruthy();
      });
      it('should return false if the formControl is valid and dirty', () => {
        component.formControl.setValue(1);
        component.formControl.markAsDirty();
        expect(component.invalid).toBeFalsy();
      });
      it('should return false if the formControl is invalid and clean', () => {
        component.formControl.setValue(null);
        component.formControl.markAsPristine();
        expect(component.invalid).toBeFalsy();
      });
      it('should return false if the formControl is valid and clean', () => {
        component.formControl.setValue(1);
        component.formControl.markAsPristine();
        expect(component.invalid).toBeFalsy();
      });
    });

    describe('tellMeQuestionChanged', () => {
      it('should emit the correct event with the parameter given when form control is valid', () => {
        component.formControl.setValue(1);
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
      it('should emit nothing if form control is invalid', () => {
        spyOn(component.tellMeQuestionChange, 'emit');
        component.formControl.setValue(null);
        expect(component.tellMeQuestionChange.emit).not.toHaveBeenCalled();
      });
    });
  });
});
