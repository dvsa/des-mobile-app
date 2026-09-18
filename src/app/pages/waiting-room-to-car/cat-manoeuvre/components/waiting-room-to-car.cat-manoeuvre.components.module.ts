import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonCol, IonRow } from '@ionic/angular';
import { DimensionsComponent } from '@pages/waiting-room-to-car/cat-manoeuvre/components/dimensions/dimensions';
import { PipesModule } from '@shared/pipes/pipes.module';

@NgModule({
  declarations: [DimensionsComponent],
  imports: [ComponentsModule, ReactiveFormsModule, CommonModule, PipesModule, IonCol, IonRow],
  exports: [DimensionsComponent],
})
export class WaitingRoomToCarCatManoeuvreComponentsModule {}
