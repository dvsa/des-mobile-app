import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StoreModule } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppModule } from '@app/app.module';
import { By } from '@angular/platform-browser';
import { ComponentsModule } from '@components/common/common-components.module';
import { EtaDebriefCardComponent } from '../eta-debrief-card';

fdescribe('EtaDebriefCardComponent', () => {
  let fixture: ComponentFixture<EtaDebriefCardComponent>;
  let component: EtaDebriefCardComponent;
  let translate: TranslateService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EtaDebriefCardComponent],
      imports: [
        IonicModule,
        AppModule,
        ComponentsModule,
        StoreModule.forRoot({}),
        TranslateModule,
      ],
    });

    fixture = TestBed.createComponent(EtaDebriefCardComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
  }));

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
