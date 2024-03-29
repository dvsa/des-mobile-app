import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DirectivesModule } from '@directives/directives.module';
import { ConductedLanguageComponent } from './conducted-language/conducted-language';
import { InsuranceDeclarationComponent } from './insurance-declaration/insurance-declaration';
import { ResidencyDeclarationComponent } from './residency-declaration/residency-declaration';
import { CBTNumberComponent } from './cbt-number/cbt-number';
import { ManoeuvresPassCertificateComponent } from './manoeuvres-pass-cert/manoeuvres-pass-cert';

@NgModule({
  declarations: [
    ConductedLanguageComponent,
    InsuranceDeclarationComponent,
    ResidencyDeclarationComponent,
    CBTNumberComponent,
    ManoeuvresPassCertificateComponent,
  ],
  imports: [
    IonicModule,
    TranslateModule,
    ComponentsModule,
    ReactiveFormsModule,
    CommonModule,
    DirectivesModule,
  ],
  exports: [
    ConductedLanguageComponent,
    InsuranceDeclarationComponent,
    ResidencyDeclarationComponent,
    CBTNumberComponent,
    ManoeuvresPassCertificateComponent,
  ],
})
export class WaitingRoomComponentsModule { }
