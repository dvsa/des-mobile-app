import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';

import { JournalEarlyStartModal } from '@pages/journal/components/journal-early-start-modal/journal-early-start-modal';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  imports: [IonicComponentsModule, CommonModule, FormsModule, ComponentsModule],
  declarations: [JournalEarlyStartModal],
})
export class JournalEarlyStartModule {}
