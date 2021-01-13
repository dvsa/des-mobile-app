import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProfileHeaderComponent } from './profile-header/profile-header';
import { GoToJournalCardComponent } from './go-to-journal-card/go-to-journal-card';
import { TestResultsSearchCardComponent } from './test-results-search-card/test-results-search-card';
import { RekeySearchCardComponent } from './rekey-search-card/rekey-search-card';

@NgModule({
  declarations: [
    ProfileHeaderComponent,
    GoToJournalCardComponent,
    RekeySearchCardComponent,
    TestResultsSearchCardComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    ProfileHeaderComponent,
    GoToJournalCardComponent,
    RekeySearchCardComponent,
    TestResultsSearchCardComponent,
  ],
})

export class DashboardComponentsModule { }
