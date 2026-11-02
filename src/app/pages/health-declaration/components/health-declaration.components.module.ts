import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { IonButton, IonCard, IonCol, IonRow } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { HealthDeclarationModal } from '@pages/health-declaration/components/health-declaration-modal/health-declaration-modal';
import { HealthDeclarationComponent } from './health-declaration/health-declaration';
import { ReceiptDeclarationComponent } from './receipt-declaration/receipt-declaration';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    IonCol,
    IonRow,
    TranslatePipe,
    IonCard,
    IonButton,
    HealthDeclarationComponent,
    ReceiptDeclarationComponent,
    HealthDeclarationModal,
  ],
  exports: [HealthDeclarationComponent, ReceiptDeclarationComponent],
})
export class HealthDeclarationComponentsModule {}
