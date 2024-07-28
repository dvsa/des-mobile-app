import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';
import { VehicleChecksModalCatDModule } from '@pages/waiting-room-to-car/cat-d/components/vehicle-checks-modal/vehicle-checks-modal.cat-d.page.module';

@NgModule({
	imports: [IonicModule, ComponentsModule, ReactiveFormsModule, CommonModule, VehicleChecksModalCatDModule],
})
export class WaitingRoomToCarCatDComponentsModule {}
