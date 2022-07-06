import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { DirectivesModule } from '@directives/directives.module';
import { ComponentsModule } from '@components/common/common-components.module';
import {
  DualControlsComponent,
} from '@pages/waiting-room-to-car/cat-adi-part3/components/dual-controls/dual-controls';
import { PDILogbookComponent } from '@pages/waiting-room-to-car/cat-adi-part3/components/pdi-logbook/pdi-logbook';
import {
  TraineeLicenceComponent,
} from '@pages/waiting-room-to-car/cat-adi-part3/components/trainee-licence/trainee-licence';
import {
  AccompanimentCardADI3Component,
} from '@pages/waiting-room-to-car/cat-adi-part3/components/accompaniment-card/accompaniment-card';
import { WaitingRoomToCarComponentsModule } from '../../components/waiting-room-to-car.components.module';

@NgModule({
  declarations: [
    DualControlsComponent,
    PDILogbookComponent,
    TraineeLicenceComponent,
    AccompanimentCardADI3Component,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    IonicModule,
    DirectivesModule,
    WaitingRoomToCarComponentsModule,
    ReactiveFormsModule,
  ],
  exports: [
    DualControlsComponent,
    PDILogbookComponent,
    TraineeLicenceComponent,
    AccompanimentCardADI3Component,
  ],
})
export class WaitingRoomToCarCatADIPart3ComponentsModule { }
