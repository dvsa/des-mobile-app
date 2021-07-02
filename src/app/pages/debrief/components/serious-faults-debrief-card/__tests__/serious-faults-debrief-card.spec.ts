import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StoreModule } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppModule } from '@app/app.module';
import { By } from '@angular/platform-browser';
import { ComponentsModule } from '@components/common/common-components.module';
import * as welshTranslations from '@assets/i18n/cy.json';
import { configureI18N } from '@shared/helpers/translation.helpers';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { Competencies } from '@store/tests/test-data/test-data.constants';
import { configureTestSuite } from 'ng-bullet';
import { PipesModule } from '@shared/pipes/pipes.module';
import { SeriousFaultsDebriefCardComponent } from '../serious-faults-debrief-card';

describe('SeriousFaultsDebriefCardComponent', () => {
  let fixture: ComponentFixture<SeriousFaultsDebriefCardComponent>;
  let component: SeriousFaultsDebriefCardComponent;
  let translate: TranslateService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [SeriousFaultsDebriefCardComponent],
      imports: [
        IonicModule,
        AppModule,
        ComponentsModule,
        StoreModule.forRoot({}),
        TranslateModule,
        PipesModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(SeriousFaultsDebriefCardComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
  }));

  describe('DOM', () => {
    it('correct driving faults showing', () => {
      const seriousFaults = [Competencies.ancillaryControls, Competencies.clearance];
      component.seriousFaults = seriousFaults;
      fixture.detectChanges();
      const seriousFaultLabels = fixture.debugElement.queryAll(By.css('#serious-fault .counter-label'));
      const drivingFaultCount = fixture.debugElement.query(By.css('h1.fault-heading')).nativeElement;
      expect(seriousFaultLabels[0].nativeElement.innerHTML).toBe('Control - Ancillary Controls');
      expect(seriousFaultLabels[1].nativeElement.innerHTML).toBe('Clearance');
      expect(drivingFaultCount.innerHTML).toBe(seriousFaults.length.toString());
    });

    it('correct driving faults showing in welsh', (done) => {
      configureI18N(Language.CYMRAEG, translate);
      const seriousFaults = [Competencies.useOfSpeed, Competencies.signalsTimed];
      component.seriousFaults = seriousFaults;
      translate.onLangChange.subscribe(() => {
        fixture.detectChanges();
        const drivingFaultsLabels = fixture.debugElement.queryAll(By.css('#serious-fault .counter-label'));
        const drivingFaultCount = fixture.debugElement.query(By.css('h1.fault-heading')).nativeElement;
        expect(drivingFaultsLabels[0].nativeElement.innerHTML)
          .toBe((<any>welshTranslations).debrief.competencies.useOfSpeed);
        expect(drivingFaultsLabels[1].nativeElement.innerHTML)
          .toBe((<any>welshTranslations).debrief.competencies.signalsTimed);
        expect(drivingFaultCount.innerHTML).toBe(seriousFaults.length.toString());
        done();
      });
    });

    it('no serious faults showing', () => {
      const seriousFaults = [];
      component.seriousFaults = seriousFaults;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#serious-fault'))).toBeNull();
    });
  });
});
