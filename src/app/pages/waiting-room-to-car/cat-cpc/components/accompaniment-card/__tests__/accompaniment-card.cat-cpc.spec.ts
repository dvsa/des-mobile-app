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
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  AccompanimentCardCatCPCComponent,
} from '@pages/waiting-room-to-car/cat-cpc/components/accompaniment-card/accompaniment-card.cat-cpc';

describe('AccompanimentCardCatCPCComponent', () => {
  let component: AccompanimentCardCatCPCComponent;
  let fixture: ComponentFixture<AccompanimentCardCatCPCComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        AccompanimentCardCatCPCComponent,
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
    fixture = TestBed.createComponent(AccompanimentCardCatCPCComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
  }));

  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });

  describe('Class',
    () => {
      describe('supervisorAccompanimentChanged', () => {
        it('should emit the correct event', () => {
          spyOn(component.supervisorAccompanimentChange, 'emit');
          component.supervisorAccompanimentChanged();
          expect(component.supervisorAccompanimentChange.emit)
            .toHaveBeenCalled();
        });
      });
      describe('interpreterAccompanimentChanged', () => {
        it('should emit the correct event', () => {
          spyOn(component.interpreterAccompanimentChange, 'emit');
          component.interpreterAccompanimentChanged();
          expect(component.interpreterAccompanimentChange.emit)
            .toHaveBeenCalled();
        });
      });
    });
});
