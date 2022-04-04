import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { IonicModule, Config } from 'ionic-angular';
import { StoreModule, Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { ConfigMock } from 'ionic-mocks';
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { configureTestSuite } from 'ng-bullet';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SafetyAndBalanceCardCatAMod2Component } from '../safety-and-balance-card.cat-a-mod2';
import { testsReducer } from '../../../../../../modules/tests/tests.reducer';
import { StoreModel } from '../../../../../../shared/models/store.model';
import { StartTest } from '../../../../../../modules/tests/tests.actions';
import {
  SafetyQuestionSelected,
  SafetyQuestionOutcomeChanged,
} from '../../../../../../modules/tests/test-data/cat-a-mod2/safety-and-balance/safety-and-balance.cat-a-mod2.actions';
import { createTranslateLoader } from '../../../../../app.module';
import * as welshTranslations from '../../../../../../assets/i18n/cy.json';
import * as englishTranslations from '../../../../../../assets/i18n/en.json';
import { PopulateTestCategory } from '../../../../../../modules/tests/category/category.actions';
import { PopulateCandidateDetails }
  from '../../../../../../modules/tests/journal-data/common/candidate/candidate.actions';
import { candidateMock } from '../../../../../../modules/tests/__mocks__/tests.mock';

describe('SafetyAndBalanceCardCatAMod2Component', () => {
  let fixture: ComponentFixture<SafetyAndBalanceCardCatAMod2Component>;
  let store$: Store<StoreModel>;
  let translate: TranslateService;

  configureTestSuite(() => {
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
      providers: [
        { provide: Config, useFactory: () => ConfigMock.instance() },
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SafetyAndBalanceCardCatAMod2Component);
    store$ = TestBed.get(Store);
    store$.dispatch(new StartTest(105, TestCategory.EUA2M2));
    store$.dispatch(new PopulateTestCategory(TestCategory.EUA2M2));
    store$.dispatch(new PopulateCandidateDetails(candidateMock));
    translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en');
  }));

  describe('DOM', () => {
    describe('Safety and balance question reporting', () => {
      it('should show results', () => {
        const safetyQuestion: QuestionResult = {
          code: 'M4',
          description: 'Tell me how you would check that the lights and reflectors are clean and working.',
        };
        // Configure show safety and balance questions
        store$.dispatch(new SafetyQuestionSelected(safetyQuestion, 1));
        store$.dispatch(new SafetyQuestionOutcomeChanged('P', 1));

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
        store$.dispatch(new SafetyQuestionSelected(safetyQuestion, 1));
        store$.dispatch(new SafetyQuestionOutcomeChanged('P', 1));

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
