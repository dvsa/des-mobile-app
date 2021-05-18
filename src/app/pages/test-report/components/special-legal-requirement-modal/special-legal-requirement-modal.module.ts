import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpecialLegalRequirementModal } from './special-legal-requirement-modal';
import { ComponentsModule } from '../../../../components/common/common-components.module';

@NgModule({
  declarations: [
    SpecialLegalRequirementModal,
  ],
  imports: [
    IonicPageModule.forChild(SpecialLegalRequirementModal),
    ComponentsModule,
  ],
  exports: [
    SpecialLegalRequirementModal,
  ],
})
export class SpecialLegalRequirementModalModule { }
