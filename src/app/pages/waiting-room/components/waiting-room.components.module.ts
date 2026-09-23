import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';
import { MaskitoDirective } from '@maskito/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { CBTNumberComponent } from './cbt-number/cbt-number';
import { ConductedLanguageComponent } from './conducted-language/conducted-language';
import { InsuranceDeclarationComponent } from './insurance-declaration/insurance-declaration';
import { ManoeuvresPassCertificateComponent } from './manoeuvres-pass-cert/manoeuvres-pass-cert';
import { ResidencyDeclarationComponent } from './residency-declaration/residency-declaration';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [
    ConductedLanguageComponent,
    InsuranceDeclarationComponent,
    ResidencyDeclarationComponent,
    CBTNumberComponent,
    ManoeuvresPassCertificateComponent,
  ],
  imports: [
    IonicComponentsModule,
    ComponentsModule,
    ReactiveFormsModule,
    CommonModule,
    DirectivesModule,
    MaskitoDirective,
    TranslatePipe,
  ],
  exports: [
    ConductedLanguageComponent,
    InsuranceDeclarationComponent,
    ResidencyDeclarationComponent,
    CBTNumberComponent,
    ManoeuvresPassCertificateComponent,
  ],
})
export class WaitingRoomComponentsModule {}
