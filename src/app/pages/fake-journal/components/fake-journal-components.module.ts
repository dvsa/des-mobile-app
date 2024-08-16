import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TestSlotComponentsModule } from '@components/test-slot/test-slot-components.module';
import { IonicModule } from '@ionic/angular';
import { PreviewModeModalModule } from '@pages/fake-journal/components/preview-mode-modal/preview-mode-modal.module';
import { JournalComponentsModule } from '../../journal/components/journal-components.module';

@NgModule({
  imports: [CommonModule, IonicModule, JournalComponentsModule, TestSlotComponentsModule, PreviewModeModalModule],
})
export class FakeJournalComponentsModule {}
