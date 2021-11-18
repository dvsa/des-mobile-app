import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { FakeJournalPageRoutingModule } from '@pages/fake-journal/fake-journal-routing.module';
import { ComponentsModule } from '@components/common/common-components.module';
import { TestSlotComponentsModule } from '@components/test-slot/test-slot-components.module';
import { FakeJournalComponentsModule } from '@pages/fake-journal/components/fake-journal-components.module';
import { EffectsModule } from '@ngrx/effects';
import { FakeJournalEffects } from '@pages/fake-journal/fake-journal.effects';
import { FakeJournalPage } from './fake-journal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FakeJournalPageRoutingModule,
    ComponentsModule,
    TestSlotComponentsModule,
    FakeJournalComponentsModule,
    EffectsModule.forFeature([
      FakeJournalEffects,
    ]),
  ],
  declarations: [
    FakeJournalPage,
  ],
})
export class FakeJournalPageModule {
}
