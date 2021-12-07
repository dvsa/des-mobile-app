import { NgModule } from '@angular/core';
import { FormatIdPipe } from '@shared/pipes/format-id.pipe';
import { EllipsisPipe } from '@shared/pipes/ellipsis.pipe';
import { ModifyCompetencyLabel } from './modifyCompetencyLabel';

@NgModule({
  declarations: [
    ModifyCompetencyLabel,
    FormatIdPipe,
    EllipsisPipe,
  ],
  exports: [
    ModifyCompetencyLabel,
    FormatIdPipe,
    EllipsisPipe,
  ],
  imports: [],
})
export class PipesModule {
}
