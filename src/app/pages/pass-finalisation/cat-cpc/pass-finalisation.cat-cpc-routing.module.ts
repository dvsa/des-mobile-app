import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PassFinalisationCatCPCPage } from './pass-finalisation.cat-cpc.page';

const routes: Routes = [
	{
		path: '',
		component: PassFinalisationCatCPCPage,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PassFinalisationCatCPCPageRoutingModule {}
