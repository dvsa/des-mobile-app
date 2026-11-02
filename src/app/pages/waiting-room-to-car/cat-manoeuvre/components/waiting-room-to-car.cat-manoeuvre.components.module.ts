import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonCol, IonRow } from '@ionic/angular';
import { DimensionsComponent } from '@pages/waiting-room-to-car/cat-manoeuvre/components/dimensions/dimensions';

@NgModule({
  imports: [ReactiveFormsModule, CommonModule, IonCol, IonRow, DimensionsComponent],
  exports: [DimensionsComponent],
})
export class WaitingRoomToCarCatManoeuvreComponentsModule {}
