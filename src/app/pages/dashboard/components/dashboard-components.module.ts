import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';

import { IonButton, IonCard, IonCol, IonGrid, IonIcon, IonRow, IonText } from '@ionic/angular';
import { PracticeTestModal } from '@pages/dashboard/components/practice-test-modal/practice-test-modal';
import { DelegatedSearchCardComponent } from './delegated-rekey-card/delegated-rekey-card';
import { GoToJournalCardComponent } from './go-to-journal-card/go-to-journal-card';
import { PracticeEndToEndCardComponent } from './practice-end-to-end-card/practice-end-to-end-card';
import { PracticeTestReportCardComponent } from './practice-test-report-card/practice-test-report-card';
import { ProfileHeaderComponent } from './profile-header/profile-header';
import { RekeySearchCardComponent } from './rekey-search-card/rekey-search-card';
import { TestCentreJournalCardComponent } from './test-centre-journal-card/test-centre-journal-card';
import { TestResultsSearchCardComponent } from './test-results-search-card/test-results-search-card';
import { UpdateAvailableModal } from './update-available-modal/update-available-modal';

@NgModule({
  imports: [
    CommonModule,
    IonCol,
    IonRow,
    IonButton,
    IonCard,
    IonText,
    IonGrid,
    IonIcon,
    NgOptimizedImage,
    ProfileHeaderComponent,
    GoToJournalCardComponent,
    RekeySearchCardComponent,
    PracticeEndToEndCardComponent,
    TestResultsSearchCardComponent,
    PracticeTestReportCardComponent,
    TestCentreJournalCardComponent,
    PracticeTestModal,
    DelegatedSearchCardComponent,
    UpdateAvailableModal,
  ],
  exports: [
    ProfileHeaderComponent,
    GoToJournalCardComponent,
    RekeySearchCardComponent,
    PracticeEndToEndCardComponent,
    TestResultsSearchCardComponent,
    PracticeTestReportCardComponent,
    TestCentreJournalCardComponent,
    PracticeTestModal,
    DelegatedSearchCardComponent,
    UpdateAvailableModal,
  ],
})
export class DashboardComponentsModule {}
