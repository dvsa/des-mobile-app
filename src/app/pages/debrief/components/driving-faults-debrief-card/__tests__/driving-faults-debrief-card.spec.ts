import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StoreModule } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppModule } from '@app/app.module';
import { By } from '@angular/platform-browser';
import { ComponentsModule } from '@components/common/common-components.module';
import { default as welshTranslations } from '@assets/i18n/cy.json';
import { FaultSummary } from '@shared/models/fault-marking.model';
import { configureI18N } from '@shared/helpers/translation.helpers';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { configureTestSuite } from 'ng-bullet';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { PipesModule } from '@shared/pipes/pipes.module';
import { DrivingFaultsDebriefCardComponent } from '../driving-faults-debrief-card';

describe('DrivingFaultsDebriefCardComponent', () => {
  let fixture: ComponentFixture<DrivingFaultsDebriefCardComponent>;
  let component: DrivingFaultsDebriefCardComponent;
  let translate: TranslateService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [DrivingFaultsDebriefCardComponent],
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
    fixture = TestBed.createComponent(DrivingFaultsDebriefCardComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
  }));

  describe('DOM', () => {
    it('correct driving faults showing', () => {
      const drivingFaults: FaultSummary[] = [
        {
          competencyIdentifier: 'useOfSpeed',
          competencyDisplayName: 'Use of speed',
          faultCount: 1,
          comment: '',
        },
        {
          competencyIdentifier: 'signalsTimed',
          competencyDisplayName: 'Signals - Timed',
          faultCount: 1,
          comment: '',
        },
      ];

      component.drivingFaults = drivingFaults;
      component.drivingFaultCount = 2;
      fixture.detectChanges();
      const drivingFaultLabels = fixture.debugElement.queryAll(By.css('#driving-fault .counter-label'));
      const drivingFaultCount = fixture.debugElement.query(By.css('h1.fault-heading')).nativeElement;
      expect(drivingFaultLabels[0].nativeElement.innerHTML).toBe('Use of speed');
      expect(drivingFaultLabels[1].nativeElement.innerHTML).toBe('Signals - Timed');
      expect(drivingFaultCount.innerHTML).toBe(drivingFaults.length.toString());
    });

    it('correct driving faults showing in welsh', (done) => {
      configureI18N(Language.CYMRAEG, translate);
      const drivingFaults: FaultSummary[] = [
        {
          competencyIdentifier: 'useOfSpeed',
          competencyDisplayName: 'Use of speed',
          faultCount: 1,
          comment: '',
        },
        {
          competencyIdentifier: 'signalsTimed',
          competencyDisplayName: 'Signals - Timed',
          faultCount: 1,
          comment: '',
        },
      ];
      component.drivingFaults = drivingFaults;
      component.drivingFaultCount = 2;
      translate.onLangChange.subscribe(() => {
        fixture.detectChanges();
        const drivingFaultsLabels = fixture.debugElement.queryAll(By.css('#driving-fault .counter-label'));
        const drivingFaultCount = fixture.debugElement.query(By.css('h1.fault-heading')).nativeElement;
        expect(drivingFaultsLabels[0].nativeElement.innerHTML)
          .toBe((<any>welshTranslations).debrief.competencies.useOfSpeed);
        expect(drivingFaultsLabels[1].nativeElement.innerHTML)
          .toBe((<any>welshTranslations).debrief.competencies.signalsTimed);
        expect(drivingFaultCount.innerHTML).toBe(drivingFaults.length.toString());
        done();
      });
    });

    it('no driving faults showing', () => {
      const drivingFaults = [];
      component.drivingFaults = drivingFaults;
      component.drivingFaultCount = 0;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#driving-fault'))).toBeNull();
    });
  });

  describe('drivingFaultsCardDescriptionSwitch', () => {
    it('Should return debrief.ridingFaultsCardDescription when cat is EUA1M1', () => {
      const value = component.drivingFaultsCardDescriptionSwitch(TestCategory.EUA1M1);
      expect(value).toEqual('debrief.ridingFaultsCardDescription');
    });

    it('Should return debrief.ridingFaultsCardDescription when cat is EUA1M2', () => {
      const value = component.drivingFaultsCardDescriptionSwitch(TestCategory.EUA1M2);
      expect(value).toEqual('debrief.ridingFaultsCardDescription');
    });

    it('Should return debrief.drivingFaultsCardDescription when cat is B', () => {
      const value = component.drivingFaultsCardDescriptionSwitch(TestCategory.B);
      expect(value).toEqual('debrief.drivingFaultsCardDescription');
    });

    it('Should return debrief.drivingFaultsCardDescription when cat is BE', () => {
      const value = component.drivingFaultsCardDescriptionSwitch(TestCategory.BE);
      expect(value).toEqual('debrief.drivingFaultsCardDescription');
    });
  });
});
