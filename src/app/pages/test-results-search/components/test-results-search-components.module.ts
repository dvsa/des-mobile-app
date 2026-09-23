import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '@directives/directives.module';

import { ComponentsModule } from '@components/common/common-components.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { AdvancedSearchComponent } from './advanced-search/advanced-search';
import { SearchResultComponent } from './search-result/search-result';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [SearchResultComponent, AdvancedSearchComponent],
  imports: [IonicComponentsModule, ComponentsModule, CommonModule, DirectivesModule, FormsModule, PipesModule],
  exports: [SearchResultComponent, AdvancedSearchComponent],
})
export class TestResultsSearchComponentsModule {}
