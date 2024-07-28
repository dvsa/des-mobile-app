import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestReportComponentsModule } from '@pages/test-report/components/test-report-components.module';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { TestResultProvider } from '@providers/test-result/test-result';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TestReportCatAMod1ComponentsModule } from '@pages/test-report/cat-a-mod1/components/test-report.cat-a-mod1.components.module';
import { TestReportAnalyticsEffects } from '@pages/test-report/test-report.analytics.effects';
import { TestReportEffects } from '@pages/test-report/test-report.effects';
import { testReportReducer } from '@pages/test-report/test-report.reducer';
import { TestReportCatAMod1PageRoutingModule } from './test-report.cat-a-mod1-routing.module';
import { TestReportCatAMod1Page } from './test-report.cat-a-mod1.page';

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
    EffectsModule.forFeature([TestReportAnalyticsEffects, TestReportEffects]),
    TestReportCatAMod1ComponentsModule,
  ],
  providers: [TestReportValidatorProvider, TestResultProvider],
})
export class TestReportCatAMod1PageModule {}
