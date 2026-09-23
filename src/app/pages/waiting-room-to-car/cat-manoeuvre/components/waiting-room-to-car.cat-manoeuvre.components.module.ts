import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { DimensionsComponent } from '@pages/waiting-room-to-car/cat-manoeuvre/components/dimensions/dimensions';
import { PipesModule } from '@shared/pipes/pipes.module';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [DimensionsComponent],
  imports: [IonicComponentsModule, ComponentsModule, ReactiveFormsModule, CommonModule, PipesModule],
  exports: [DimensionsComponent],
})
export class WaitingRoomToCarCatManoeuvreComponentsModule {}
