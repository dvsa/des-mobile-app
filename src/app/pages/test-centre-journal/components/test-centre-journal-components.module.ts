import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { TestSlotComponentsModule } from '@components/test-slot/test-slot-components.module';


import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { JournalComponentsModule } from '../../journal/components/journal-components.module';
import { CandidateSearchCardComponent } from './candidate-search-card/candidate-search-card';
import { TestCentreNameComponent } from './test-centre-name/test-centre-name';
import { ViewJournalsCardComponent } from './view-journals-card/view-journals-card';
import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonList,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText
} from "@ionic/angular";

@NgModule({
  declarations: [CandidateSearchCardComponent, TestCentreNameComponent, ViewJournalsCardComponent],
  imports: [CommonModule, JournalComponentsModule, ComponentsModule, TestSlotComponentsModule, IonCol, IonRow, IonIcon, IonText, IonButton, IonGrid, IonSelect, IonSelectOption, IonList],
  providers: [OrientationMonitorProvider],
  exports: [CandidateSearchCardComponent, TestCentreNameComponent, ViewJournalsCardComponent],
})
export class TestCentreJournalComponentsModule {}
