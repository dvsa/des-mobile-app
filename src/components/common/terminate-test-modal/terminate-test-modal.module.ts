import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {
  TerminateTestModal,
} from '@components/common/terminate-test-modal/terminate-test-modal';
import {
  TerminateTestModalRoutingModule,
} from '@components/common/terminate-test-modal/terminate-test-modal.routing.module';

@NgModule({
  imports: [
    IonicModule,
    TerminateTestModalRoutingModule,
  ],
  declarations: [
    TerminateTestModal,
  ],
})
export class TerminateTestModalModule {}
