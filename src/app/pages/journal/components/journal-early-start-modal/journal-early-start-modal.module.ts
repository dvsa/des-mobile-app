import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { IonicModule } from '@ionic/angular';
import { JournalEarlyStartModal } from '@pages/journal/components/journal-early-start-modal/journal-early-start-modal';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ComponentsModule, ModalAlertTitleComponent],
  declarations: [JournalEarlyStartModal],
})
export class JournalEarlyStartModule {}
