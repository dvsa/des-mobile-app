import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RefreshButtonComponent } from '@components/common/refresh-button/refresh-button.component';
import { TestSlotComponentsModule } from '@components/test-slot/test-slot-components.module';
import { IonCard, IonCol, IonGrid, IonIcon, IonRow, IonText } from '@ionic/angular';
import { JournalEarlyStartModule } from '@pages/journal/components/journal-early-start-modal/journal-early-start-modal.module';
import { JournalForceCheckModule } from '@pages/journal/components/journal-force-check-modal/journal-force-check-modal.module';
import { JournalFutureTestModalModule } from '@pages/journal/components/journal-future-test-modal/journal-future-test-modal.module';
import { JournalRekeyModalModule } from '@pages/journal/components/journal-rekey-modal/journal-rekey-modal.module';
import { JournalSlotComponent } from '@pages/journal/components/journal-slot/journal-slot';
import { LearnMoreModal } from '@pages/journal/components/learn-more-modal/learn-more-modal';
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
    LearnMoreModal,
    CommonModule,
    TestSlotComponentsModule,
    JournalEarlyStartModule,
    JournalForceCheckModule,
    JournalRekeyModalModule,
    JournalFutureTestModalModule,
    RefreshButtonComponent,
    IonText,
    IonCol,
    IonRow,
    IonCard,
    IonGrid,
    IonIcon,
  ],
  exports: [
    ActivitySlotComponent,
    EmptySlotComponent,
    JournalNavigationComponent,
    PersonalCommitmentSlotComponent,
    JournalSlotComponent,
  ],
})
export class JournalComponentsModule {}
