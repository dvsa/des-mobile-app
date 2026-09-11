import { NgModule } from '@angular/core';

import { IonButton, IonCard, IonCol, IonRow, IonText } from '@ionic/angular';
import { EndTestModal } from './end-test-modal';

@NgModule({
  declarations: [EndTestModal],

  exports: [EndTestModal],
  imports: [IonText, IonCol, IonRow, IonCard, IonButton],
})
export class EndTestModalModule {}
