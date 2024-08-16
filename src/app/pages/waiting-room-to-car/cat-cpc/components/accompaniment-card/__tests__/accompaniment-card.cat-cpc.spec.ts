import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { AppModule } from '@app/app.module';
import { AccompanimentCardCatCPCComponent } from '@pages/waiting-room-to-car/cat-cpc/components/accompaniment-card/accompaniment-card.cat-cpc';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { QuestionProviderMock } from '@providers/question/__mocks__/question.mock';
import { QuestionProvider } from '@providers/question/question';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';

describe('AccompanimentCardCatCPCComponent', () => {
  let component: AccompanimentCardCatCPCComponent;
  let fixture: ComponentFixture<AccompanimentCardCatCPCComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [AccompanimentCardCatCPCComponent],
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

    fixture = TestBed.createComponent(AccompanimentCardCatCPCComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Class', () => {
    describe('supervisorAccompanimentChanged', () => {
      it('should emit the correct event', () => {
        spyOn(component.supervisorAccompanimentChange, 'emit');
        component.supervisorAccompanimentChanged();
        expect(component.supervisorAccompanimentChange.emit).toHaveBeenCalled();
      });
    });
    describe('interpreterAccompanimentChanged', () => {
      it('should emit the correct event', () => {
        spyOn(component.interpreterAccompanimentChange, 'emit');
        component.interpreterAccompanimentChanged();
        expect(component.interpreterAccompanimentChange.emit).toHaveBeenCalled();
      });
    });
  });
});
