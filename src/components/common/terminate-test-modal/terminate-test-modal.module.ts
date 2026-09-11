import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TerminateTestModal } from '@components/common/terminate-test-modal/terminate-test-modal';
import {IonButton, IonCard, IonCol, IonIcon, IonRow, IonText} from '@ionic/angular';

@NgModule({
  imports: [CommonModule, IonRow, IonIcon, IonCol, IonCard, IonText, IonButton],
  declarations: [TerminateTestModal],
})
export class TerminateTestModalModule {}
