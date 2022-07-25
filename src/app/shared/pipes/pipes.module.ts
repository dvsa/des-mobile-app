import { NgModule } from '@angular/core';
import { FormatIdPipe } from '@shared/pipes/format-id.pipe';
import { EllipsisPipe } from '@shared/pipes/ellipsis.pipe';
import { CustomKeyValuePipe } from '@shared/pipes/customKeyValue.pipe';
import { ModifyCompetencyLabel } from './modifyCompetencyLabel';

@NgModule({
  declarations: [
    ModifyCompetencyLabel,
    FormatIdPipe,
    EllipsisPipe,
    CustomKeyValuePipe,
  ],
  exports: [
    ModifyCompetencyLabel,
    FormatIdPipe,
    EllipsisPipe,
    CustomKeyValuePipe,
  ],
  imports: [],
})
export class PipesModule {
}
