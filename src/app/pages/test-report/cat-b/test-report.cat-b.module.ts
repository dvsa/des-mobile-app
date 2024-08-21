import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';
import { TestReportCatBPageRoutingModule } from '@pages/test-report/cat-b/test-report.cat-b-routing.module';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { TestResultProvider } from '@providers/test-result/test-result';
import { TestReportComponentsModule } from '../components/test-report-components.module';
import { TestReportAnalyticsEffects } from '../test-report.analytics.effects';
import { TestReportEffects } from '../test-report.effects';
import { testReportReducer } from '../test-report.reducer';
import { TestReportCatBComponentsModule } from './components/test-report.cat-b.components.module';
import { TestReportCatBPage } from './test-report.cat-b.page';

@NgModule({
  declarations: [TestReportCatBPage],
  imports: [
    TestReportCatBComponentsModule,
    TestReportComponentsModule,
    StoreModule.forFeature('testReport', testReportReducer),
    EffectsModule.forFeature([TestReportAnalyticsEffects, TestReportEffects]),
    ComponentsModule,
    CommonModule,
    IonicModule,
    TestReportCatBPageRoutingModule,
  ],
  providers: [TestReportValidatorProvider, TestResultProvider],
})
export class TestReportCatBPageModule {}
