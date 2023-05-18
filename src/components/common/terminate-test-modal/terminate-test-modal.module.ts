import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { TerminateTestModal } from '@components/common/terminate-test-modal/terminate-test-modal';
import { HeaderComponentModule } from '@components/common/header-component/header-component.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    HeaderComponentModule,
  ],
  declarations: [TerminateTestModal],
})
export class TerminateTestModalModule {}
