import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { createTranslateLoader } from '@app/app.module';
import { default as welshTranslations } from '@assets/i18n/cy.json';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonicModule } from '@ionic/angular';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { StoreModel } from '@shared/models/store.model';
import {
  ShowMeQuestionDangerousFault,
  ShowMeQuestionDrivingFault,
  ShowMeQuestionPassed,
  ShowMeQuestionSeriousFault,
  TellMeQuestionCorrect,
  TellMeQuestionDrivingFault,
} from '@store/tests/test-data/cat-b/vehicle-checks/vehicle-checks.actions';
import { StartTest } from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { VehicleChecksCardCatBComponent } from '../vehicle-checks-card.cat-b';

describe('VehicleChecksCardCatBComponent', () => {
  let fixture: ComponentFixture<VehicleChecksCardCatBComponent>;
  let store$: Store<StoreModel>;
  let translate: TranslateService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleChecksCardCatBComponent],
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

    fixture = TestBed.createComponent(VehicleChecksCardCatBComponent);
    store$ = TestBed.inject(Store);
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    store$.dispatch(StartTest(105, TestCategory.B));
  }));

  describe('DOM', () => {
    it('should not display the card when no fault marked', () => {
      store$.dispatch(TellMeQuestionCorrect());
      store$.dispatch(ShowMeQuestionPassed());
      fixture.detectChanges();
      const vehicleChecksCard = fixture.debugElement.query(By.css('#vehicle-checks'));
      expect(vehicleChecksCard).toBeNull();
    });

    it('should display the card when show me has a fault', () => {
      store$.dispatch(TellMeQuestionCorrect());
      store$.dispatch(ShowMeQuestionDrivingFault());
      fixture.detectChanges();
      const vehicleChecksCard = fixture.debugElement.query(By.css('#vehicle-checks'));
      expect(vehicleChecksCard).not.toBeNull();
    });

    it('should display the card when tell me has a fault', () => {
      store$.dispatch(TellMeQuestionDrivingFault());
      store$.dispatch(ShowMeQuestionPassed());
      fixture.detectChanges();
      const vehicleChecksCard = fixture.debugElement.query(By.css('#vehicle-checks'));
      expect(vehicleChecksCard).not.toBeNull();
    });

    it('should display tell me question div, when there is a tell me fault', () => {
      store$.dispatch(TellMeQuestionDrivingFault());
      store$.dispatch(ShowMeQuestionPassed());
      fixture.detectChanges();
      const vehicleChecksCard = fixture.debugElement.query(By.css('#tell-me-question'));
      expect(vehicleChecksCard).not.toBeNull();
    });

    it('should display show me question div, when there is a show me fault', () => {
      store$.dispatch(TellMeQuestionCorrect());
      store$.dispatch(ShowMeQuestionDrivingFault());
      fixture.detectChanges();
      const vehicleChecksCard = fixture.debugElement.query(By.css('#show-me-question'));
      expect(vehicleChecksCard).not.toBeNull();
    });

    describe('Vehicle check reporting', () => {
      describe('Tell me question reporting', () => {
        it('should indicate when there was a driving fault on the tell me question', () => {
          store$.dispatch(TellMeQuestionDrivingFault());
          fixture.detectChanges();
          const tellMeQuestionText = fixture.debugElement.query(By.css('#tell-me-question')).nativeElement;
          expect(tellMeQuestionText.innerHTML.trim()).toBe('Tell me question - Incorrect');
        });
        it('should indicate a tell me fault in Welsh for a Welsh test', (done) => {
          fixture.detectChanges();
          store$.dispatch(TellMeQuestionDrivingFault());
          // Language change handled by parent page component, force the switch
          translate.use('cy').subscribe(() => {
            fixture.detectChanges();
            const tellMeQuestionText = fixture.debugElement.query(By.css('#tell-me-question')).nativeElement;
            const { tellMeQuestion, incorrect } = (<any>welshTranslations).debrief;
            expect(tellMeQuestionText.innerHTML.trim()).toBe(`${tellMeQuestion} - ${incorrect}`);
            done();
          });
        });
      });
      describe('Show me question reporting', () => {
        it('should indicate when there was a driving fault on the show me question', () => {
          fixture.detectChanges();
          store$.dispatch(ShowMeQuestionDrivingFault());
          translate.use('en').subscribe(() => {
            fixture.detectChanges();
            const showMeQuestionText = fixture.debugElement.query(By.css('#show-me-question-outcome-df')).nativeElement;
            expect(showMeQuestionText.innerHTML.trim()).toBe('Show me question - Incorrect');
          });
        });
        it('should indicate a show me driving fault in Welsh for a Welsh test', (done) => {
          fixture.detectChanges();
          store$.dispatch(ShowMeQuestionDrivingFault());
          // Language change handled by parent page component, force the switch
          translate.use('cy').subscribe(() => {
            fixture.detectChanges();
            const showMeQuestionText = fixture.debugElement.query(By.css('#show-me-question-outcome-df')).nativeElement;
            const { showMeQuestion, incorrect } = (<any>welshTranslations).debrief;
            const expectedTranslation = `${showMeQuestion} - ${incorrect}`;
            expect(showMeQuestionText.innerHTML.trim()).toBe(expectedTranslation);
            done();
          });
        });
        it('should indicate when there was a serious fault on the show me question', () => {
          fixture.detectChanges();
          translate.use('en').subscribe(() => {
            store$.dispatch(ShowMeQuestionSeriousFault());
            fixture.detectChanges();
            const showMeQuestionText = fixture.debugElement.query(By.css('#show-me-question-outcome-s')).nativeElement;
            expect(showMeQuestionText.innerHTML.trim()).toBe('Show me question - Serious fault');
          });
        });
        it('should indicate a show me serious fault in Welsh for a Welsh test', (done) => {
          fixture.detectChanges();
          store$.dispatch(ShowMeQuestionSeriousFault());
          // Language change handled by parent page component, force the switch
          translate.use('cy').subscribe(() => {
            fixture.detectChanges();
            const showMeQuestionText = fixture.debugElement.query(By.css('#show-me-question-outcome-s')).nativeElement;
            const { showMeQuestion, seriousFault } = (<any>welshTranslations).debrief;
            const expectedTranslation = `${showMeQuestion} - ${seriousFault}`;
            expect(showMeQuestionText.innerHTML.trim()).toBe(expectedTranslation);
            done();
          });
        });
        it('should indicate when there was a dangerous fault on the show me question', () => {
          fixture.detectChanges();
          store$.dispatch(ShowMeQuestionDangerousFault());
          translate.use('en').subscribe(() => {
            fixture.detectChanges();
            const showMeQuestionText = fixture.debugElement.query(By.css('#show-me-question-outcome-d')).nativeElement;
            expect(showMeQuestionText.innerHTML.trim()).toBe('Show me question - Dangerous fault');
          });
        });
        it('should indicate a tell me dangerous fault in Welsh for a Welsh test', (done) => {
          fixture.detectChanges();
          store$.dispatch(ShowMeQuestionDangerousFault());
          // Language change handled by parent page component, force the switch
          translate.use('cy').subscribe(() => {
            fixture.detectChanges();
            const showMeQuestionText = fixture.debugElement.query(By.css('#show-me-question-outcome-d')).nativeElement;
            const { showMeQuestion, dangerousFault } = (<any>welshTranslations).debrief;
            const expectedTranslation = `${showMeQuestion} - ${dangerousFault}`;
            expect(showMeQuestionText.innerHTML.trim()).toBe(expectedTranslation);
            done();
          });
        });
      });
    });
  });
});
