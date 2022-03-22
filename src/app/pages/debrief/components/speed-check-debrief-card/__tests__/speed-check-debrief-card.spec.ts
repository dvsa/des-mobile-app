import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';

import { StoreModule } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppModule } from '@app/app.module';
import { ComponentsModule } from '@components/common/common-components.module';
import { SpeedCheckDebriefCardComponent } from '../speed-check-debrief-card';

describe('SeriousFaultsDebriefCardComponent', () => {
  let translate: TranslateService;
  let fixture: ComponentFixture<SpeedCheckDebriefCardComponent>;
  let component: SpeedCheckDebriefCardComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [SpeedCheckDebriefCardComponent],
      imports: [
        IonicModule,
        AppModule,
        ComponentsModule,
        StoreModule.forRoot({}),
        TranslateModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(SpeedCheckDebriefCardComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    component.avoidance = {
      firstAttempt: 0,
      secondAttempt: 0,
      outcome: null,
      comments: null,
    };
    component.emergencyStop = {
      firstAttempt: 0,
      secondAttempt: 0,
      outcome: null,
      comments: null,
    };
  }));

  describe('ngOnInit', () => {
    it('should default to english if isTranslatable is false', () => {
      translate.setDefaultLang('cy');
      component.isTranslatable = false;
      fixture.detectChanges();
      expect(translate.currentLang).toEqual('en');
    });
  });
});
