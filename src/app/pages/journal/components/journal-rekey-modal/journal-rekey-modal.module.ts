import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from '@components/common/common-components.module';
import { JournalRekeyModal } from '@pages/journal/components/journal-rekey-modal/journal-rekey-modal';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  imports: [IonicComponentsModule, CommonModule, FormsModule, ComponentsModule],
  declarations: [JournalRekeyModal],
})
export class JournalRekeyModalModule {}
