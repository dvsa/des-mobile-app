import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PracticeTestModal } from '@pages/dashboard/components/practice-test-modal/practice-test-modal';
import { ComponentsModule } from '@components/common/common-components.module';
import { ProfileHeaderComponent } from './profile-header/profile-header';
import { RekeySearchCardComponent } from './rekey-search-card/rekey-search-card';
import { GoToJournalCardComponent } from './go-to-journal-card/go-to-journal-card';
import { TestResultsSearchCardComponent } from './test-results-search-card/test-results-search-card';
import { PracticeEndToEndCardComponent } from './practice-end-to-end-card/practice-end-to-end-card';
import { PracticeTestReportCardComponent } from './practice-test-report-card/practice-test-report-card';
import { TestCentreJournalCardComponent } from './test-centre-journal-card/test-centre-journal-card';
import { DelegatedSearchCardComponent } from './delegated-rekey-card/delegated-rekey-card';
import { UpdateAvailableModal } from './update-available-modal/update-available-modal';

@NgModule({
  declarations: [
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
  imports: [
    CommonModule,
    IonicModule,
    ComponentsModule,
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

export class DashboardComponentsModule {
}
