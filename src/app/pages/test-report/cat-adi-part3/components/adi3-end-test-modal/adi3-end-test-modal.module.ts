import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CPCEndTestModalModule } from '@pages/test-report/cat-cpc/components/cpc-end-test-modal/cpc-end-test-modal.module';
import { Adi3EndTestModal } from './adi3-end-test-modal';
import {IonButton, IonCard, IonCol, IonRow, IonText} from '@ionic/angular';

@NgModule({
  declarations: [Adi3EndTestModal],
  exports: [Adi3EndTestModal],
  imports: [CommonModule, CPCEndTestModalModule, IonButton, IonCol, IonRow, IonText, IonCard],
})
export class Adi3EndTestModalModule {}
