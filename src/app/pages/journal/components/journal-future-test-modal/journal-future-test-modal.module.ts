import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from '@components/common/common-components.module';
import { IonButton, IonCard, IonCol, IonIcon, IonRow, IonText } from '@ionic/angular';
import { JournalFutureTestModal } from '@pages/journal/components/journal-future-test-modal/journal-future-test-modal';

@NgModule({
  imports: [CommonModule, FormsModule, ComponentsModule, IonButton, IonCol, IonRow, IonCard, IonIcon, IonText],
  declarations: [JournalFutureTestModal],
})
export class JournalFutureTestModalModule {}
