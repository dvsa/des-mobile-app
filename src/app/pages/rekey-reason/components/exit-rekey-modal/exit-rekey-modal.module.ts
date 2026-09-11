import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ExitRekeyModal } from './exit-rekey-modal';
import {IonButton, IonCard, IonCol, IonGrid, IonIcon, IonRow, IonText} from "@ionic/angular";

@NgModule({
  declarations: [ExitRekeyModal],
  imports: [CommonModule, IonRow, IonCol, IonButton, IonGrid, IonCard, IonIcon, IonText],
  exports: [ExitRekeyModal],
})
export class ExitRekeyModalModule {}
