import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { StoreModule } from '@ngrx/store';
import { testReportReducer } from '@pages/test-report/test-report.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TestReportAnalyticsEffects } from '@pages/test-report/test-report.analytics.effects';
import { TestReportEffects } from '@pages/test-report/test-report.effects';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { TestResultProvider } from '@providers/test-result/test-result';
import { TestReportComponentsModule } from '@pages/test-report/components/test-report-components.module';
import { TestReportDashboardPage } from '@pages/test-report-dashboard/test-report-dashboard.page';
import {
  Adi3EndTestModalModule,
} from '@pages/test-report/cat-adi-part3/components/adi3-end-test-modal/adi3-end-test-modal.module';
import { TestReportDashboardPageRoutingModule } from './test-report-dashboard.routing-module';

@NgModule({
  declarations: [TestReportDashboardPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestReportDashboardPageRoutingModule,
    ComponentsModule,
    StoreModule.forFeature('testReport', testReportReducer),
    EffectsModule.forFeature([
      TestReportAnalyticsEffects,
      TestReportEffects,
    ]),
    TestReportComponentsModule,
    Adi3EndTestModalModule,
  ],
  providers: [
    TestReportValidatorProvider,
    TestResultProvider,
  ],
})
export class TestReportDashboardPageModule {}
