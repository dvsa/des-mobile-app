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
import {
  TestReportCatADIPart3ComponentsModule,
} from '@pages/test-report/cat-adi-part3/components/test-report.cat-adi-part3.components.module';
import { TestReportComponentsModule } from '@pages/test-report/components/test-report-components.module';
import {
  TestReportCatCPCComponentsModule,
} from '@pages/test-report/cat-cpc/components/test-report.cat-cpc.components.module';
import { TestReportCatADI3Page } from './test-report.cat-adi-part3.page';
import { TestReportCatADIPart3PageRoutingModule } from './test-report.cat-adi-part3.routing.module';

@NgModule({
  declarations: [TestReportCatADI3Page],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestReportCatADIPart3PageRoutingModule,
    TestReportCatADIPart3ComponentsModule,
    TestReportCatCPCComponentsModule,
    ComponentsModule,
    StoreModule.forFeature('testReport', testReportReducer),
    EffectsModule.forFeature([
      TestReportAnalyticsEffects,
      TestReportEffects,
    ]),
    TestReportComponentsModule,
  ],
  providers: [
    TestReportValidatorProvider,
    TestResultProvider,
  ],
})
export class TestReportCatADIPart3PageModule {}
