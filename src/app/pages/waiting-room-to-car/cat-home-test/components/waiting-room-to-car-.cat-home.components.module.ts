import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';
import { VehicleChecksModalCatHomeModule } from '@pages/waiting-room-to-car/cat-home-test/components/vehicle-checks-modal/vehicle-checks-modal.cat-home.page.module';

@NgModule({
	imports: [IonicModule, ComponentsModule, ReactiveFormsModule, CommonModule, VehicleChecksModalCatHomeModule],
})
export class WaitingRoomToCarCatHomeComponentsModule {}
