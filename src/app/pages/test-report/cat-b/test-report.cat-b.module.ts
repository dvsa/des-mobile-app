import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { TestReportAnalyticsEffects } from '../test-report.analytics.effects';
import { testReportReducer } from '../test-report.reducer';
import { ComponentsModule } from '@components/common/common-components.module';
import { TestReportComponentsModule } from '../components/test-report-components.module';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { TestReportEffects } from '../test-report.effects';
import { TestResultProvider } from '@providers/test-result/test-result';
import { TestReportCatBPage } from './test-report.cat-b.page';
import { TestReportCatBComponentsModule } from './components/test-report.cat-b.components.module';
import { TestReportCatBPageRoutingModule } from '@pages/test-report/cat-b/test-report.cat-b-routing.module';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    TestReportCatBPage,
  ],
  imports: [
    TestReportCatBComponentsModule,
    TestReportComponentsModule,
    StoreModule.forFeature('testReport', testReportReducer),
    EffectsModule.forFeature([
      TestReportAnalyticsEffects,
      TestReportEffects,
    ]),
    ComponentsModule,
    CommonModule,
    IonicModule,
    TestReportCatBPageRoutingModule,
  ],
  providers: [
    TestReportValidatorProvider,
    TestResultProvider,
  ],
})
export class TestReportCatBPageModule {}
