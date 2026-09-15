import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from '@components/common/common-components.module';
import { IonButton, IonCard, IonCol, IonRow, IonText } from '@ionic/angular';
import { JournalRekeyModal } from '@pages/journal/components/journal-rekey-modal/journal-rekey-modal';

@NgModule({
  imports: [CommonModule, FormsModule, ComponentsModule, IonButton, IonCol, IonRow, IonText, IonCard],
  declarations: [JournalRekeyModal],
})
export class JournalRekeyModalModule {}
