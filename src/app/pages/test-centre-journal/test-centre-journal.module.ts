import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { TestCentreJournalPage } from './test-centre-journal.page';
import { TestCentreJournalRoutingModule } from './test-centre-journal-routing.module';
import { ComponentsModule } from '../../../components/common/common-components.module';
import { TestCentreJournalComponentsModule } from './components/test-centre-journal-components.module';
import { TestSlotComponentsModule } from '../../../components/test-slot/test-slot-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestCentreJournalRoutingModule,
    TestCentreJournalComponentsModule,
    ComponentsModule,
    TestSlotComponentsModule,
    TestCentreJournalComponentsModule,
  ],
  declarations: [
    TestCentreJournalPage,
  ],
})
export class TestCentreJournalModule { }
