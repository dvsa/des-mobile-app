import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from '@app/app.module';
import { default as welshTranslations } from '@assets/i18n/cy.json';
import { default as englishTranslations } from '@assets/i18n/en.json';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MockComponent } from 'ng-mocks';
import { HeaderComponent } from '@components/common/header-component/header.component';
import { getMalformedVehicleChecks } from '../__mocks__/vehicle-checks-card.mock';
import { VehicleChecksCardComponent } from '../vehicle-checks-card';

describe('VehicleChecksCardComponent', () => {
  let fixture: ComponentFixture<VehicleChecksCardComponent>;
  let component: VehicleChecksCardComponent;
  let translate: TranslateService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        VehicleChecksCardComponent,
        MockComponent(HeaderComponent),
      ],
      imports: [
        IonicModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient],
          },
        }),
      ],
    });

    fixture = TestBed.createComponent(VehicleChecksCardComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
  }));

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

  describe('isHomeTest', () => {
    it('should return TRUE if it is a home test', () => {
      component.category = TestCategory.F;
      const result = component.isHomeTest();
      expect(result).toEqual(true);
    });

    it('should return FALSE if it is NOT a home test', () => {
      component.category = TestCategory.BE;
      const result = component.isHomeTest();
      expect(result).toEqual(false);
    });
  });

  describe('DOM', () => {
    describe('Vehicle check reporting', () => {
      it('should remove any SMTM questions which have no outcome provided', () => {
        component.category = TestCategory.BE;
        // 2 questions are provided with an outcome here.
        component.tellMeShowMeQuestions = getMalformedVehicleChecks();
        component.ngOnInit();
        expect(component.tellMeShowMeQuestions.length).toEqual(2);
      });
      it('should show results', () => {
        component.category = TestCategory.BE;
        component.tellMeShowMeQuestions = [
          {
            code: 'S01',
            description: 'Show me how you would check that the direction indicators are working.',
            outcome: 'P',
          },
        ];
        fixture.detectChanges();

        const tellMeQuestionText = fixture.debugElement
          .query(By.css('#vehicle-checks .counter-label')).nativeElement;

        expect(tellMeQuestionText.innerHTML.trim())
          .toContain((<any>englishTranslations).debrief.showMeTellMeQuestions[TestCategory.BE].S01);
      });

      it('should show results in Welsh for a Welsh test', (done) => {
        component.category = TestCategory.BE;
        component.tellMeShowMeQuestions = [
          {
            code: 'S01',
            description: 'Show me how you would check that the direction indicators are working.',
            outcome: 'P',
          },
        ];

        fixture.detectChanges();

        // Language change handled by parent page component, force the switch
        translate.use('cy').subscribe(() => {
          fixture.detectChanges();
          const tellMeQuestionText = fixture.debugElement
            .query(By.css('#vehicle-checks .counter-label')).nativeElement;

          expect(tellMeQuestionText.innerHTML.trim())
            .toContain((<any>welshTranslations).debrief.showMeTellMeQuestions[TestCategory.BE].S01);
          done();
        });
      });
    });
  });

});
