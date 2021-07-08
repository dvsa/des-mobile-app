import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';
import { DirectivesModule } from '@directives/directives.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LicenseProvidedComponent } from '@pages/pass-finalisation/components/license-provided/license-provided';
import { LicenceProvidedWarningBannerComponent }
  from '@pages/pass-finalisation/components/licence-provided-warning-banner/licence-provided-warning-banner';
import { PassCertificateNumberComponent } from './pass-certificate-number/pass-certificate-number';

@NgModule({
  declarations: [
    LicenseProvidedComponent,
    PassCertificateNumberComponent,
    LicenceProvidedWarningBannerComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    IonicModule,
    DirectivesModule,
    ReactiveFormsModule,
  ],
  exports: [
    LicenseProvidedComponent,
    PassCertificateNumberComponent,
    LicenceProvidedWarningBannerComponent,
  ],
})
export class PassFinalisationComponentsModule { }
