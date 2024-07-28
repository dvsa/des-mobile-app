import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WaitingRoomToCarCatManoeuvrePage } from '@pages/waiting-room-to-car/cat-manoeuvre/waiting-room-to-car.cat-manoeuvre.page';

const routes: Routes = [
	{
		path: '',
		component: WaitingRoomToCarCatManoeuvrePage,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class WaitingRoomToCarCatManoeuvrePageRoutingModule {}
