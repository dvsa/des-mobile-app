import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { By } from '@angular/platform-browser';
import { AppModule } from '@app/app.module';
import { ComponentsModule } from '@components/common/common-components.module';
import { StoreModule } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EcoDebriefCardComponent } from '../eco-debrief-card';

describe('EcoDebriefCardComponent', () => {
  let fixture: ComponentFixture<EcoDebriefCardComponent>;
  let component: EcoDebriefCardComponent;
  let translate: TranslateService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EcoDebriefCardComponent],
      imports: [IonicModule, AppModule, ComponentsModule, StoreModule.forRoot({}), TranslateModule],
    });

    fixture = TestBed.createComponent(EcoDebriefCardComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
  }));

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
