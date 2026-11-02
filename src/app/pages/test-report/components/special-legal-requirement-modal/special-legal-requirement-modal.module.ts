import { NgModule } from '@angular/core';

import { IonButton, IonCard, IonCol, IonRow, IonText } from '@ionic/angular';
import { SpecialLegalRequirementModal } from './special-legal-requirement-modal';

@NgModule({
  imports: [IonText, IonButton, IonCol, IonRow, IonCard, SpecialLegalRequirementModal],
  exports: [SpecialLegalRequirementModal],
})
export class SpecialLegalRequirementModalModule {}
