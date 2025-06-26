import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { JournalForceCheckModal } from '@pages/journal/components/journal-force-check-modal/journal-force-check-modal';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ComponentsModule, ModalAlertTitleComponent],
  declarations: [JournalForceCheckModal],
})
export class JournalForceCheckModule {}
