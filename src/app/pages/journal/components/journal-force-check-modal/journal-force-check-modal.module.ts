import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import {
  JournalForceCheckModal,
} from '@pages/journal/components/journal-force-check-modal/journal-force-check-modal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
  ],
  declarations: [
    JournalForceCheckModal,
  ],
})
export class JournalForceCheckModule {}
