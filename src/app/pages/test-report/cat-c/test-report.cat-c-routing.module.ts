import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestReportCatCPage } from './test-report.cat-c.page';

const routes: Routes = [
	{
		path: '',
		component: TestReportCatCPage,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class TestReportCatCPageRoutingModule {}
