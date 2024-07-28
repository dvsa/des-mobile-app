import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WaitingRoomToCarCatCPage } from './waiting-room-to-car.cat-c.page';

const routes: Routes = [
	{
		path: '',
		component: WaitingRoomToCarCatCPage,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class WaitingRoomToCarCatCPageRoutingModule {}
