import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TestReportCatHomeTestPageRoutingModule } from '@pages/test-report/cat-home-test/test-report.cat-home-test-routing.module';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { TestResultProvider } from '@providers/test-result/test-result';
import { ReverseDiagramModalComponentsModule } from '../components/reverse-diagram-modal/reverse-diagram-modal.components.module';
import { TestReportComponentsModule } from '../components/test-report-components.module';
import { TestReportAnalyticsEffects } from '../test-report.analytics.effects';
import { TestReportEffects } from '../test-report.effects';
import { testReportReducer } from '../test-report.reducer';
import { TestReportCatHomeTestComponentsModule } from './components/test-report.cat-home-test.components.module';
import { TestReportCatHomeTestPage } from './test-report.cat-home-test.page';

@NgModule({
	declarations: [TestReportCatHomeTestPage],
	imports: [
		TestReportComponentsModule,
		StoreModule.forFeature('testReport', testReportReducer),
		EffectsModule.forFeature([TestReportAnalyticsEffects, TestReportEffects]),
		ComponentsModule,
		TestReportCatHomeTestComponentsModule,
		ReverseDiagramModalComponentsModule,
		CommonModule,
		IonicModule,
		ComponentsModule,
		TestReportCatHomeTestPageRoutingModule,
	],
	providers: [TestReportValidatorProvider, TestResultProvider],
})
export class TestReportCatHomeTestPageModule {}
