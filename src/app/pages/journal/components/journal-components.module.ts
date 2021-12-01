import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { TestSlotComponentsModule } from '@components/test-slot/test-slot-components.module';
import {
  JournalEarlyStartModule,
} from '@pages/journal/components/journal-early-start-modal/journal-early-start-modal.module';
import {
  JournalForceCheckModule,
} from '@pages/journal/components/journal-force-check-modal/journal-force-check-modal.module';
import { JournalRekeyModalModule } from '@pages/journal/components/journal-rekey-modal/journal-rekey-modal.module';
import { JournalSlotComponent } from '@pages/journal/components/journal-slot/journal-slot';
import { ActivitySlotComponent } from './activity-slot/activity-slot';
import { EmptySlotComponent } from './empty-slot/empty-slot';
import { JournalNavigationComponent } from './journal-navigation/journal-navigation';
import { PersonalCommitmentSlotComponent } from './personal-commitment/personal-commitment';

@NgModule({
  declarations: [
    ActivitySlotComponent,
    EmptySlotComponent,
    JournalNavigationComponent,
    PersonalCommitmentSlotComponent,
    JournalSlotComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    TestSlotComponentsModule,
    JournalEarlyStartModule,
    JournalForceCheckModule,
    JournalRekeyModalModule,
  ],
  entryComponents: [
    PersonalCommitmentSlotComponent,
  ],
  exports: [
    ActivitySlotComponent,
    EmptySlotComponent,
    JournalNavigationComponent,
    PersonalCommitmentSlotComponent,
    JournalSlotComponent,
  ],
})
export class JournalComponentsModule { }
