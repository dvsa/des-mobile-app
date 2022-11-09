import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { QuestionProvider } from '@providers/question/question';
import { AppModule } from '@app/app.module';
import { QuestionProviderMock } from '@providers/question/__mocks__/question.mock';
import { configureTestSuite } from 'ng-bullet';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import {
  UntypedFormControl, UntypedFormGroup, ReactiveFormsModule, Validators,
} from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  TrainingRecordsCatAdiPart2Component,
} from '@pages/waiting-room-to-car/cat-adi-part2/components/training-records/training-records.cat-adi-part2';

describe('TrainingRecordsCatAdiPart2Component', () => {
  let component: TrainingRecordsCatAdiPart2Component;
  let fixture: ComponentFixture<TrainingRecordsCatAdiPart2Component>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        TrainingRecordsCatAdiPart2Component,
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
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(TrainingRecordsCatAdiPart2Component);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    component.formControl = new UntypedFormControl(null, [Validators.required]);
  }));

  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });

  describe('Class',
    () => {
      describe('ngOnChanges', () => {
        it('should have trainingRecordCtrl form control be added to '
                    + 'form if there is no form control already there', () => {
          component.formControl = null;
          component.ngOnChanges();
          expect(component.formGroup.controls.trainingRecordCtrl)
            .toBeTruthy();
        });
        it('should patch control with value stored in trainingRecordRadioChecked ', () => {
          component.trainingRecordRadioChecked = true;

          component.ngOnChanges();
          expect(component.formControl.value)
            .toEqual(true);
        });
      });

      describe('trainingRecordOutcomeChanged', () => {
        it('should emit true if trainingRecorded is set to "Y" and formControl is valid', () => {
          spyOn(component.trainingRecordOutcomeChange, 'emit');
          component.formControl.setValue(1);
          component.trainingRecordOutcomeChanged('Y');
          expect(component.trainingRecordOutcomeChange.emit)
            .toHaveBeenCalledWith(true);
        });
        it('should emit false if orditTrained is set to "N" and formControl is valid', () => {
          spyOn(component.trainingRecordOutcomeChange, 'emit');
          component.formControl.setValue(1);
          component.trainingRecordOutcomeChanged('N');
          expect(component.trainingRecordOutcomeChange.emit)
            .toHaveBeenCalledWith(false);
        });
      });

      describe('invalid', () => {
        it('should return true if the formControl is invalid and dirty', () => {
          component.formControl.setValue(null);
          component.formControl.markAsDirty();

          expect(component.invalid)
            .toBeTruthy();
        });
        it('should return false if the formControl is valid and dirty', () => {
          component.formControl.setValue(1);
          component.formControl.markAsDirty();

          expect(component.invalid)
            .toBeFalsy();
        });
        it('should return false if the formControl is invalid and clean', () => {
          component.formControl.setValue(null);
          component.formControl.markAsPristine();

          expect(component.invalid)
            .toBeFalsy();
        });
        it('should return false if the formControl is valid and clean', () => {
          component.formControl.setValue(1);
          component.formControl.markAsPristine();

          expect(component.invalid)
            .toBeFalsy();
        });
      });
    });
});
