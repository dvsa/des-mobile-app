import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IonButton, IonCard, IonCol, IonGrid, IonIcon, IonRow, IonText } from '@ionic/angular';
import { UploadRekeyModal } from './upload-rekey-modal';

@NgModule({
  declarations: [UploadRekeyModal],
  imports: [CommonModule, IonText, IonCol, IonButton, IonRow, IonIcon, IonGrid, IonCard],
  exports: [UploadRekeyModal],
})
export class UploadRekeyModalModule {}
