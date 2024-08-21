import { NgModule } from '@angular/core';
import { ContainsPipe } from '@shared/pipes/contains.pipe';
import { CustomKeyValuePipe } from '@shared/pipes/customKeyValue.pipe';
import { EllipsisPipe } from '@shared/pipes/ellipsis.pipe';
import { FormatIdPipe } from '@shared/pipes/format-id.pipe';

import { ModifyCompetencyLabel } from './modifyCompetencyLabel';

@NgModule({
  declarations: [ModifyCompetencyLabel, FormatIdPipe, EllipsisPipe, CustomKeyValuePipe, ContainsPipe],
  exports: [ModifyCompetencyLabel, FormatIdPipe, EllipsisPipe, CustomKeyValuePipe, ContainsPipe],
  imports: [],
})
export class PipesModule {}
