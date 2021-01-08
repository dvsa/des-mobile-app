import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProfileHeaderComponent } from './profile-header/profile-header';
import { GoToJournalCardComponent } from './go-to-journal-card/go-to-journal-card';

@NgModule({
  declarations: [
    ProfileHeaderComponent,
    GoToJournalCardComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    ProfileHeaderComponent,
    GoToJournalCardComponent,
  ],
})

export class DashboardComponentsModule { }
