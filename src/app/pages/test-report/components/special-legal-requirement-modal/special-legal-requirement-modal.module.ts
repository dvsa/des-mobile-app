import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';

import { SpecialLegalRequirementModal } from './special-legal-requirement-modal';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [SpecialLegalRequirementModal],
  imports: [IonicComponentsModule, ComponentsModule],
  exports: [SpecialLegalRequirementModal],
})
export class SpecialLegalRequirementModalModule {}
