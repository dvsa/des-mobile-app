import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';
import { IonicModule } from '@ionic/angular';
import { ExitRekeyModalModule } from '@pages/rekey-reason/components/exit-rekey-modal/exit-rekey-modal.module';
import { UploadRekeyModalModule } from '@pages/rekey-reason/components/upload-rekey-modal/upload-rekey-modal.module';

import { IpadIssueComponent } from './ipad-issue/ipad-issue';
import { OtherReasonComponent } from './other-reason/other-reason';
import { TransferComponent } from './transfer/transfer';

@NgModule({
  declarations: [IpadIssueComponent, TransferComponent, OtherReasonComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    IonicModule,
    ReactiveFormsModule,
    DirectivesModule,
    UploadRekeyModalModule,
    ExitRekeyModalModule,
  ],
  exports: [IpadIssueComponent, TransferComponent, OtherReasonComponent],
})
export class RekeyReasonComponentsModule {}
