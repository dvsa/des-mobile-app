import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';

import { IonButton, IonCard, IonCol, IonRow, IonText } from '@ionic/angular';
import { LegalRequirementsModal } from './legal-requirements-modal';

@NgModule({
  declarations: [LegalRequirementsModal],
  imports: [ComponentsModule, CommonModule, IonButton, IonCol, IonRow, IonText, IonCard],
  exports: [LegalRequirementsModal],
})
export class LegalRequirementsModalModule {}
