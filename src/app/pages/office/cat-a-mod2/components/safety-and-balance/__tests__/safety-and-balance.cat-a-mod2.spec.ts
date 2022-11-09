import {
  ComponentFixture, TestBed, waitForAsync,
} from '@angular/core/testing';
import { IonicModule, Config } from '@ionic/angular';
import { StoreModule, Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { ConfigMock } from 'ionic-mocks';
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { testsReducer } from '@store/tests/tests.reducer';
import { StoreModel } from '@shared/models/store.model';
import { StartTest } from '@store/tests/tests.actions';
import {
  SafetyQuestionSelected,
  SafetyQuestionOutcomeChanged,
  BalanceQuestionSelected,
  BalanceQuestionOutcomeChanged,
} from '@store/tests/test-data/cat-a-mod2/safety-and-balance/safety-and-balance.cat-a-mod2.actions';
import { createTranslateLoader } from '@app/app.module';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import { PopulateCandidateDetails }
  from '@store/tests/journal-data/common/candidate/candidate.actions';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { default as welshTranslations } from '@assets/i18n/cy.json';
import { default as englishTranslations } from '@assets/i18n/en.json';
import { SafetyAndBalanceCardCatAMod2Component } from '../safety-and-balance.cat-a-mod2';

fdescribe('SafetyAndBalanceCardCatAMod2Component', () => {
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
      providers: [
        { provide: Config, useFactory: () => ConfigMock.instance() },
      ],
    });

    fixture = TestBed.createComponent(SafetyAndBalanceCardCatAMod2Component);
    store$ = TestBed.inject(Store);
    store$.dispatch(StartTest(105, TestCategory.EUA2M2));
    store$.dispatch(PopulateTestCategory(TestCategory.EUA2M2));
    store$.dispatch(PopulateCandidateDetails(candidateMock));

    const safetyQuestions: QuestionResult[] = [{
      code: 'M4',
      description: 'Tell me how you would check that the lights and reflectors are clean and working.',
    }, {
      code: 'M6',
      description: 'Tell me how you would check the condition of the chain on this machine.',
    }];

    const balanceQuestions: QuestionResult[] = [{
      code: 'B1',
      description: 'What problems could arise from carrying a pillion passenger?',
    }];

    safetyQuestions.forEach((question, index) => {
      store$.dispatch(SafetyQuestionSelected(question, index));
      store$.dispatch(SafetyQuestionOutcomeChanged('P', index));
    });

    balanceQuestions.forEach((question, index) => {
      store$.dispatch(BalanceQuestionSelected(question, index));
      store$.dispatch(BalanceQuestionOutcomeChanged('P', index));
    });

    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
  }));

  describe('DOM', () => {
    describe('Safety and balance question reporting', () => {
      it('should show results', () => {
        fixture.detectChanges();

        const safetyAndBalanceQuestions = fixture.debugElement
          .queryAll(By.css('.counter-label'));

        expect(safetyAndBalanceQuestions.length).toBe(3);
        expect(safetyAndBalanceQuestions[0].nativeElement.innerHTML.trim())
          .toContain((<any>englishTranslations).debrief.safetyAndBalanceQuestions.M4);
        expect(safetyAndBalanceQuestions[1].nativeElement.innerHTML.trim())
          .toContain((<any>englishTranslations).debrief.safetyAndBalanceQuestions.M6);
        expect(safetyAndBalanceQuestions[2].nativeElement.innerHTML.trim())
          .toContain((<any>englishTranslations).debrief.safetyAndBalanceQuestions.B1);
      });

      it('should show results in Welsh for a Welsh test', (done) => {
        fixture.detectChanges();

        // Language change handled by parent page component, force the switch
        translate.use('cy').subscribe(() => {

          fixture.detectChanges();

          const safetyAndBalanceQuestions = fixture.debugElement
            .queryAll(By.css('.counter-label'));

          expect(safetyAndBalanceQuestions[0].nativeElement.innerHTML.trim())
            .toContain((<any>welshTranslations).debrief.safetyAndBalanceQuestions.M4);
          expect(safetyAndBalanceQuestions[1].nativeElement.innerHTML.trim())
            .toContain((<any>welshTranslations).debrief.safetyAndBalanceQuestions.M6);
          expect(safetyAndBalanceQuestions[2].nativeElement.innerHTML.trim())
            .toContain((<any>welshTranslations).debrief.safetyAndBalanceQuestions.B1);
          done();
        });
      });
    });
  });

});
