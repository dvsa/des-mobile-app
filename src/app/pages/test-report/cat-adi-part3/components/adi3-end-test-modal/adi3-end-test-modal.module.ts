import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CPCEndTestModalModule } from '@pages/test-report/cat-cpc/components/cpc-end-test-modal/cpc-end-test-modal.module';
import { Adi3EndTestModal } from './adi3-end-test-modal';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [Adi3EndTestModal],
  exports: [Adi3EndTestModal],
  imports: [IonicComponentsModule, CommonModule, CPCEndTestModalModule],
})
export class Adi3EndTestModalModule {}
