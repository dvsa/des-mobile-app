import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';

import { IonCol, IonRow, IonSelect, IonSelectOption } from '@ionic/angular';
import { WaitingRoomToCarComponentsModule } from '../../components/waiting-room-to-car.components.module';
import { AccompanimentCardCatCPCComponent } from './accompaniment-card/accompaniment-card.cat-cpc';
import { CombinationComponent } from './combination/combination';
import { VehicleDetailsCatCPCComponent } from './vehicle-details/vehicle-details';

@NgModule({
  imports: [
    ComponentsModule,
    WaitingRoomToCarComponentsModule,
    ReactiveFormsModule,
    CommonModule,
    IonRow,
    IonCol,
    IonSelect,
    IonSelectOption,
    AccompanimentCardCatCPCComponent,
    CombinationComponent,
    VehicleDetailsCatCPCComponent,
  ],
  exports: [AccompanimentCardCatCPCComponent, CombinationComponent, VehicleDetailsCatCPCComponent],
})
export class WaitingRoomToCarCatCPCComponentsModule {}
