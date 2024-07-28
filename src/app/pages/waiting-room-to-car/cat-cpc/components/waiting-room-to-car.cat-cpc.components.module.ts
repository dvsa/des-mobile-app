import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';
import { WaitingRoomToCarComponentsModule } from '../../components/waiting-room-to-car.components.module';
import { AccompanimentCardCatCPCComponent } from './accompaniment-card/accompaniment-card.cat-cpc';
import { CombinationComponent } from './combination/combination';
import { VehicleDetailsCatCPCComponent } from './vehicle-details/vehicle-details';

@NgModule({
	declarations: [AccompanimentCardCatCPCComponent, CombinationComponent, VehicleDetailsCatCPCComponent],
	imports: [IonicModule, ComponentsModule, WaitingRoomToCarComponentsModule, ReactiveFormsModule, CommonModule],
	exports: [AccompanimentCardCatCPCComponent, CombinationComponent, VehicleDetailsCatCPCComponent],
})
export class WaitingRoomToCarCatCPCComponentsModule {}
