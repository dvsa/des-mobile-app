import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { TerminateTestModal } from '@components/common/terminate-test-modal/terminate-test-modal';

@NgModule({
	imports: [CommonModule, IonicModule],
	declarations: [TerminateTestModal],
})
export class TerminateTestModalModule {}
