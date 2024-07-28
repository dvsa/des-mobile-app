import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfficeCatCPage } from './office.cat-c.page';

const routes: Routes = [
	{
		path: '',
		component: OfficeCatCPage,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class OfficeCatCPageRoutingModule {}
