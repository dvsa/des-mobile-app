import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { ComponentsModule } from '@components/common/common-components.module';
import { TestReportComponentsModule } from '@pages/test-report/components/test-report-components.module';
import {
  TestReportCatAMod2ComponentsModule,
} from '@pages/test-report/cat-a-mod2/components/test-report.cat-mod2.components.module';
import { StoreModule } from '@ngrx/store';
import { testReportReducer } from '@pages/test-report/test-report.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TestReportAnalyticsEffects } from '@pages/test-report/test-report.analytics.effects';
import { TestReportEffects } from '@pages/test-report/test-report.effects';
import { TestResultProvider } from '@providers/test-result/test-result';
import { TestReportCatAMod2PageRoutingModule } from './test-report.cat-a-mod2-routing.module';
import { TestReportCatAMod2Page } from './test-report.cat-a-mod2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestReportCatAMod2PageRoutingModule,
    ComponentsModule,
    TestReportComponentsModule,
    TestReportCatAMod2ComponentsModule,
    StoreModule.forFeature('testReport', testReportReducer),
    EffectsModule.forFeature([
      TestReportAnalyticsEffects,
      TestReportEffects,
    ]),
  ],
  providers: [
    TestReportValidatorProvider,
    TestResultProvider,
  ],
  declarations: [TestReportCatAMod2Page],
})
export class TestReportCatAMod2PageModule {}
