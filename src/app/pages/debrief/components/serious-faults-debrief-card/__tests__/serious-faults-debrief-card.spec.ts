import { ComponentFixture, TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { By } from '@angular/platform-browser';

import { default as welshTranslations } from '@assets/i18n/cy.json';
import { provideTestTranslations } from '@mocks/test-providers';
import { StoreModule } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { configureI18N } from '@shared/helpers/translation.helpers';

import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { Competencies } from '@store/tests/test-data/test-data.constants';
import { SeriousFaultsDebriefCardComponent } from '../serious-faults-debrief-card';

describe('SeriousFaultsDebriefCardComponent', () => {
  let fixture: ComponentFixture<SeriousFaultsDebriefCardComponent>;
  let component: SeriousFaultsDebriefCardComponent;
  let translate: TranslateService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), SeriousFaultsDebriefCardComponent],
      providers: [provideTestTranslations()],
    });

    fixture = TestBed.createComponent(SeriousFaultsDebriefCardComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    translate.setFallbackLang('en');
    fixture.detectChanges();
  });

  describe('DOM', () => {
    it('correct driving faults showing', () => {
      const seriousFaults = [Competencies.ancillaryControls, Competencies.clearance];
      fixture.componentRef.setInput('seriousFaults', seriousFaults);
      fixture.detectChanges();
      const seriousFaultLabels = fixture.debugElement.queryAll(By.css('#serious-fault .counter-label'));
      const drivingFaultCount = fixture.debugElement.query(By.css('ion-text.fault-heading')).nativeElement;
      expect(seriousFaultLabels[0].nativeElement.innerHTML.trim()).toBe('Control - Ancillary controls');
      expect(seriousFaultLabels[1].nativeElement.innerHTML.trim()).toBe('Clearance');
      expect(drivingFaultCount.innerHTML).toBe(seriousFaults.length.toString());
    });

    it('correct driving faults showing in welsh', async () => {
      const languageChange = firstValueFrom(translate.onLangChange);
      const seriousFaults = [Competencies.useOfSpeed, Competencies.signalsTimed];
      fixture.componentRef.setInput('seriousFaults', seriousFaults);
      configureI18N(Language.CYMRAEG, translate);
      await languageChange;
      fixture.detectChanges();
      const drivingFaultsLabels = fixture.debugElement.queryAll(By.css('#serious-fault .counter-label'));
      const drivingFaultCount = fixture.debugElement.query(By.css('ion-text.fault-heading')).nativeElement;
      expect(drivingFaultsLabels[0].nativeElement.innerHTML.trim()).toBe(
        welshTranslations.debrief.competencies.useOfSpeed
      );
      expect(drivingFaultsLabels[1].nativeElement.innerHTML.trim()).toBe(
        welshTranslations.debrief.competencies.signalsTimed
      );
      expect(drivingFaultCount.innerHTML).toBe(seriousFaults.length.toString());
    });

    it('no serious faults showing', () => {
      fixture.componentRef.setInput('seriousFaults', []);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#serious-fault'))).toBeNull();
    });
  });
});
