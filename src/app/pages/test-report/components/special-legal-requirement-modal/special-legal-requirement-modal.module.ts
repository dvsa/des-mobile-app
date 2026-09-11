import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';

import { IonButton, IonCard, IonCol, IonRow, IonText } from '@ionic/angular';
import { SpecialLegalRequirementModal } from './special-legal-requirement-modal';

@NgModule({
  declarations: [SpecialLegalRequirementModal],
  imports: [ComponentsModule, IonText, IonButton, IonCol, IonRow, IonCard],
  exports: [SpecialLegalRequirementModal],
})
export class SpecialLegalRequirementModalModule {}
