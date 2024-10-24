import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestReportCatDComponentsModule } from '@pages/test-report/cat-d/components/test-report.cat-d.components.module';
import { TestReportCatDPageRoutingModule } from '@pages/test-report/cat-d/test-report.cat-d-routing.module';
import { ReverseDiagramModalComponentsModule } from '@pages/test-report/components/reverse-diagram-modal/reverse-diagram-modal.components.module';
import { TestReportComponentsModule } from '@pages/test-report/components/test-report-components.module';
import { TestReportAnalyticsEffects } from '@pages/test-report/test-report.analytics.effects';
import { TestReportEffects } from '@pages/test-report/test-report.effects';
import { testReportReducer } from '@pages/test-report/test-report.reducer';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { TestResultProvider } from '@providers/test-result/test-result';
import { TestReportCatDPage } from './test-report.cat-d.page';

@NgModule({
  declarations: [TestReportCatDPage],
  imports: [
    TestReportCatDComponentsModule,
    TestReportComponentsModule,
    StoreModule.forFeature('testReport', testReportReducer),
    EffectsModule.forFeature([TestReportAnalyticsEffects, TestReportEffects]),
    ComponentsModule,
    CommonModule,
    IonicModule,
    TestReportCatDPageRoutingModule,
    ReverseDiagramModalComponentsModule,
  ],
  providers: [TestReportValidatorProvider, TestResultProvider],
})
export class TestReportCatDPageModule {}
