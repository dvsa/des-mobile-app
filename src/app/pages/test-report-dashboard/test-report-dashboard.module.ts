import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TestReportCatADIPart3ComponentsModule } from '@pages/test-report-dashboard/components/test-report-dashboard.components.module';
import { TestReportDashboardAnalyticsEffects } from '@pages/test-report-dashboard/test-report-dashboard.analytics.effects';
import { TestReportDashboardPage } from '@pages/test-report-dashboard/test-report-dashboard.page';
import { Adi3EndTestModalModule } from '@pages/test-report/cat-adi-part3/components/adi3-end-test-modal/adi3-end-test-modal.module';
import { TestReportComponentsModule } from '@pages/test-report/components/test-report-components.module';
import { TestReportAnalyticsEffects } from '@pages/test-report/test-report.analytics.effects';
import { TestReportEffects } from '@pages/test-report/test-report.effects';
import { testReportReducer } from '@pages/test-report/test-report.reducer';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { TestResultProvider } from '@providers/test-result/test-result';
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
		EffectsModule.forFeature([TestReportAnalyticsEffects, TestReportDashboardAnalyticsEffects, TestReportEffects]),
		TestReportComponentsModule,
		Adi3EndTestModalModule,
		TestReportCatADIPart3ComponentsModule,
	],
	providers: [TestReportValidatorProvider, TestResultProvider],
})
export class TestReportDashboardPageModule {}
