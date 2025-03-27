import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createTranslateLoader } from '@app/app.module';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { IonicModule } from '@ionic/angular';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { SafetyQuestionsCardComponent } from '@pages/debrief/components/safety-questions-card/safety-questions-card';

describe('SafetyQuestionsCardComponent', () => {
  let fixture: ComponentFixture<SafetyQuestionsCardComponent>;
  let component: SafetyQuestionsCardComponent;
  let translate: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SafetyQuestionsCardComponent],
      imports: [
        IonicModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient],
          },
        }),
      ],
      providers: [provideHttpClient(withInterceptorsFromDi())],
    });

    fixture = TestBed.createComponent(SafetyQuestionsCardComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
  });

  describe('questionHasFault', () => {
    const questionResult: QuestionResult = {
      code: 'Test Code',
      description: 'Test description',
      outcome: 'P',
    };

    const questionResultFault: QuestionResult = {
      code: 'Test Code',
      description: 'Test description',
      outcome: 'DF',
    };

    it('should return TRUE if the question has a fault', () => {
      const result = component.questionHasFault(questionResultFault);
      expect(result).toEqual(true);
    });

    it('should return FALSE if the question does NOT have a fault', () => {
      const result = component.questionHasFault(questionResult);
      expect(result).toEqual(false);
    });
  });
});
