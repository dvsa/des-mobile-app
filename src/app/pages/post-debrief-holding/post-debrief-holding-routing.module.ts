import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostDebriefHoldingPage } from './post-debrief-holding.page';

const routes: Routes = [
	{
		path: '',
		component: PostDebriefHoldingPage,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PostDebriefHoldingPageRoutingModule {}
