import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {
  CPCEndTestModalModule,
} from '@pages/test-report/cat-cpc/components/cpc-end-test-modal/cpc-end-test-modal.module';
import { HeaderComponentModule } from '@components/common/header-component/header-component.module';
import { Adi3EndTestModal } from './adi3-end-test-modal';

@NgModule({
  declarations: [
    Adi3EndTestModal,
  ],
  exports: [
    Adi3EndTestModal,
  ],
  imports: [
    IonicModule,
    CommonModule,
    CPCEndTestModalModule,
    HeaderComponentModule,
  ],
})
export class Adi3EndTestModalModule {}
