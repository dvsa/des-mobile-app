import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HealthDeclarationComponent } from './health-declaration/health-declaration';
import { ReceiptDeclarationComponent } from './receipt-declaration/receipt-declaration';

@NgModule({
  declarations: [
    HealthDeclarationComponent,
    ReceiptDeclarationComponent,
  ],
  imports: [
    IonicModule,
    TranslateModule,
    ComponentsModule,
    ReactiveFormsModule,
  ],
  exports: [
    HealthDeclarationComponent,
    ReceiptDeclarationComponent,
  ],
})
export class HealthDeclarationComponentsModule { }
