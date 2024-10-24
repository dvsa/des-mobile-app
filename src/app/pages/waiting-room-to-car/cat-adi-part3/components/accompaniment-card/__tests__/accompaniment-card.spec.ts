import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { AppModule } from '@app/app.module';
import { AccompanimentCardADI3Component } from '@pages/waiting-room-to-car/cat-adi-part3/components/accompaniment-card/accompaniment-card';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { QuestionProviderMock } from '@providers/question/__mocks__/question.mock';
import { QuestionProvider } from '@providers/question/question';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';

describe('AccompanimentCardADI3Component', () => {
  let component: AccompanimentCardADI3Component;
  let fixture: ComponentFixture<AccompanimentCardADI3Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [AccompanimentCardADI3Component],
      imports: [AppModule, ReactiveFormsModule],
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

    fixture = TestBed.createComponent(AccompanimentCardADI3Component);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Class', () => {
    describe('trainerAccompanimentChanged', () => {
      it('should emit the correct event', () => {
        spyOn(component.trainerAccompanimentChange, 'emit');
        component.trainerAccompanimentChanged();
        expect(component.trainerAccompanimentChange.emit).toHaveBeenCalled();
      });
    });
    describe('supervisorAccompanimentChanged', () => {
      it('should emit the correct event', () => {
        spyOn(component.supervisorAccompanimentChange, 'emit');
        component.supervisorAccompanimentChanged();
        expect(component.supervisorAccompanimentChange.emit).toHaveBeenCalled();
      });
    });
    describe('otherAccompanimentChanged', () => {
      it('should emit the correct event', () => {
        spyOn(component.otherAccompanimentChange, 'emit');
        component.otherAccompanimentChanged();
        expect(component.otherAccompanimentChange.emit).toHaveBeenCalled();
      });
    });
  });
});
