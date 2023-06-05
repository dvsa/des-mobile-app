import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';
import { DirectivesModule } from '@directives/directives.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LicenseProvidedComponent } from '@pages/pass-finalisation/components/license-provided/license-provided';
import {
  LicenceProvidedWarningBannerComponent,
} from '@pages/pass-finalisation/components/licence-provided-warning-banner/licence-provided-warning-banner';
import { Code78Component } from '@pages/pass-finalisation/components/code-78/code-78';
import {
  ApplicationReferenceComponent,
} from '@pages/pass-finalisation/components/application-reference/application-reference';
import {
  FurtherDevelopmentComponent,
} from '@pages/pass-finalisation/components/further-development/further-development.component';
import {
  PassCertificateNumberCatAMod1Component,
} from '@pages/pass-finalisation/components/pass-cert-number-mod1/pass-certificate-number.cat-a-mod1';
import { ReasonGivenComponent } from '@pages/pass-finalisation/components/reason-given/reason-given.component';
import {
  TestStartEndTimesComponent,
} from '@pages/pass-finalisation/components/test-start-end-times/test-start-end-times';
import { PassCertificateNumberComponent } from './pass-certificate-number/pass-certificate-number';

@NgModule({
  declarations: [
    LicenseProvidedComponent,
    PassCertificateNumberComponent,
    Code78Component,
    LicenceProvidedWarningBannerComponent,
    ApplicationReferenceComponent,
    FurtherDevelopmentComponent,
    PassCertificateNumberCatAMod1Component,
    ReasonGivenComponent,
    TestStartEndTimesComponent,
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
    Code78Component,
    LicenceProvidedWarningBannerComponent,
    ApplicationReferenceComponent,
    FurtherDevelopmentComponent,
    PassCertificateNumberCatAMod1Component,
    ReasonGivenComponent,
    TestStartEndTimesComponent,
  ],
})
export class PassFinalisationComponentsModule {
}
