import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TestReportCatCPCPage } from './test-report.cat-cpc.page';

const routes: Routes = [
	{
		path: '',
		component: TestReportCatCPCPage,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class TestReportCatCPCPageRoutingModule {}
