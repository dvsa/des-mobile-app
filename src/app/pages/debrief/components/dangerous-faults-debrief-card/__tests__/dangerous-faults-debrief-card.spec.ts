import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { By } from '@angular/platform-browser';

import { default as welshTranslations } from '@assets/i18n/cy.json';
import { StoreModule } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { configureI18N } from '@shared/helpers/translation.helpers';
import { PipesModule } from '@shared/pipes/pipes.module';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { Competencies } from '@store/tests/test-data/test-data.constants';
import { DangerousFaultsDebriefCardComponent } from '../dangerous-faults-debrief-card';

describe('DangerousFaultsDebriefCardComponent', () => {
  let fixture: ComponentFixture<DangerousFaultsDebriefCardComponent>;
  let component: DangerousFaultsDebriefCardComponent;
  let translate: TranslateService;

  interface WelshTranslations {
    debrief: {
      competencies: {
        ancillaryControls: string;
      };
    };
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, StoreModule.forRoot({}), TranslateModule, PipesModule, DangerousFaultsDebriefCardComponent],
    });

    fixture = TestBed.createComponent(DangerousFaultsDebriefCardComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    translate.setFallbackLang('en');
    fixture.detectChanges();
  }));

  describe('DOM', () => {
    it('correct dangerous faults showing', () => {
      const dangerousFaults = [Competencies.ancillaryControls, Competencies.clearance];
      fixture.componentRef.setInput('dangerousFaults', dangerousFaults);
      fixture.detectChanges();
      const dangerousLabels = fixture.debugElement.queryAll(By.css('#dangerous-fault .counter-label'));
      const dangerousCounts = fixture.debugElement.query(By.css('ion-text.fault-heading')).nativeElement;
      expect(dangerousLabels[0].nativeElement.innerHTML.trim()).toBe('Control - Ancillary controls');
      expect(dangerousLabels[1].nativeElement.innerHTML.trim()).toBe('Clearance');
      expect(dangerousCounts.innerHTML).toBe(dangerousFaults.length.toString());
    });

    it('correct dangerous faults showing in welsh', async () => {
      const languageChange = firstValueFrom(translate.onLangChange);
      const dangerousFaults = [Competencies.ancillaryControls];
      fixture.componentRef.setInput('dangerousFaults', dangerousFaults);
      configureI18N(Language.CYMRAEG, translate);
      await languageChange;
      fixture.detectChanges();
      const dangerousLabels = fixture.debugElement.queryAll(By.css('#dangerous-fault .counter-label'));
      const dangerousCounts = fixture.debugElement.query(By.css('ion-text.fault-heading')).nativeElement;
      expect(dangerousLabels[0].nativeElement.innerHTML.trim()).toBe(
        (welshTranslations as WelshTranslations).debrief.competencies.ancillaryControls
      );
      expect(dangerousCounts.innerHTML).toBe(dangerousFaults.length.toString());
    });

    it('no dangerous faults showing', () => {
      fixture.componentRef.setInput('dangerousFaults', []);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#dangerous-fault'))).toBeNull();
    });
  });
});
