import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TestReportCatCPCComponentsModule } from '@pages/test-report/cat-cpc/components/test-report.cat-cpc.components.module';
import { TestReportAnalyticsEffects } from '@pages/test-report/test-report.analytics.effects';
import { TestReportEffects } from '@pages/test-report/test-report.effects';
import { testReportReducer } from '@pages/test-report/test-report.reducer';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { TestResultProvider } from '@providers/test-result/test-result';
import { TestReportCatCPCPageRoutingModule } from './test-report.cat-cpc-routing.module';
import { TestReportCatCPCPage } from './test-report.cat-cpc.page';

@NgModule({
	declarations: [TestReportCatCPCPage],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		TestReportCatCPCComponentsModule,
		TestReportCatCPCPageRoutingModule,
		StoreModule.forFeature('testReport', testReportReducer),
		EffectsModule.forFeature([TestReportAnalyticsEffects, TestReportEffects]),
		ComponentsModule,
	],
	providers: [TestReportValidatorProvider, TestResultProvider],
})
export class TestReportCatCPCPageModule {}
