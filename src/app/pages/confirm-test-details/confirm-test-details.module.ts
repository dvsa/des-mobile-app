import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';
import { ConfirmTestDetailsPageRoutingModule } from '@pages/confirm-test-details/confirm-test-details-routing.module';
import { CommonModule } from '@angular/common';
import { ConfirmSubmitModal } from '@pages/confirm-test-details/components/confirm-submit-modal/confirm-submit-modal';
import { ConfirmTestDetailsPage } from './confirm-test-details.page';

@NgModule({
  declarations: [
    ConfirmTestDetailsPage,
    ConfirmSubmitModal,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    IonicModule,
    ConfirmTestDetailsPageRoutingModule,
  ],
})
export class ConfirmTestDetailsPageModule {}
