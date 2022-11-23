import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { StoreModule, Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  SafetyQuestionSelected,
  SafetyQuestionOutcomeChanged,
} from '@store/tests/test-data/cat-a-mod2/safety-and-balance/safety-and-balance.cat-a-mod2.actions';
import { createTranslateLoader } from '@app/app.module';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import { PopulateCandidateDetails }
  from '@store/tests/journal-data/common/candidate/candidate.actions';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { testsReducer } from '@store/tests/tests.reducer';
import { StoreModel } from '@shared/models/store.model';
import { StartTest } from '@store/tests/tests.actions';
import { default as welshTranslations } from '@assets/i18n/cy.json';
import { default as englishTranslations } from '@assets/i18n/en.json';
import { SafetyAndBalanceCardCatAMod2Component } from '../safety-and-balance-card.cat-a-mod2';

describe('SafetyAndBalanceCardCatAMod2Component', () => {
  let fixture: ComponentFixture<SafetyAndBalanceCardCatAMod2Component>;
  let store$: Store<StoreModel>;
  let translate: TranslateService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SafetyAndBalanceCardCatAMod2Component,
      ],
      imports: [
        IonicModule,
        HttpClientModule,
        StoreModule.forRoot({ tests: testsReducer }),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient],
          },
        }),
      ],
    });

    fixture = TestBed.createComponent(SafetyAndBalanceCardCatAMod2Component);
    store$ = TestBed.inject(Store);
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    store$.dispatch(StartTest(105, TestCategory.EUA2M2));
    store$.dispatch(PopulateTestCategory(TestCategory.EUA2M2));
    store$.dispatch(PopulateCandidateDetails(candidateMock));
  }));

  describe('DOM', () => {
    describe('Safety and balance question reporting', () => {
      it('should show results', () => {
        const safetyQuestion: QuestionResult = {
          code: 'M4',
          description: 'Tell me how you would check that the lights and reflectors are clean and working.',
        };
        // Configure show safety and balance questions
        store$.dispatch(SafetyQuestionSelected(safetyQuestion, 1));
        store$.dispatch(SafetyQuestionOutcomeChanged('P', 1));

        fixture.detectChanges();

        const safetyQuestionText = fixture.debugElement
          .query(By.css('#safety-and-balance-questions .counter-label')).nativeElement;

        expect(safetyQuestionText.innerHTML.trim())
          .toContain((<any>englishTranslations).debrief.safetyAndBalanceQuestions.M4);
      });

      it('should show results in Welsh for a Welsh test', (done) => {
        const safetyQuestion: QuestionResult = {
          code: 'M4',
          description: 'Tell me how you would check that the lights and reflectors are clean and working.',
        };
        // Configure show safety and balance questions
        store$.dispatch(SafetyQuestionSelected(safetyQuestion, 1));
        store$.dispatch(SafetyQuestionOutcomeChanged('P', 1));

        fixture.detectChanges();

        // Language change handled by parent page component, force the switch
        translate.use('cy').subscribe(() => {

          fixture.detectChanges();

          const safetyQuestionText = fixture.debugElement
            .query(By.css('#safety-and-balance-questions .counter-label')).nativeElement;

          expect(safetyQuestionText.innerHTML.trim())
            .toContain((<any>welshTranslations).debrief.safetyAndBalanceQuestions.M4);
          done();
        });
      });
    });
  });

});
