import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';

import { JournalEarlyStartModal } from '@pages/journal/components/journal-early-start-modal/journal-early-start-modal';
import {IonButton, IonCard, IonCol, IonRow, IonText} from "@ionic/angular";

@NgModule({
  imports: [CommonModule, FormsModule, ComponentsModule, IonButton, IonCol, IonRow, IonText, IonCard],
  declarations: [JournalEarlyStartModal],
})
export class JournalEarlyStartModule {}
