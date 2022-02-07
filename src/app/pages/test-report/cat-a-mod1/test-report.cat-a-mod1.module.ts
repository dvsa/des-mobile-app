import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestReportComponentsModule } from '@pages/test-report/components/test-report-components.module';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { TestResultProvider } from '@providers/test-result/test-result';

import { StoreModule } from '@ngrx/store';
import { testReportReducer } from '@pages/test-report/test-report.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TestReportAnalyticsEffects } from '@pages/test-report/test-report.analytics.effects';
import { TestReportEffects } from '@pages/test-report/test-report.effects';
import {
  TestReportCatAMod1ComponentsModule,
} from '@pages/test-report/cat-a-mod1/components/test-report.cat-a-mod1.components.module';
import { TestReportCatAMod1Page } from './test-report.cat-a-mod1.page';
import { TestReportCatAMod1PageRoutingModule } from './test-report.cat-a-mod1-routing.module';

@NgModule({
  declarations: [TestReportCatAMod1Page],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestReportCatAMod1PageRoutingModule,
    ComponentsModule,
    TestReportComponentsModule,
    StoreModule.forFeature('testReport', testReportReducer),
    EffectsModule.forFeature([
      TestReportAnalyticsEffects,
      TestReportEffects,
    ]),
    TestReportCatAMod1ComponentsModule,
  ],
  providers: [
    TestReportValidatorProvider,
    TestResultProvider,
  ],
})
export class TestReportCatAMod1PageModule {}
