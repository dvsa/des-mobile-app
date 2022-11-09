import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { StoreModule } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppModule } from '@app/app.module';
import { ComponentsModule } from '@components/common/common-components.module';
import { SpeedCheckDebriefCardComponent } from '../speed-check-debrief-card';

fdescribe('SeriousFaultsDebriefCardComponent', () => {
  let translate: TranslateService;
  let fixture: ComponentFixture<SpeedCheckDebriefCardComponent>;
  let component: SpeedCheckDebriefCardComponent;

  beforeEach(waitForAsync(() => {
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
