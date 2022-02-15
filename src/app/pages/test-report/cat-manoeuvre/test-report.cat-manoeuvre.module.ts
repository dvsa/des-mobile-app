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
  ReverseDiagramModalComponentsModule,
} from '@pages/test-report/components/reverse-diagram-modal/reverse-diagram-modal.components.module';
import {
  TestReportCatManoeuvreComponentsModule,
} from '@pages/test-report/cat-manoeuvre/components/test-report.cat-manoeuvre.components.module';
import { TestReportCatManoeuvrePage } from './test-report.cat-manoeuvre.page';
import { TestReportCatManoeuvrePageRoutingModule } from './test-report.cat-manoeuvre.routing-module';

@NgModule({
  declarations: [TestReportCatManoeuvrePage],
  imports: [
    TestReportComponentsModule,
    StoreModule.forFeature('testReport', testReportReducer),
    EffectsModule.forFeature([
      TestReportAnalyticsEffects,
      TestReportEffects,
    ]),
    ComponentsModule,
    CommonModule,
    IonicModule,
    TestReportCatManoeuvrePageRoutingModule,
    ReverseDiagramModalComponentsModule,
    TestReportCatManoeuvreComponentsModule,
  ],
  providers: [
    TestReportValidatorProvider,
    TestResultProvider,
  ],
})
export class TestReportCatManoeuvrePageModule {}
