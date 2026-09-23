import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';

import { LegalRequirementsModal } from './legal-requirements-modal';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [LegalRequirementsModal],
  imports: [IonicComponentsModule, ComponentsModule, CommonModule],
  exports: [LegalRequirementsModal],
})
export class LegalRequirementsModalModule {}
