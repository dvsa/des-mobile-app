import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { ActivitySlotComponent } from './activity-slot/activity-slot';
import { EmptySlotComponent } from './empty-slot/empty-slot';
import { JournalNavigationComponent } from './journal-navigation/journal-navigation';
import { PersonalCommitmentSlotComponent } from './personal-commitment/personal-commitment';
import { TestSlotComponentsModule } from '../../../../components/test-slot/test-slot-components.module';

@NgModule({
  declarations: [
    ActivitySlotComponent,
    EmptySlotComponent,
    JournalNavigationComponent,
    PersonalCommitmentSlotComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    TestSlotComponentsModule,
  ],
  entryComponents: [
    PersonalCommitmentSlotComponent,
  ],
  exports: [
    ActivitySlotComponent,
    EmptySlotComponent,
    JournalNavigationComponent,
    PersonalCommitmentSlotComponent,
  ],
})
export class JournalComponentsModule { }
