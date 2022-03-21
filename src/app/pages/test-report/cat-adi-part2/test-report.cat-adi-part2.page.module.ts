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
import { TestReportCatADIPart2Page } from './test-report.cat-adi-part2.page';
import { TestReportCatADIPart2ComponentsModule } from './components/test-report.cat-adi-part2.components.module';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TestReportCatAdiPart2RoutingModule } from '@pages/test-report/cat-adi-part2/test-report.cat-adi-part2-routing.module';


@NgModule({
  declarations: [
    TestReportCatADIPart2Page,
  ],
  imports: [
    TestReportCatADIPart2ComponentsModule,
    TestReportComponentsModule,
    StoreModule.forFeature('testReport', testReportReducer),
    EffectsModule.forFeature([
      TestReportAnalyticsEffects,
      TestReportEffects,
    ]),
    ComponentsModule,
    CommonModule,
    IonicModule,
    TestReportCatAdiPart2RoutingModule,
  ],
  providers: [
    TestReportValidatorProvider,
    TestResultProvider,
  ],
})


export class TestReportCatADIPart2PageModule {}
