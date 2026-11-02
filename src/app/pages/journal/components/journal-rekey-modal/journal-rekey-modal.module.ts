import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonButton, IonCard, IonCol, IonRow, IonText } from '@ionic/angular';
import { JournalRekeyModal } from '@pages/journal/components/journal-rekey-modal/journal-rekey-modal';

@NgModule({
  imports: [CommonModule, FormsModule, IonButton, IonCol, IonRow, IonText, IonCard, JournalRekeyModal],
})
export class JournalRekeyModalModule {}
