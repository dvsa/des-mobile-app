import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '@directives/directives.module';


import { ComponentsModule } from '@components/common/common-components.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { AdvancedSearchComponent } from './advanced-search/advanced-search';
import { SearchResultComponent } from './search-result/search-result';
import {
  IonAccordion, IonAccordionGroup,
  IonButton, IonCard,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput, IonItem,
  IonRow,
  IonSelect, IonSelectOption,
  IonSpinner,
  IonText
} from "@ionic/angular";

@NgModule({
  declarations: [SearchResultComponent, AdvancedSearchComponent],
  imports: [ComponentsModule, CommonModule, DirectivesModule, FormsModule, PipesModule, IonCol, IonSpinner, IonIcon, IonText, IonButton, IonRow, IonGrid, IonInput, IonSelect, IonAccordion, IonItem, IonAccordionGroup, IonSelectOption, IonCard],
  exports: [SearchResultComponent, AdvancedSearchComponent],
})
export class TestResultsSearchComponentsModule {}
