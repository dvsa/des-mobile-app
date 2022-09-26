import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { DirectivesModule } from '@directives/directives.module';
import { ComponentsModule } from '@components/common/common-components.module';
import {
  TraineeLicenceComponent,
} from '@pages/waiting-room-to-car/cat-adi-part3/components/trainee-licence/trainee-licence';
import {
  AccompanimentCardADI3Component,
} from '@pages/waiting-room-to-car/cat-adi-part3/components/accompaniment-card/accompaniment-card';
import { WaitingRoomToCarComponentsModule } from '../../components/waiting-room-to-car.components.module';

@NgModule({
  declarations: [
    AccompanimentCardADI3Component,
    TraineeLicenceComponent,
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
    AccompanimentCardADI3Component,
    TraineeLicenceComponent,
    TraineeLicenceComponent,
    AccompanimentCardADI3Component,
  ],
})
export class WaitingRoomToCarCatADIPart3ComponentsModule { }
