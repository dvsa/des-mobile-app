import { NgModule } from '@angular/core';

import { EndTestModal } from './end-test-modal';
import {IonButton, IonCard, IonCol, IonRow, IonText} from "@ionic/angular";

@NgModule({
    declarations: [EndTestModal],

    exports: [EndTestModal],
  imports: [
    IonText,
    IonCol,
    IonRow,
    IonCard,
    IonButton
  ]
})
export class EndTestModalModule {}
