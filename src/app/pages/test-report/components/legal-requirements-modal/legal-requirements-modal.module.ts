import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { IonicModule } from '@ionic/angular';
import { LegalRequirementsModal } from './legal-requirements-modal';

@NgModule({
  declarations: [LegalRequirementsModal],
  imports: [ComponentsModule, IonicModule, CommonModule, ModalAlertTitleComponent],
  exports: [LegalRequirementsModal],
})
export class LegalRequirementsModalModule {}
