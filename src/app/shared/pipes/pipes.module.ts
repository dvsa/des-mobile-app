import { NgModule } from '@angular/core';
import { FormatIdPipe } from '@shared/pipes/format-id.pipe';
import { ModifyCompetencyLabel } from './modifyCompetencyLabel';

@NgModule({
  declarations: [
    ModifyCompetencyLabel,
    FormatIdPipe,
  ],
  exports: [
    ModifyCompetencyLabel,
    FormatIdPipe,
  ],
  imports: [],
})
export class PipesModule {
}
