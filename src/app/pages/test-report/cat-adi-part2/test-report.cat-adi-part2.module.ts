import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestReportComponentsModule } from '@pages/test-report/components/test-report-components.module';
import { ComponentsModule } from '@components/common/common-components.module';
import {
  TestReportCatADIPart2ComponentsModule,
} from '@pages/test-report/cat-adi-part2/components/test-report.cat-adi-part2.components.module';
import { StoreModule } from '@ngrx/store';
import { testReportReducer } from '@pages/test-report/test-report.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TestReportAnalyticsEffects } from '@pages/test-report/test-report.analytics.effects';
import { TestReportEffects } from '@pages/test-report/test-report.effects';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { TestResultProvider } from '@providers/test-result/test-result';
import { TestReportCatADIPart2PageRoutingModule } from './test-report.cat-adi-part2-routing.module';
import { TestReportCatADI2Page } from './test-report.cat-adi-part2.page';

@NgModule({
  declarations: [TestReportCatADI2Page],
  imports: [
    StoreModule.forFeature('testReport', testReportReducer),
    EffectsModule.forFeature([
      TestReportAnalyticsEffects,
      TestReportEffects,
    ]),
    CommonModule,
    FormsModule,
    IonicModule,
    TestReportCatADIPart2PageRoutingModule,
    TestReportComponentsModule,
    ComponentsModule,
    TestReportCatADIPart2ComponentsModule,
  ],
  providers: [
    TestReportValidatorProvider,
    TestResultProvider,
  ],
})
export class TestReportCatADIPart2PageModule {}
