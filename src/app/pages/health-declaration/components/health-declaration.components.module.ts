import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { ReactiveFormsModule } from '@angular/forms';
import {
  HealthDeclarationModal,
} from '@pages/health-declaration/components/health-declaration-modal/health-declaration-modal';
import { CommonModule } from '@angular/common';
import { HealthDeclarationComponent } from './health-declaration/health-declaration';
import { ReceiptDeclarationComponent } from './receipt-declaration/receipt-declaration';

@NgModule({
  declarations: [
    HealthDeclarationComponent,
    ReceiptDeclarationComponent,
    HealthDeclarationModal,
  ],
  imports: [
    IonicModule,
    TranslateModule,
    ComponentsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  exports: [
    HealthDeclarationComponent,
    ReceiptDeclarationComponent,
  ],
})
export class HealthDeclarationComponentsModule { }
