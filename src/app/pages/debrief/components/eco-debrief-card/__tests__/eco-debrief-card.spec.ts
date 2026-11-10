import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';

import { provideTestTranslations } from '@mocks/test-providers';
import { StoreModule } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { EcoDebriefCardComponent } from '../eco-debrief-card';

describe('EcoDebriefCardComponent', () => {
  let fixture: ComponentFixture<EcoDebriefCardComponent>;
  let component: EcoDebriefCardComponent;
  let translate: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), EcoDebriefCardComponent],
      providers: [provideTestTranslations()],
    });

    fixture = TestBed.createComponent(EcoDebriefCardComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    translate.setFallbackLang('en');
  });

  describe('DOM', () => {
    it('when advice given control, only advice given control is showing', () => {
      component.adviceGivenControl = true;
      component.adviceGivenPlanning = false;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#adviceGivenControl'))).toBeDefined();
      expect(fixture.debugElement.query(By.css('#adviceGivenPlanning'))).toBeNull();
      expect(fixture.debugElement.query(By.css('#adviceGivenControlAndadviceGivenPlanning'))).toBeNull();
    });

    it('when advice given planning, only advice given planning is showing', () => {
      component.adviceGivenControl = false;
      component.adviceGivenPlanning = true;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#adviceGivenControl'))).toBeNull();
      expect(fixture.debugElement.query(By.css('#adviceGivenPlanning'))).toBeDefined();
      expect(fixture.debugElement.query(By.css('#adviceGivenControlAndadviceGivenPlanning'))).toBeNull();
    });

    it('when advice given planning and advice given control, both are shown', () => {
      component.adviceGivenControl = true;
      component.adviceGivenPlanning = true;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#adviceGivenControl'))).toBeNull();
      expect(fixture.debugElement.query(By.css('#adviceGivenPlanning'))).toBeNull();
      expect(fixture.debugElement.query(By.css('#adviceGivenControlAndadviceGivenPlanning'))).toBeDefined();
    });
  });
});
