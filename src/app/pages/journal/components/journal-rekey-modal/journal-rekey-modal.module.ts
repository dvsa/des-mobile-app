import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { JournalRekeyModal } from '@pages/journal/components/journal-rekey-modal/journal-rekey-modal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
  ],
  declarations: [
    JournalRekeyModal,
  ],
})
export class JournalRekeyModalModule {}
