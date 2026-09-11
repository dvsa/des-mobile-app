import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from '@components/common/common-components.module';
import { JournalForceCheckModal } from '@pages/journal/components/journal-force-check-modal/journal-force-check-modal';
import {IonButton, IonCard, IonCol, IonRow} from "@ionic/angular";

@NgModule({
  imports: [CommonModule, FormsModule, ComponentsModule, IonCol, IonRow, IonButton, IonCard],
  declarations: [JournalForceCheckModal],
})
export class JournalForceCheckModule {}
