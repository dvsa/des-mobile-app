import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';

import { ExitRekeyModalModule } from '@pages/rekey-reason/components/exit-rekey-modal/exit-rekey-modal.module';
import { UploadRekeyModalModule } from '@pages/rekey-reason/components/upload-rekey-modal/upload-rekey-modal.module';

import { IonCol, IonInput, IonItem, IonRow } from '@ionic/angular';
import { IpadIssueComponent } from './ipad-issue/ipad-issue';
import { OtherReasonComponent } from './other-reason/other-reason';
import { TransferComponent } from './transfer/transfer';

@NgModule({
  declarations: [IpadIssueComponent, TransferComponent, OtherReasonComponent],
  imports: [
    CommonModule,
    ComponentsModule,

    ReactiveFormsModule,
    DirectivesModule,
    UploadRekeyModalModule,
    ExitRekeyModalModule,
    IonCol,
    IonRow,
    IonItem,
    IonInput,
  ],
  exports: [IpadIssueComponent, TransferComponent, OtherReasonComponent],
})
export class RekeyReasonComponentsModule {}
