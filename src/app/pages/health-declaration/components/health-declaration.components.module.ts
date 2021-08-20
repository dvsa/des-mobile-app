import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { SignatureComponent } from './signature/signature';
import { HealthDeclarationComponent } from './health-declaration/health-declaration';
import { ReceiptDeclarationComponent } from './receipt-declaration/receipt-declaration';

@NgModule({
  declarations: [
    SignatureComponent,
    HealthDeclarationComponent,
    ReceiptDeclarationComponent,
  ],
  imports: [
    IonicModule,
    TranslateModule,
    ComponentsModule,
  ],
  exports: [
    SignatureComponent,
    HealthDeclarationComponent,
    ReceiptDeclarationComponent,
  ],
})
export class HealthDeclarationComponentsModule { }
