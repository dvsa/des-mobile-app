import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CandidateSearchCardComponent } from './candidate-search-card/candidate-search-card';
import { CandidateSearchResultsComponent } from './candidate-search-results/candidate-search-results';
import { ComponentsModule } from '../../../../components/common/common-components.module';

@NgModule({
  declarations: [
    CandidateSearchCardComponent,
    CandidateSearchResultsComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    ComponentsModule,
  ],
  exports: [
    CandidateSearchCardComponent,
    CandidateSearchResultsComponent,
  ],
})
export class TestCentreJournalComponentsModule { }
