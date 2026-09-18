import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LogoutModal } from '@components/common/logout-modal/logout-modal';
import { IonButton, IonCard, IonCol, IonRow, IonText } from '@ionic/angular';

@NgModule({
  imports: [CommonModule, IonText, IonCol, IonRow, IonCard, IonButton],
  declarations: [LogoutModal],
})
export class LogoutModalModule {}
