import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PassCertificatesPage } from './pass-certificates.page';

const routes: Routes = [
	{
		path: '',
		component: PassCertificatesPage,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PassCertificatesPageRoutingModule {}
