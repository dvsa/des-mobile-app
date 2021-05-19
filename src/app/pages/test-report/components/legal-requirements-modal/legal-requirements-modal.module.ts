import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LegalRequirementsModal } from './legal-requirements-modal';

@NgModule({
  declarations: [
    LegalRequirementsModal,
  ],
  imports: [
    ComponentsModule,
    IonicModule,
    CommonModule,
  ],
  exports: [
    LegalRequirementsModal,
  ],
})
export class LegalRequirementsModalModule { }
