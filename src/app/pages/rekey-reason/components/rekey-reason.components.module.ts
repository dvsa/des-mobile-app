import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { IonCol, IonInput, IonItem, IonRow } from '@ionic/angular';
import { IpadIssueComponent } from './ipad-issue/ipad-issue';
import { OtherReasonComponent } from './other-reason/other-reason';
import { TransferComponent } from './transfer/transfer';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonCol,
    IonRow,
    IonItem,
    IonInput,
    IpadIssueComponent,
    TransferComponent,
    OtherReasonComponent,
  ],
  exports: [IpadIssueComponent, TransferComponent, OtherReasonComponent],
})
export class RekeyReasonComponentsModule {}
