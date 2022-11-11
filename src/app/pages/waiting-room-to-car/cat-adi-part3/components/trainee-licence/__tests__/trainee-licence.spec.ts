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
  TraineeLicenceComponent,
} from '@pages/waiting-room-to-car/cat-adi-part3/components/trainee-licence/trainee-licence';

describe('TraineeLicenceComponent', () => {
  let component: TraineeLicenceComponent;
  let fixture: ComponentFixture<TraineeLicenceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        TraineeLicenceComponent,
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

    fixture = TestBed.createComponent(TraineeLicenceComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    component.formControl = new UntypedFormControl(null, [Validators.required]);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Class',
    () => {
      describe('ngOnChanges', () => {
        it('should have fieldName form control be added to '
                    + 'form if there is no form control already there', () => {
          component.formControl = null;
          component.ngOnChanges();

          expect(component.formGroup.controls[TraineeLicenceComponent.fieldName])
            .toBeTruthy();
        });
        it('should patch control with value stored in pdiLogbook ', () => {
          component.traineeLicence = true;

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

      describe('traineeLicenceChanged', () => {
        it('should emit the correct event with false if it is not passed the word true', () => {
          spyOn(component.traineeLicenceChange, 'emit');
          component.traineeLicenceChanged('test');
          expect(component.traineeLicenceChange.emit).toHaveBeenCalledWith(false);
        });
        it('should emit the correct event with true if it is passed the word true', () => {
          spyOn(component.traineeLicenceChange, 'emit');
          component.traineeLicenceChanged('true');
          expect(component.traineeLicenceChange.emit).toHaveBeenCalledWith(true);
        });
      });
    });
});
