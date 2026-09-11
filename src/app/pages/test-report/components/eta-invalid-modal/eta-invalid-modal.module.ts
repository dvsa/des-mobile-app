import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';

import { IonCard, IonCol, IonRow } from '@ionic/angular';
import { EtaInvalidModal } from './eta-invalid-modal';

@NgModule({
  declarations: [EtaInvalidModal],
  imports: [ComponentsModule, IonRow, IonCol, IonCard],
  exports: [EtaInvalidModal],
})
export class EtaInvalidModalModule {}
