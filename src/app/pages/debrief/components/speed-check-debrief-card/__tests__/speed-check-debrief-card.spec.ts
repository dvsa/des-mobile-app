import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StoreModule } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SpeedCheckDebriefCardComponent } from '../speed-check-debrief-card';

describe('SeriousFaultsDebriefCardComponent', () => {
  let translate: TranslateService;
  let fixture: ComponentFixture<SpeedCheckDebriefCardComponent>;
  let component: SpeedCheckDebriefCardComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), TranslateModule, SpeedCheckDebriefCardComponent],
    });

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
