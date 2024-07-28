import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TestReportDashboardPage } from './test-report-dashboard.page';

const routes: Routes = [
	{
		path: '',
		component: TestReportDashboardPage,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class TestReportDashboardPageRoutingModule {}
