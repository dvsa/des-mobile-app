import { NgModule } from '@angular/core';

import { IonButton, IonCard, IonCol, IonRow } from '@ionic/angular';
import { LinkModalComponent } from '@pages/useful-links/components/link-modal/link-modal.component';

@NgModule({
  exports: [LinkModalComponent],
  imports: [IonCol, IonRow, IonButton, IonCard, LinkModalComponent],
})
export class UsefulLinksComponentsModule {}
