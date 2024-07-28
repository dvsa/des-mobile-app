import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';

import { ComponentsModule } from '@components/common/common-components.module';
import { WaitingRoomToCarCatCPCComponentsModule } from '@pages/waiting-room-to-car/cat-cpc/components/waiting-room-to-car.cat-cpc.components.module';
import { WaitingRoomToCarComponentsModule } from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { WaitingRoomToCarAnalyticsEffects } from '@pages/waiting-room-to-car/waiting-room-to-car.analytics.effects';
import { WaitingRoomToCarEffects } from '@pages/waiting-room-to-car/waiting-room-to-car.effects';
import { WaitingRoomToCarCatCPCPageRoutingModule } from './waiting-room-to-car.cat-cpc-routing.module';
import { WaitingRoomToCarCatCPCPage } from './waiting-room-to-car.cat-cpc.page';

@NgModule({
	declarations: [WaitingRoomToCarCatCPCPage],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		WaitingRoomToCarCatCPCPageRoutingModule,
		ComponentsModule,
		ReactiveFormsModule,
		WaitingRoomToCarComponentsModule,
		WaitingRoomToCarCatCPCComponentsModule,
		EffectsModule.forFeature([WaitingRoomToCarEffects, WaitingRoomToCarAnalyticsEffects]),
	],
})
export class WaitingRoomToCarCatCPCPageModule {}
