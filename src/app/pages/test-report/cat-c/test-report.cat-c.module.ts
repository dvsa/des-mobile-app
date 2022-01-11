import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { TestResultProvider } from '@providers/test-result/test-result';
import { TestReportComponentsModule } from '@pages/test-report/components/test-report-components.module';
import { testReportReducer } from '@pages/test-report/test-report.reducer';
import { TestReportAnalyticsEffects } from '@pages/test-report/test-report.analytics.effects';
import { TestReportEffects } from '@pages/test-report/test-report.effects';
import { ComponentsModule } from '@components/common/common-components.module';
import {
  TestReportCatCComponentsModule,
} from '@pages/test-report/cat-c/components/test-report.cat-c.components.module';
import {
  ReverseDiagramModalComponentsModule,
} from '@pages/test-report/components/reverse-diagram-modal/reverse-diagram-modal.components.module';
import { TestReportCatCPage } from './test-report.cat-c.page';
import { TestReportCatCPageRoutingModule } from './test-report.cat-c-routing.module';

@NgModule({
  declarations: [TestReportCatCPage],
  imports: [
    TestReportCatCComponentsModule,
    TestReportComponentsModule,
    StoreModule.forFeature('testReport', testReportReducer),
    EffectsModule.forFeature([
      TestReportAnalyticsEffects,
      TestReportEffects,
    ]),
    ComponentsModule,
    CommonModule,
    IonicModule,
    TestReportCatCPageRoutingModule,
    ReverseDiagramModalComponentsModule,
  ],
  providers: [
    TestReportValidatorProvider,
    TestResultProvider,
  ],
})
export class TestReportCatCPageModule {}
