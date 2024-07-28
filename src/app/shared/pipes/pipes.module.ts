import { NgModule } from '@angular/core';
import { ContainsPipe } from '@shared/pipes/contains.pipe';
import { CustomKeyValuePipe } from '@shared/pipes/customKeyValue.pipe';
import { EllipsisPipe } from '@shared/pipes/ellipsis.pipe';
import { FormatIdPipe } from '@shared/pipes/format-id.pipe';

import { RoleFilterPipe } from '@shared/pipes/roleFilter.pipe';
import { ModifyCompetencyLabel } from './modifyCompetencyLabel';

@NgModule({
	declarations: [ModifyCompetencyLabel, FormatIdPipe, EllipsisPipe, CustomKeyValuePipe, ContainsPipe, RoleFilterPipe],
	exports: [ModifyCompetencyLabel, FormatIdPipe, EllipsisPipe, CustomKeyValuePipe, ContainsPipe, RoleFilterPipe],
	imports: [],
})
export class PipesModule {}
