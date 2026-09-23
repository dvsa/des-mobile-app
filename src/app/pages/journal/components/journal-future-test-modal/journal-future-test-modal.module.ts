import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from '@components/common/common-components.module';
import { JournalFutureTestModal } from '@pages/journal/components/journal-future-test-modal/journal-future-test-modal';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  imports: [IonicComponentsModule, CommonModule, FormsModule, ComponentsModule],
  declarations: [JournalFutureTestModal],
})
export class JournalFutureTestModalModule {}
