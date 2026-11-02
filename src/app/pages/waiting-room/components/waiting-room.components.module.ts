import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { IonCol, IonInput, IonRow } from '@ionic/angular';
import { MaskitoDirective } from '@maskito/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { CBTNumberComponent } from './cbt-number/cbt-number';
import { ConductedLanguageComponent } from './conducted-language/conducted-language';
import { InsuranceDeclarationComponent } from './insurance-declaration/insurance-declaration';
import { ManoeuvresPassCertificateComponent } from './manoeuvres-pass-cert/manoeuvres-pass-cert';
import { ResidencyDeclarationComponent } from './residency-declaration/residency-declaration';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MaskitoDirective,
    IonCol,
    IonRow,
    IonInput,
    TranslatePipe,
    ConductedLanguageComponent,
    InsuranceDeclarationComponent,
    ResidencyDeclarationComponent,
    CBTNumberComponent,
    ManoeuvresPassCertificateComponent,
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
