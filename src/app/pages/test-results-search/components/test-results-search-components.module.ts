import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '@directives/directives.module';

import { SearchResultComponent } from './search-result/search-result';
import { AdvancedSearchComponent } from './advanced-search/advanced-search';

@NgModule({
  declarations: [
    SearchResultComponent,
    AdvancedSearchComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    DirectivesModule,
    IonicModule,
    FormsModule,
  ],
  exports: [
    SearchResultComponent,
    AdvancedSearchComponent,
  ],
})
export class TestResultsSearchComponentsModule {}
