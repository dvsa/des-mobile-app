import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TerminateTestModal } from '@components/common/terminate-test-modal/terminate-test-modal';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  imports: [IonicComponentsModule, CommonModule],
  declarations: [TerminateTestModal],
})
export class TerminateTestModalModule {}
