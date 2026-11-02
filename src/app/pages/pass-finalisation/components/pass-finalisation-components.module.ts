import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { IonCol, IonInput, IonRow } from '@ionic/angular';
import { ApplicationReferenceComponent } from '@pages/pass-finalisation/components/application-reference/application-reference';
import { Code78Component } from '@pages/pass-finalisation/components/code-78/code-78';
import { LicenceProvidedWarningBannerComponent } from '@pages/pass-finalisation/components/licence-provided-warning-banner/licence-provided-warning-banner';
import { LicenseProvidedComponent } from '@pages/pass-finalisation/components/license-provided/license-provided';
import { PassCertificateNumberComponent } from './pass-certificate-number/pass-certificate-number';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonCol,
    IonRow,
    IonInput,
    LicenseProvidedComponent,
    PassCertificateNumberComponent,
    Code78Component,
    LicenceProvidedWarningBannerComponent,
    ApplicationReferenceComponent,
  ],
  exports: [
    LicenseProvidedComponent,
    PassCertificateNumberComponent,
    Code78Component,
    LicenceProvidedWarningBannerComponent,
    ApplicationReferenceComponent,
  ],
})
export class PassFinalisationComponentsModule {}
