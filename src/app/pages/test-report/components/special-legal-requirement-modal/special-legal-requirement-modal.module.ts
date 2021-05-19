import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '@components/common/common-components.module';
import { SpecialLegalRequirementModal } from './special-legal-requirement-modal';

@NgModule({
  declarations: [
    SpecialLegalRequirementModal,
  ],
  imports: [
    ComponentsModule,
    IonicModule,
  ],
  exports: [
    SpecialLegalRequirementModal,
  ],
})
export class SpecialLegalRequirementModalModule { }
