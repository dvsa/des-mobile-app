import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestReportCatDPage } from './test-report.cat-d.page';

const routes: Routes = [
	{
		path: '',
		component: TestReportCatDPage,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class TestReportCatDPageRoutingModule {}
