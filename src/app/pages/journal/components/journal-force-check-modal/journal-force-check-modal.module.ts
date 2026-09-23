import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from '@components/common/common-components.module';
import { JournalForceCheckModal } from '@pages/journal/components/journal-force-check-modal/journal-force-check-modal';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  imports: [IonicComponentsModule, CommonModule, FormsModule, ComponentsModule],
  declarations: [JournalForceCheckModal],
})
export class JournalForceCheckModule {}
