import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { TerminateTestModalRoutingModule } from '@pages/terminate-test-modal/terminate-test-modal.routing.module';
import { TerminateTestModal } from '@pages/terminate-test-modal/terminate-test-modal';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TerminateTestModalRoutingModule,
  ],
  declarations: [TerminateTestModal],
})
export class TerminateTestModalModule {}
