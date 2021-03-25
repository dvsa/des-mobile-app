import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CandidateSearchCardComponent } from './candidate-search-card/candidate-search-card';
import { TestCentreNameComponent } from './test-centre-name/test-centre-name';
import { ViewJournalsCardComponent } from './view-journals-card/view-journals-card';
import { JournalComponentsModule } from '../../journal/components/journal-components.module';
import { ComponentsModule } from '../../../../components/common/common-components.module';

@NgModule({
  declarations: [
    CandidateSearchCardComponent,
    TestCentreNameComponent,
    ViewJournalsCardComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    JournalComponentsModule,
    ComponentsModule,
  ],
  exports: [
    CandidateSearchCardComponent,
    TestCentreNameComponent,
    ViewJournalsCardComponent,
  ],
})
export class TestCentreJournalComponentsModule { }
