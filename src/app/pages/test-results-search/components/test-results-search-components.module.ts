import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from '@components/common/common-components.module';
import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonCard,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
} from '@ionic/angular';

import { AdvancedSearchComponent } from './advanced-search/advanced-search';
import { SearchResultComponent } from './search-result/search-result';

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    IonCol,
    IonSpinner,
    IonIcon,
    IonText,
    IonButton,
    IonRow,
    IonGrid,
    IonInput,
    IonSelect,
    IonAccordion,
    IonItem,
    IonAccordionGroup,
    IonSelectOption,
    IonCard,
    SearchResultComponent,
    AdvancedSearchComponent,
  ],
  exports: [SearchResultComponent, AdvancedSearchComponent],
})
export class TestResultsSearchComponentsModule {}
