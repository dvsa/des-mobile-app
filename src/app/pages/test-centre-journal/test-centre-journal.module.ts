import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { TestCentreJournalPage } from './test-centre-journal.page';
import { TestCentreJournalRoutingModule } from './test-centre-journal-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestCentreJournalRoutingModule,
  ],
  declarations: [
    TestCentreJournalPage,
  ],
})
export class TestCentreJournalModule { }
