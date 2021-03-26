import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CandidateSearchCardComponent } from './candidate-search-card/candidate-search-card';
import { ComponentsModule } from '../../../../components/common/common-components.module';
import { TestSlotComponentsModule } from '../../../../components/test-slot/test-slot-components.module';

@NgModule({
  declarations: [
    CandidateSearchCardComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    ComponentsModule,
    TestSlotComponentsModule,
  ],
  exports: [
    CandidateSearchCardComponent,
  ],
})
export class TestCentreJournalComponentsModule { }
