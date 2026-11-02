import { NgModule } from '@angular/core';

import { IonCard, IonCol, IonRow } from '@ionic/angular';
import { EtaInvalidModal } from './eta-invalid-modal';

@NgModule({
  imports: [IonRow, IonCol, IonCard, EtaInvalidModal],
  exports: [EtaInvalidModal],
})
export class EtaInvalidModalModule {}
