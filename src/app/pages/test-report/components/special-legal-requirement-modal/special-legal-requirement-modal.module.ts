import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';

import { SpecialLegalRequirementModal } from './special-legal-requirement-modal';
import {IonButton, IonCard, IonCol, IonRow, IonText} from '@ionic/angular';

@NgModule({
  declarations: [SpecialLegalRequirementModal],
  imports: [ComponentsModule, IonText, IonButton, IonCol, IonRow, IonCard],
  exports: [SpecialLegalRequirementModal],
})
export class SpecialLegalRequirementModalModule {}
