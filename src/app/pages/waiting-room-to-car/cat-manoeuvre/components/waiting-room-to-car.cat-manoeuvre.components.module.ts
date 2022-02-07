import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '@components/common/common-components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DimensionsComponent } from '@pages/waiting-room-to-car/cat-manoeuvre/components/dimensions/dimensions';
import {PipesModule} from '@shared/pipes/pipes.module';

@NgModule({
  declarations: [
    DimensionsComponent,
  ],
    imports: [
        IonicModule,
        ComponentsModule,
        ReactiveFormsModule,
        CommonModule,
        PipesModule,
    ],
  exports: [
    DimensionsComponent,
  ],
})
export class WaitingRoomToCarCatManoeuvreComponentsModule { }
