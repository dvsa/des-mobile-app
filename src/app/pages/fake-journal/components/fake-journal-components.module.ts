import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TestSlotComponentsModule } from '@components/test-slot/test-slot-components.module';
import { PreviewModeModalModule } from '@pages/fake-journal/components/preview-mode-modal/preview-mode-modal.module';
import { FakeTestSlotComponent } from './fake-test-slot/fake-test-slot';
import { JournalComponentsModule } from '../../journal/components/journal-components.module';

@NgModule({
  declarations: [
    FakeTestSlotComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    JournalComponentsModule,
    TestSlotComponentsModule,
    PreviewModeModalModule,
  ],
  exports: [
    FakeTestSlotComponent,
  ],
})
export class FakeJournalComponentsModule {
}
