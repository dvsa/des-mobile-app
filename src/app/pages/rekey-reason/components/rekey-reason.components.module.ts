import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '@directives/directives.module';
import { ComponentsModule } from '@components/common/common-components.module';
import { UploadRekeyModalModule } from '@pages/rekey-reason/components/upload-rekey-modal/upload-rekey-modal.module';

import { IpadIssueComponent } from './ipad-issue/ipad-issue';
import { TransferComponent } from './transfer/transfer';
import { OtherReasonComponent } from './other-reason/other-reason';

@NgModule({
  declarations: [
    IpadIssueComponent,
    TransferComponent,
    OtherReasonComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    IonicModule,
    ReactiveFormsModule,
    DirectivesModule,
    UploadRekeyModalModule,
  ],
  exports: [
    IpadIssueComponent,
    TransferComponent,
    OtherReasonComponent,
  ],
})
export class RekeyReasonComponentsModule { }
