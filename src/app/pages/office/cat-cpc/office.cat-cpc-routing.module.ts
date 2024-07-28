import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OfficeCatCPCPage } from './office.cat-cpc.page';

const routes: Routes = [
	{
		path: '',
		component: OfficeCatCPCPage,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class OfficeCatCPCPageRoutingModule {}
