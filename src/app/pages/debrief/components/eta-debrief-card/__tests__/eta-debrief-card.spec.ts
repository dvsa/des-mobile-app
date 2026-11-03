import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';

import { provideTestTranslations } from '@mocks/test-providers';
import { StoreModule } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { EtaDebriefCardComponent } from '../eta-debrief-card';

describe('EtaDebriefCardComponent', () => {
  let fixture: ComponentFixture<EtaDebriefCardComponent>;
  let component: EtaDebriefCardComponent;
  let translate: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), EtaDebriefCardComponent],
      providers: [provideTestTranslations()],
    });

    fixture = TestBed.createComponent(EtaDebriefCardComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    translate.setFallbackLang('en');
  });

  describe('DOM', () => {
    it('when physical eta, only physical eta is showing', () => {
      component.hasPhysicalEta = true;
      component.hasVerbalEta = false;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.hasPhysicalEta'))).toBeDefined();
      expect(fixture.debugElement.query(By.css('.hasVerbalEta'))).toBeNull();
      expect(fixture.debugElement.query(By.css('.hasVerbalAndPhysicalEta'))).toBeNull();
    });

    it('when verbal eta, only verbal eta is showing', () => {
      component.hasPhysicalEta = false;
      component.hasVerbalEta = true;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.hasPhysicalEta'))).toBeNull();
      expect(fixture.debugElement.query(By.css('.hasVerbalEta'))).toBeDefined();
      expect(fixture.debugElement.query(By.css('.hasVerbalAndPhysicalEta'))).toBeNull();
    });

    it('when verbal and physical eta, both are showing', () => {
      component.hasPhysicalEta = true;
      component.hasVerbalEta = true;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.hasPhysicalEta'))).toBeNull();
      expect(fixture.debugElement.query(By.css('.hasVerbalEta'))).toBeNull();
      expect(fixture.debugElement.query(By.css('.hasVerbalAndPhysicalEta'))).toBeDefined();
    });
  });
});
