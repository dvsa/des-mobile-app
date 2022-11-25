import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '@directives/directives.module';

import { PipesModule } from '@shared/pipes/pipes.module';
import { DateTimeInputComponent } from '@pages/test-results-search/components/datetime-input/date-time-input.component';
import { SearchResultComponent } from './search-result/search-result';
import { AdvancedSearchComponent } from './advanced-search/advanced-search';

@NgModule({
  declarations: [
    SearchResultComponent,
    AdvancedSearchComponent,
    DateTimeInputComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    DirectivesModule,
    IonicModule,
    FormsModule,
    PipesModule,
  ],
  exports: [
    SearchResultComponent,
    AdvancedSearchComponent,
    DateTimeInputComponent,
  ],
})
export class TestResultsSearchComponentsModule {}
