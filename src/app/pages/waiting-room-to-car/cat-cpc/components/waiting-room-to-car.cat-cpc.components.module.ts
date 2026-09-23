import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';

import { WaitingRoomToCarComponentsModule } from '../../components/waiting-room-to-car.components.module';
import { AccompanimentCardCatCPCComponent } from './accompaniment-card/accompaniment-card.cat-cpc';
import { CombinationComponent } from './combination/combination';
import { VehicleDetailsCatCPCComponent } from './vehicle-details/vehicle-details';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [AccompanimentCardCatCPCComponent, CombinationComponent, VehicleDetailsCatCPCComponent],
  imports: [
    IonicComponentsModule,
    ComponentsModule,
    WaitingRoomToCarComponentsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  exports: [AccompanimentCardCatCPCComponent, CombinationComponent, VehicleDetailsCatCPCComponent],
})
export class WaitingRoomToCarCatCPCComponentsModule {}
