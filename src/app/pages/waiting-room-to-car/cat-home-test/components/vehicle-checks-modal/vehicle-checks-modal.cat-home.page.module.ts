import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { VehicleChecksCatHomeTestModal } from '@pages/waiting-room-to-car/cat-home-test/components/vehicle-checks-modal/vehicle-checks-modal.cat-home.page';
import { WaitingRoomToCarComponentsModule } from '../../../components/waiting-room-to-car.components.module';
import { VehicleChecksModalCatHomeTestAnalyticsEffects } from './vehicle-checks-modal.cat-home-test.analytics.effects';

@NgModule({
	declarations: [VehicleChecksCatHomeTestModal],
	imports: [
		EffectsModule.forFeature([VehicleChecksModalCatHomeTestAnalyticsEffects]),
		ComponentsModule,
		WaitingRoomToCarComponentsModule,
		IonicModule,
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
	],
})
export class VehicleChecksModalCatHomeModule {}
