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
  FormControl,
  FormGroup, ReactiveFormsModule, Validators,
} from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DualControlsComponent } from '@pages/waiting-room-to-car/cat-adi-part3/components/dual-controls/dual-controls';

describe('DualControlsComponent', () => {
  let component: DualControlsComponent;
  let fixture: ComponentFixture<DualControlsComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        DualControlsComponent,
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
    fixture = TestBed.createComponent(DualControlsComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
    component.formControl = new FormControl(null, [Validators.required]);
  }));

  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });

  describe('Class',
    () => {
      describe('ngOnChanges', () => {
        it('should have fieldName form control be added to '
                    + 'form if there is no form control already there', () => {
          component.formControl = null;
          component.ngOnChanges();

          expect(component.formGroup.controls[DualControlsComponent.fieldName])
            .toBeTruthy();
        });
        it('should patch control with value stored in trainingRecordRadioChecked ', () => {
          component.dualControls = true;

          component.ngOnChanges();
          expect(component.formControl.value)
            .toEqual('true');
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

      describe('dualControlsChanged', () => {
        it('should emit the correct event with false if it is not passed the word true', () => {
          spyOn(component.dualControlsChange, 'emit');
          component.dualControlsChanged('test');
          expect(component.dualControlsChange.emit).toHaveBeenCalledWith(false);
        });
        it('should emit the correct event with true if it is passed the word true', () => {
          spyOn(component.dualControlsChange, 'emit');
          component.dualControlsChanged('true');
          expect(component.dualControlsChange.emit).toHaveBeenCalledWith(true);
        });
      });
    });
});
