import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LegalRequirementsModal } from './legal-requirements-modal';
import { ComponentsModule } from '../../../../components/common/common-components.module';

@NgModule({
  declarations: [
    LegalRequirementsModal,
  ],
  imports: [
    IonicPageModule.forChild(LegalRequirementsModal),
    ComponentsModule,
  ],
  exports: [
    LegalRequirementsModal,
  ],
})
export class LegalRequirementsModalModule { }
