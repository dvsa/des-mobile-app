import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { IonicModule } from '@ionic/angular';
import { SpecialLegalRequirementModal } from './special-legal-requirement-modal';

@NgModule({
  declarations: [SpecialLegalRequirementModal],
  imports: [ComponentsModule, IonicModule, ModalAlertTitleComponent],
  exports: [SpecialLegalRequirementModal],
})
export class SpecialLegalRequirementModalModule {}
