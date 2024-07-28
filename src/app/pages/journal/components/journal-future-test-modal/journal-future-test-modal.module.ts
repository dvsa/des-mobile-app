import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { JournalFutureTestModal } from '@pages/journal/components/journal-future-test-modal/journal-future-test-modal';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ComponentsModule],
  declarations: [JournalFutureTestModal],
})
export class JournalFutureTestModalModule {}
