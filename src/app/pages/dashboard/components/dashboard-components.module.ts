import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProfileHeaderComponent } from './profile-header/profile-header';
import { RekeySearchCardComponent } from './rekey-search-card/rekey-search-card';
import { GoToJournalCardComponent } from './go-to-journal-card/go-to-journal-card';
import { TestResultsSearchCardComponent } from './test-results-search-card/test-results-search-card';
import { PracticeEndToEndCardComponent } from './practice-end-to-end-card/practice-end-to-end-card';
import { PracticeTestReportCardComponent } from './practice-test-report-card/practice-test-report-card';

@NgModule({
  declarations: [
    ProfileHeaderComponent,
    GoToJournalCardComponent,
    RekeySearchCardComponent,
    PracticeEndToEndCardComponent,
    TestResultsSearchCardComponent,
    PracticeTestReportCardComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    ProfileHeaderComponent,
    GoToJournalCardComponent,
    RekeySearchCardComponent,
    PracticeEndToEndCardComponent,
    TestResultsSearchCardComponent,
    PracticeTestReportCardComponent,
  ],
})

export class DashboardComponentsModule { }
