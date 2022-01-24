import { NgModule } from '@angular/core';
import { SearchProvider } from '@providers/search/search';
import { EffectsModule } from '@ngrx/effects';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ComponentsModule } from '@components/common/common-components.module';

import { TestResultsSearchRoutingModule } from '@pages/test-results-search/test-results-search-routing.module';
import { DirectivesModule } from '@directives/directives.module';
import { ErrorPageModule } from '@pages/error-page/error.module';
import { CompressionProvider } from '@providers/compression/compression';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { ViewTestResultPageModule } from '@pages/view-test-result/view-test-result.module';
import { TestResultsSearchComponentsModule } from './components/test-results-search-components.module';
import { TestResultsSearchAnalyticsEffects } from './test-results-search.analytics.effects';
import { TestResultsSearchPage } from './test-results-search';

@NgModule({
  declarations: [
    TestResultsSearchPage,
  ],
  imports: [
    ComponentsModule,
    TestResultsSearchComponentsModule,
    IonicModule,
    CommonModule,
    ErrorPageModule,
    TestResultsSearchRoutingModule,
    ScrollingModule,
    EffectsModule.forFeature([
      TestResultsSearchAnalyticsEffects,
    ]),
    DirectivesModule,
    ViewTestResultPageModule,
  ],
  providers: [
    SearchProvider,
    CompressionProvider,
    FaultSummaryProvider,
  ],
})
export class TestResultsSearchPageModule {}
