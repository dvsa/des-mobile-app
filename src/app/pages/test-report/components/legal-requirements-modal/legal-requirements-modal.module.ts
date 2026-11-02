import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IonButton, IonCard, IonCol, IonRow, IonText } from '@ionic/angular';
import { LegalRequirementsModal } from './legal-requirements-modal';

@NgModule({
  imports: [CommonModule, IonButton, IonCol, IonRow, IonText, IonCard, LegalRequirementsModal],
  exports: [LegalRequirementsModal],
})
export class LegalRequirementsModalModule {}
