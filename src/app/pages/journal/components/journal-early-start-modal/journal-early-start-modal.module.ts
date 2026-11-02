import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonButton, IonCard, IonCol, IonRow, IonText } from '@ionic/angular';
import { JournalEarlyStartModal } from '@pages/journal/components/journal-early-start-modal/journal-early-start-modal';

@NgModule({
  imports: [CommonModule, FormsModule, IonButton, IonCol, IonRow, IonText, IonCard, JournalEarlyStartModal],
})
export class JournalEarlyStartModule {}
