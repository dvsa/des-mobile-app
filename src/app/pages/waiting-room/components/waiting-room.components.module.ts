import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ConductedLanguageComponent } from './conducted-language/conducted-language';
import { InsuranceDeclarationComponent } from './insurance-declaration/insurance-declaration';
import { ResidencyDeclarationComponent } from './residency-declaration/residency-declaration';
import { SignatureComponent } from './signature/signature';
import { CBTNumberComponent } from './cbt-number/cbt-number';

@NgModule({
  declarations: [
    ConductedLanguageComponent,
    InsuranceDeclarationComponent,
    ResidencyDeclarationComponent,
    SignatureComponent,
    CBTNumberComponent,
  ],
  imports: [
    IonicModule,
    TranslateModule,
    ComponentsModule,
    ReactiveFormsModule,
  ],
  exports: [
    ConductedLanguageComponent,
    InsuranceDeclarationComponent,
    ResidencyDeclarationComponent,
    SignatureComponent,
    CBTNumberComponent,
  ],
})
export class WaitingRoomComponentsModule { }
