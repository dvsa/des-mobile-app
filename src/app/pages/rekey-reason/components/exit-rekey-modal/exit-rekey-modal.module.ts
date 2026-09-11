import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IonButton, IonCard, IonCol, IonGrid, IonIcon, IonRow, IonText } from '@ionic/angular';
import { ExitRekeyModal } from './exit-rekey-modal';

@NgModule({
  declarations: [ExitRekeyModal],
  imports: [CommonModule, IonRow, IonCol, IonButton, IonGrid, IonCard, IonIcon, IonText],
  exports: [ExitRekeyModal],
})
export class ExitRekeyModalModule {}
