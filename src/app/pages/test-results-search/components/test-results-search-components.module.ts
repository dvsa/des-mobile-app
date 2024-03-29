import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '@directives/directives.module';

import { PipesModule } from '@shared/pipes/pipes.module';
import { ComponentsModule } from '@components/common/common-components.module';
import { SearchResultComponent } from './search-result/search-result';
import { AdvancedSearchComponent } from './advanced-search/advanced-search';

@NgModule({
  declarations: [
    SearchResultComponent,
    AdvancedSearchComponent,
  ],
  imports: [
    ComponentsModule,
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
  ],
})
export class TestResultsSearchComponentsModule {}
