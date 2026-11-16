import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { provideTestTranslations } from '@mocks/test-providers';
import { StoreModule } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { SpeedCheckDebriefCardComponent } from '../speed-check-debrief-card';

describe('SeriousFaultsDebriefCardComponent', () => {
  let translate: TranslateService;
  let fixture: ComponentFixture<SpeedCheckDebriefCardComponent>;
  let component: SpeedCheckDebriefCardComponent;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), SpeedCheckDebriefCardComponent],
      providers: [provideTestTranslations()],
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
  });

  describe('ngOnInit', () => {
    it('should default to english if isTranslatable is false', () => {
      translate.setFallbackLang('cy');
      component.isTranslatable = false;
      fixture.detectChanges();
      expect(translate.getCurrentLang()).toEqual('en');
    });
  });
});
