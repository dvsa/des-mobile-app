import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonButton, IonCard, IonCol, IonRow } from '@ionic/angular';
import { JournalForceCheckModal } from '@pages/journal/components/journal-force-check-modal/journal-force-check-modal';

@NgModule({
  imports: [CommonModule, FormsModule, IonCol, IonRow, IonButton, IonCard, JournalForceCheckModal],
})
export class JournalForceCheckModule {}
