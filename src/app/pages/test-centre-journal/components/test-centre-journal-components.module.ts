import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CandidateSearchCardComponent } from './candidate-search-card/candidate-search-card';

@NgModule({
  declarations: [
    CandidateSearchCardComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
  ],
  exports: [
    CandidateSearchCardComponent,
  ],
})
export class TestCentreJournalComponentsModule { }
