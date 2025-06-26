import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { JournalRekeyModal } from '@pages/journal/components/journal-rekey-modal/journal-rekey-modal';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ComponentsModule, ModalAlertTitleComponent],
  declarations: [JournalRekeyModal],
})
export class JournalRekeyModalModule {}
